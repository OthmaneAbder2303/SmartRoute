package ma.kech.opt.service;

import ma.kech.opt.entity.Event;
import ma.kech.opt.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

  private final EventRepository eventRepository;

  EventService(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  public List<Event> getAllEvents() {
    return eventRepository.findAll();
  }

  public Event createEvent(Event event) {
    return eventRepository.save(event);
  }
}
