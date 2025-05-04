package ma.kech.opt.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import ma.kech.opt.entity.Event;
import ma.kech.opt.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {

  private final EventService eventService;

  public EventController(EventService eventService) {
    this.eventService = eventService;
  }

  @GetMapping
  public ResponseEntity<List<Event>> getAllEvents() {
    try {
      List<Event> events = eventService.getAllEvents();
      return ResponseEntity.ok(events);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
    @PostMapping
    public String  getAllEvents(HttpServletRequest r) {
      Cookie[] cookies = r.getCookies();
      if (cookies != null) {
        for (Cookie cookie : cookies) {
          System.out.println("Cookie name: " + cookie.getName() + ", value: " + cookie.getValue());
        }
      }
      return "Cookies logged in console";
      }

}
