package ma.kech.opt.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Data
@Entity
@Table(name = "events")
public class Event {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(name = "start_date", nullable = false)
  private LocalDateTime startDate;

  @Column(name = "end_date")
  private LocalDateTime endDate;
  private String description;
  private String location;
  private String type;

  public Event() {}

  public Event(String title, LocalDateTime startDate, LocalDateTime endDate, String description, String location, String type) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.location = location;
    this.type = type;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setStartDate(LocalDateTime startDate) {
    this.startDate = startDate;
  }

  public void setEndDate(LocalDateTime endDate) {
    this.endDate = endDate;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public void setType(String type) {
    this.type = type;
  }

}
