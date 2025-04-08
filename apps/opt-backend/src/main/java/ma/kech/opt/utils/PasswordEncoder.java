package ma.kech.opt.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoder {
  public static void main(String[] args) {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    String rawPassword = "user";   // hada houwa l mdp li ghankhdmou bih mais khass n7touh f applicatio.properties m encodi b Bcrypt that's why we need to encode it
    String encodedPassword = encoder.encode(rawPassword);
    System.out.println(encodedPassword);
  }
}
