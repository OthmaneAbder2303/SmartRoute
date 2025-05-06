package ma.kech.opt.entity;

import jakarta.persistence.*;
import lombok.Data;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String firstname;

  @Column(nullable = false)
  private String lastname;
  @JsonIgnore
  private String password;

  @Column(nullable = false, unique = true)
  private String email;
  @JsonIgnore
  @Column(nullable = false)
  private String roles;
  @JsonIgnore
  @Column(nullable = false)
  private LocalDateTime createdAt;
  @JsonIgnore
  @Column(nullable = false)
  private LocalDateTime updatedAt;
  @JsonIgnore
  @Enumerated(EnumType.STRING)
  private AuthProvider provider = AuthProvider.LOCAL;
  @JsonIgnore
  private String providerId;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }

  // New helper method for OAuth2 user creation
  public static User createWithOAuth2(String email, String name, AuthProvider provider, String providerId) {
    User user = new User();
    // Split the name into firstname and lastname if available
    if (name != null && name.contains(" ")) {
      String[] nameParts = name.split(" ", 2);
      user.setFirstname(nameParts[0]);
      user.setLastname(nameParts[1]);
    } else {
      user.setFirstname(name);
      user.setLastname("");
    }
    user.setEmail(email);
    user.setProvider(provider);
    user.setProviderId(providerId);
    return user;
  }

}
