package ma.kech.opt.config;

import ma.kech.opt.filter.CsrfTokenFilter;
import ma.kech.opt.filter.JwtAuthenticationFilter;
import ma.kech.opt.oauth2.CustomOAuth2UserService;
import ma.kech.opt.oauth2.OAuth2AuthenticationSuccessHandler;
import ma.kech.opt.service.UserService;
import ma.kech.opt.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final UserService userService;
  private final JwtUtils jwtUtils;
  private final CustomOAuth2UserService customOAuth2UserService;
  private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

  @Autowired
  public SecurityConfig(UserService userService, JwtUtils jwtUtils,
                        CustomOAuth2UserService customOAuth2UserService,
                        OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler) {
    this.userService = userService;
    this.jwtUtils = jwtUtils;
    this.customOAuth2UserService = customOAuth2UserService;
    this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
    System.out.println("SecurityConfig loaded");
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
    requestHandler.setCsrfRequestAttributeName("_csrf");//not needed unless u want to change the token tag
    http
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .csrf(csrfConfig->csrfConfig.csrfTokenRequestHandler(requestHandler)

        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .ignoringRequestMatchers("/specific/endpoint", "/**")//here are the routes we won't need csrf for
  )

      .addFilterAfter(new CsrfTokenFilter(), BasicAuthenticationFilter.class)
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/auth/**", "/oauth2/**").permitAll() // Public access for auth and OAuth2
        .requestMatchers(HttpMethod.POST,"/**").permitAll()
        .requestMatchers(HttpMethod.GET,"/events").permitAll()
        //.requestMatchers("/admin/**").hasRole("ADMIN") // accessible uniquement aux admins
        //.requestMatchers("/user/**").hasAnyRole("USER", "ADMIN") // accessible aux users ET
        .anyRequest().permitAll()
      )
      .sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
        .maximumSessions(1)//per user
        .maxSessionsPreventsLogin(false)//if a user tried to login without logout it lets him in with deleting it's old session
      )
      .logout(logout -> logout
        .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler())
      )
      // OAuth2 configuration
      .oauth2Login(oauth2 -> oauth2
        .authorizationEndpoint(endpoint -> endpoint
          .baseUri("/oauth2/authorize"))
        .redirectionEndpoint(endpoint -> endpoint
          .baseUri("/oauth2/callback/*"))
        .userInfoEndpoint(userInfo -> userInfo
          .userService(customOAuth2UserService))
        .successHandler(oAuth2AuthenticationSuccessHandler))
      // JWT filter
      .addFilterBefore(new JwtAuthenticationFilter(userService, jwtUtils), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:4200"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    //configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setAllowedHeaders(List.of("Content-Type", "X-XSRF-TOKEN", "Authorization"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
