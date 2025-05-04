// UserDTO.java
package ma.kech.opt.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserDTO {
  private Long id;
  private String firstname;
  private String lastname;
  private String email;
  private String roles;
  private String provider;
  private String providerId;
}
