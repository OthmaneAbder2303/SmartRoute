package ma.kech.opt.controller;

import ma.kech.opt.entity.Event;
import ma.kech.opt.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
