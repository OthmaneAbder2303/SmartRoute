package ma.kech.opt.oauth2;

import ma.kech.opt.entity.AuthProvider;
import ma.kech.opt.entity.User;
import ma.kech.opt.repository.UserRepository;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final UserRepository userRepository;

  public CustomOAuth2UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

    try {
      return processOAuth2User(oAuth2UserRequest, oAuth2User);
    } catch (Exception ex) {
      throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
    }
  }

  private OAuth2User processOAuth2User(OAuth2UserRequest request, OAuth2User oAuth2User) {
    String provider = request.getClientRegistration().getRegistrationId();

    OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(provider, oAuth2User.getAttributes());

    if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
      throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
    }

    Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
    User user;

    if (userOptional.isPresent()) {
      user = userOptional.get();
      if (!user.getProvider().equals(AuthProvider.valueOf(provider.toUpperCase()))) {
        throw new OAuth2AuthenticationException("You are signed up with " +
          user.getProvider() + ". Please use your " + user.getProvider() + " account to login.");
      }
      user = updateExistingUser(user, oAuth2UserInfo);
    } else {
      user = registerNewUser(request, oAuth2UserInfo);
    }

    Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
    attributes.put("id", user.getId());

    return new DefaultOAuth2User(
      Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
      attributes,
      "email"
    );
  }

  private User registerNewUser(OAuth2UserRequest request, OAuth2UserInfo oAuth2UserInfo) {
    User user = User.createWithOAuth2(
      oAuth2UserInfo.getEmail(),
      oAuth2UserInfo.getName(),
      AuthProvider.valueOf(request.getClientRegistration().getRegistrationId().toUpperCase()),
      oAuth2UserInfo.getId()
    );
    user.setRoles("ROLE_USER"); // Bien formatté pour Spring Security

    return userRepository.save(user);
  }

  private User updateExistingUser(User user, OAuth2UserInfo oAuth2UserInfo) {
    if (StringUtils.hasText(oAuth2UserInfo.getName()) &&
      (user.getFirstname() == null || user.getLastname() == null)) {

      if (oAuth2UserInfo.getName().contains(" ")) {
        String[] parts = oAuth2UserInfo.getName().split(" ", 2);
        user.setFirstname(parts[0]);
        user.setLastname(parts[1]);
      } else {
        user.setFirstname(oAuth2UserInfo.getName());
      }
    }

    return userRepository.save(user);
  }


  public static class OAuth2UserInfoFactory {
    public static OAuth2UserInfo getOAuth2UserInfo(String provider, Map<String, Object> attributes) {
      return switch (provider.toLowerCase()) {
        case "google" -> new GoogleOAuth2UserInfo(attributes);
        case "github" -> new GithubOAuth2UserInfo(attributes);
        default -> throw new OAuth2AuthenticationException("Login with " + provider + " is not supported yet.");
      };
    }
  }

}
