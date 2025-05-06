package ma.kech.opt.service;

import ma.kech.opt.dto.UserDTO;
import ma.kech.opt.repository.UserRepository;
import ma.kech.opt.entity.User;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = new BCryptPasswordEncoder();
  }

  public void registerUser(User user) {
    String encodedPassword = passwordEncoder.encode(user.getPassword());
    user.setPassword(encodedPassword);
    User savedUser = userRepository.save(user);
    mapToDTO(savedUser);
  }

  public List<UserDTO> getAllUsers() {
    return userRepository.findAll().stream().map(this::mapToDTO).toList();
  }

//  public Optional<UserDTO> findByUsername(String username) {
//    return userRepository.findByUsername(username).map(this::mapToDTO);
//  }

  public Optional<UserDTO> findByEmail(String email) {
    return userRepository.findByEmail(email).map(this::mapToDTO);
  }

  public UserDTO mapToDTO(User user) {
    UserDTO dto = new UserDTO();
    dto.setId(user.getId());
    dto.setFirstname(user.getFirstname());
    dto.setLastname(user.getLastname());
    dto.setEmail(user.getEmail());
    dto.setRoles(user.getRoles());
    dto.setProvider(String.valueOf(user.getProvider()));
    dto.setProviderId(user.getProviderId());
    return dto;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    return org.springframework.security.core.userdetails.User
      .withUsername(user.getEmail())
      .password(user.getPassword())
      .authorities("USER")
      .build();
  }
}

