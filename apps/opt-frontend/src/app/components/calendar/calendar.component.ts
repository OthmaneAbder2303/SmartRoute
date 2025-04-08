import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CalendarOptions } from '@fullcalendar/core';
import { HttpClient } from '@angular/common/http';
// import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent{
  // calendarOptions: CalendarOptions = {
  //   initialView: 'dayGridMonth',
  //   events: [], // Les événements seront remplis dynamiquement ici
  //   eventClick: (info) => {
  //     alert('Event: ' + info.event.title);
  //   },
  // };
  //
  // constructor(private http: HttpClient) {}
  //
  // ngOnInit(): void {
  //   this.http
  //     .get<any[]>('http://localhost:8080/api/events')
  //     .subscribe((events) => {
  //       this.calendarOptions.events = events.map((event) => ({
  //         title: event.title,
  //         start: event.startDate,
  //         end: event.endDate,
  //         description: event.description,
  //         location: event.location,
  //         extendedProps: {
  //           type: event.type,
  //         },
  //       }));
  //     });
  // }
}
