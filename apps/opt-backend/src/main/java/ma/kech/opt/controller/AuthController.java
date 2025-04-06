package ma.kech.opt.controller;

import ma.kech.opt.entity.User;
import ma.kech.opt.service.UserService;
import ma.kech.opt.utils.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final UserService userService;
  private final JwtUtils jwtUtils;

  public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtils jwtUtils) {
    this.authenticationManager = authenticationManager;
    this.userService = userService;
    this.jwtUtils = jwtUtils;
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody User user) {
    if (userService.findByUsername(user.getUsername()).isPresent()) {
      return ResponseEntity.badRequest().body("Username is already taken");
    }
    userService.registerUser(user);
    return ResponseEntity.ok("User registered successfully");
  }

  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@RequestBody User user) {
    try {
      Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
      UserDetails userDetails = (UserDetails) authentication.getPrincipal();
      String jwt = jwtUtils.generateToken(userDetails);
      return ResponseEntity.ok(jwt);
    } catch (AuthenticationException e) {
      return ResponseEntity.status(401).body("Invalid username or password");
    }
  }

}
