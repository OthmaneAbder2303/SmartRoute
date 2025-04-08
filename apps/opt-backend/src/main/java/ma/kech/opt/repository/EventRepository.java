package ma.kech.opt.repository;

import ma.kech.opt.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
  public Event findByTitle(String title);
}
