// AuthController.java
package ma.kech.opt.controller;

import lombok.RequiredArgsConstructor;
import ma.kech.opt.dto.UserDTO;
import ma.kech.opt.entity.User;
import ma.kech.opt.repository.UserRepository;
import ma.kech.opt.service.UserService;
import ma.kech.opt.utils.JwtUtils;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final UserService userService;
  private final JwtUtils jwtUtils;
  private final UserRepository userRepository;

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody User user) {
    if (userService.findByEmail(user.getEmail()).isPresent()) {
      return ResponseEntity.badRequest().body("Email is already taken");
    }
    userService.registerUser(user);
    return ResponseEntity.ok("User registered successfully");
  }

  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@RequestBody User user) {
    try {
      Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
      UserDetails userDetails = (UserDetails) authentication.getPrincipal();
      String jwt = jwtUtils.generateToken(userDetails);
      return ResponseEntity.ok(jwt);
    } catch (AuthenticationException e) {
      return ResponseEntity.status(401).body("Invalid email or password");
    }
  }

  @GetMapping("/me")
  public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
    if (authentication == null) return ResponseEntity.status(401).build();

    Object principal = authentication.getPrincipal();
    UserDTO dto = new UserDTO();

    if (principal instanceof UserDetails userDetails) {
      User user = userRepository.findByEmail(userDetails.getUsername())
        .orElseThrow(() -> new RuntimeException("User not found"));
      dto = userService.mapToDTO(user);
      dto.setProvider("local");
    } else if (principal instanceof OAuth2User oauth2User) {
      Map<String, Object> attributes = oauth2User.getAttributes();
      String email = (String) attributes.get("email");

      User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("OAuth2 user not found in DB"));

      dto = userService.mapToDTO(user);
      dto.setProvider("oauth2");
      dto.setProviderId((String) attributes.get("sub")); // pour Google
    }

    return ResponseEntity.ok(dto);
  }
}
