package ma.kech.opt.dto;

import lombok.Data;

@Data
public class UserDTO {
  private Long id;
  private String username;
  private String email;
  private String roles;
}
