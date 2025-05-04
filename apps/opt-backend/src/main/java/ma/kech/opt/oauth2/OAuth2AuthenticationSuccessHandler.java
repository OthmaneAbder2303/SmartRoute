package ma.kech.opt.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import ma.kech.opt.entity.User;
import ma.kech.opt.repository.UserRepository;
import ma.kech.opt.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  @Value("${app.oauth2.redirectUri:http://localhost:4200/oauth2/redirect}")
  private String redirectUri;

  private final JwtUtils jwtUtils;
  private final UserRepository userRepository;

  @Autowired
  public OAuth2AuthenticationSuccessHandler(JwtUtils jwtUtils, UserRepository userRepository) {
    this.jwtUtils = jwtUtils;
    this.userRepository = userRepository;
  }

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
    String targetUrl = determineTargetUrl(request, response, authentication);

    if (response.isCommitted()) {
      logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
      return;
    }

    clearAuthenticationAttributes(request);
    getRedirectStrategy().sendRedirect(request, response, targetUrl);
  }

  protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) {
    Optional<String> redirectUriAfterLogin = Optional.ofNullable(request.getParameter("redirect_uri"));

    String targetUrl = redirectUriAfterLogin.orElse(redirectUri);

    String token = generateToken(authentication);

    return UriComponentsBuilder.fromUriString(targetUrl)
      .queryParam("token", token)
      .build().toUriString();
  }

  private String generateToken(Authentication authentication) {
    if (authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
      String email = oAuth2User.getAttribute("email");

      Optional<User> userOptional = userRepository.findByEmail(email);
      if (userOptional.isPresent()) {
        // Create UserDetails from the User entity
        assert email != null;
        UserDetails userDetails = org.springframework.security.core.userdetails.User
          .withUsername(email)
          .password(userOptional.get().getPassword() != null ? userOptional.get().getPassword() : "")
          .authorities("USER")
          .build();

        // Generate token using existing JwtUtils
        return jwtUtils.generateToken(userDetails);
      }
    }

    throw new RuntimeException("Unable to generate token for authentication: " + authentication);
  }
}
