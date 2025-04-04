package ma.kech.opt.service;

import ma.kech.opt.dto.UserDTO;
import ma.kech.opt.repository.UserRepository;
import ma.kech.opt.entity.User;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
    System.out.println("UserService created");
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public UserDTO registerUser(User user) {
    String encodedPassword = passwordEncoder.encode(user.getPassword());
    user.setPassword(encodedPassword);
    User savedUser = userRepository.save(user);
    return mapToDTO(savedUser);
  }

  public List<UserDTO> getAllUsers() {
    return userRepository.findAll().stream().map(this::mapToDTO).toList();
  }

  public Optional<UserDTO> findByUsername(String username) {
    return userRepository.findByUsername(username).map(this::mapToDTO);
  }

  public Optional<UserDTO> findByEmail(String email) {
    return userRepository.findByEmail(email).map(this::mapToDTO);
  }

  private UserDTO mapToDTO(User user) {
    UserDTO dto = new UserDTO();
    dto.setId(user.getId());
    dto.setUsername(user.getUsername());
    dto.setEmail(user.getEmail());
    dto.setRoles(user.getRoles());
    return dto;
  }
}

