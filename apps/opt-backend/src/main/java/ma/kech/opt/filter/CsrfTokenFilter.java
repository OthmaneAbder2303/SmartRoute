package ma.kech.opt.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class CsrfTokenFilter extends OncePerRequestFilter {
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    CsrfToken csrfToken=(CsrfToken)request.getAttribute(CsrfToken.class.getName());

    if(csrfToken==null || csrfToken.getToken().isEmpty()){
      System.out.println("CSRF token is missing or invalid!");
      response.sendError(HttpServletResponse.SC_BAD_REQUEST,"CSRF token is missing or invalid");
      return;
    }
    csrfToken.getToken();
    System.out.println("CSRF Token: "+csrfToken.getToken());
    response.setHeader("X-CSRF-TOKEN",csrfToken.getToken());
    filterChain.doFilter(request,response);
  }
}
