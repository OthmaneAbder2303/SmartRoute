package ma.kech.opt.controller;

import ma.kech.opt.controller.AuthController;
import ma.kech.opt.dto.UserDTO;
import ma.kech.opt.entity.User;
import ma.kech.opt.repository.UserRepository;
import ma.kech.opt.service.UserService;
import ma.kech.opt.utils.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class AuthControllerTest {

  @Mock private AuthenticationManager authenticationManager;
  @Mock private UserService userService;
  @Mock private JwtUtils jwtUtils;
  @Mock private UserRepository userRepository;
  private AuthController authController;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    authController = new AuthController(authenticationManager, userService, jwtUtils, userRepository);
  }

  @Test
  void registerUser_successful_registration_returnsOk() {
    User newUser = new User();
    newUser.setEmail("new@example.com");

    when(userService.findByEmail("new@example.com")).thenReturn(java.util.Optional.empty());

    ResponseEntity<?> response = authController.registerUser(newUser);

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(response.getBody().toString().contains("User registered successfully"));
  }

  @Test
  void getCurrentUser_authenticatedUser_returnsUserDTO() {
    // Mock de l'authentification
    UserDetails userDetails = mock(UserDetails.class);
    when(userDetails.getUsername()).thenReturn("test@example.com");

    Authentication authentication = mock(Authentication.class);
    when(authentication.getPrincipal()).thenReturn(userDetails);

    // Mock de l'utilisateur dans la base de données
    User user = new User();
    user.setEmail("test@example.com");
    user.setFirstname("John");
    user.setLastname("Doe");

    UserDTO userDTO = new UserDTO();
    userDTO.setFirstname("John");
    userDTO.setLastname("Doe");
    userDTO.setEmail("test@example.com");

    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
    when(userService.mapToDTO(user)).thenReturn(userDTO);

    // Test de la méthode
    ResponseEntity<UserDTO> response = authController.getCurrentUser(authentication);

    assertEquals(200, response.getStatusCodeValue());
    assertNotNull(response.getBody());
    assertEquals("John", response.getBody().getFirstname());
    assertEquals("Doe", response.getBody().getLastname());
  }

  @Test
  void getCurrentUser_noAuthentication_returnsUnauthorized() {
    Authentication authentication = null;

    ResponseEntity<UserDTO> response = authController.getCurrentUser(authentication);

    assertEquals(401, response.getStatusCodeValue());
  }

  @Test
  void getCsrfToken_returnsMessage() {
    ResponseEntity<Map<String, String>> response = authController.getCsrfToken(null);

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(response.getBody().get("message").contains("CSRF token generated"));
  }
}
