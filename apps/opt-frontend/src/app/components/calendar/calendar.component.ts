import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { HttpClient } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule, DatePipe],
  templateUrl: './calendar.component.html',
  standalone: true,
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this),
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    locale: 'fr',
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
    },
    eventClassNames: 'bg-orange-500 text-white border-none rounded-md px-2 py-1 transition-all duration-300 hover:bg-orange-600 cursor-pointer',
    dayHeaderClassNames: 'text-gray-700 font-semibold py-2',
    dayCellClassNames: 'bg-white border border-gray-200 transition-all duration-300 hover:bg-gray-50',
  };

  loading = true;
  error: string | null = null;
  isVisible = false;
  currentView = 'dayGridMonth';
  selectedEvent: any = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('CalendarComponent initialisé');
      setTimeout(() => {
        this.isVisible = true;
      }, 100);
      this.loadEvents();
    }
  }

  loadEvents(): void {
    console.log('Chargement des événements...');
    this.loading = true;
    this.error = null;
    this.http.get<any[]>('http://localhost:8080/events').subscribe({
      next: (events) => {
        console.log('Événements chargés:', events);
        this.calendarOptions.events = events.map((event) => {
          const mappedEvent = {
            title: event.title,
            start: event.startDate,
            end: event.endDate,
            extendedProps: {
              description: event.description,
              location: event.location,
              type: event.type,
            },
          };
          console.log('Événement mappé:', mappedEvent);
          return mappedEvent;
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Échec du chargement des événements:', error);
        this.error = `Échec du chargement des événements : ${error.status} - ${error.statusText}`;
        this.loading = false;
      },
    });
  }

  changeView(view: string): void {
    console.log('Changement de vue vers:', view);
    this.currentView = view;
    const calendarApi = (this as any).calendar?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
    } else {
      console.error('API du calendrier non disponible');
      this.calendarOptions = { ...this.calendarOptions, initialView: view };
    }
  }

  handleEventClick(info: EventClickArg): void {
    console.log('Événement cliqué:', info.event);
    this.selectedEvent = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      extendedProps: info.event.extendedProps,
    };
  }

  closeModal(): void {
    console.log('Fermeture de la modale');
    this.selectedEvent = null;
  }
}
