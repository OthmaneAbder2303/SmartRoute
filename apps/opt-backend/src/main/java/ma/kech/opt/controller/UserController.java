package ma.kech.opt.controller;

import lombok.RequiredArgsConstructor;
import ma.kech.opt.dto.UserDTO;
import ma.kech.opt.entity.User;
import ma.kech.opt.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @GetMapping
  public List<UserDTO> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/email/{email}")
  public UserDTO getUserByEmail(@PathVariable String email) {
    return userService.findByEmail(email).orElse(null);
  }
}
