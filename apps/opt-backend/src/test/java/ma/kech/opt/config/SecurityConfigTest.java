package ma.kech.opt.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityConfigTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void testPublicEndpoint_authShouldBeAccessible() throws Exception {
    mockMvc.perform(get("/users"))
      .andExpect(status().isOk()); // ou autre selon ce que renvoie ce endpoint
  }

  @Test
  void testEventsEndpoint_shouldBeAccessible() throws Exception {
    mockMvc.perform(get("/events"))
      .andExpect(status().isOk());
  }

//  @Test
//  void testProtectedEndpoint_withoutAuth_shouldBeForbidden() throws Exception {
//    mockMvc.perform(get("/auth/csrf"))
//      .andExpect(status().isForbidden()); // si `.anyRequest().authenticated()` au lieu de `.permitAll()`
//  }
//
//  @Test
//  @WithMockUser(username = "user@example.com", roles = {"USER"})
//  void testProtectedEndpoint_withAuth_shouldBeOk() throws Exception {
//    mockMvc.perform(get("/auth/login"))
//      .andExpect(status().isOk());
//  }
}

