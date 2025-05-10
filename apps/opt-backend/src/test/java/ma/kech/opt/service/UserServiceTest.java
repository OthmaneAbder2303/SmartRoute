package ma.kech.opt.service;

import ma.kech.opt.dto.UserDTO;
import ma.kech.opt.entity.User;
import ma.kech.opt.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  @Captor
  ArgumentCaptor<User> userCaptor;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testRegisterUser_encodesPassword_andSavesUser() {
    User user = new User();
    user.setPassword("hahaha");
    user.setEmail("siiir@gmail.com");

    when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
      User u = invocation.getArgument(0);
      u.setId(1L);
      return u;
    });

    userService.registerUser(user);

    verify(userRepository).save(userCaptor.capture());
    User savedUser = userCaptor.getValue();
    assertNotEquals("hahaha", savedUser.getPassword());
    assertTrue(savedUser.getPassword().startsWith("$2a$")); // BCrypt hash starts like this
  }

  @Test
  void testGetAllUsers_returnsMappedDTOs() {
    User user = new User();
    user.setId(1L);
    user.setFirstname("Othmane");
    user.setLastname("Abderrazik");
    user.setEmail("othmane@gmail.com");
    user.setRoles(String.valueOf(List.of("USER")));

    when(userRepository.findAll()).thenReturn(List.of(user));

    List<UserDTO> users = userService.getAllUsers();

    assertEquals(1, users.size());
    assertEquals("Othmane", users.get(0).getFirstname());
  }

  @Test
  void testFindByEmail_returnsMappedDTO() {
    User user = new User();
    user.setId(1L);
    user.setEmail("othmane@gmail.com");

    when(userRepository.findByEmail("othmane@gmail.com")).thenReturn(Optional.of(user));

    Optional<UserDTO> result = userService.findByEmail("othmane@gmail.com");

    assertTrue(result.isPresent());
    assertEquals("othmane@gmail.com", result.get().getEmail());
  }

  @Test
  void testLoadUserByUsername_returnsUserDetails() {
    User user = new User();
    user.setEmail("othmane@gmail.com");
    user.setPassword("hashedPassword");

    when(userRepository.findByEmail("othmane@gmail.com")).thenReturn(Optional.of(user));

    UserDetails userDetails = userService.loadUserByUsername("othmane@gmail.com");

    assertEquals("othmane@gmail.com", userDetails.getUsername());
    assertEquals("hashedPassword", userDetails.getPassword());
  }

  @Test
  void testLoadUserByUsername_userNotFound_throwsException() {
    when(userRepository.findByEmail("oupss@gmail.com")).thenReturn(Optional.empty());

    assertThrows(UsernameNotFoundException.class, () ->
      userService.loadUserByUsername("oupss@gmail.com"));
  }
}
