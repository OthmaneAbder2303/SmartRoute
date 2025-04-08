package ma.kech.opt.dto;

import lombok.Data;

@Data
public class UserDTO {
  private Long id;
  private String firstname;
  private String lastname;
  private String email;
  private String roles;
}
