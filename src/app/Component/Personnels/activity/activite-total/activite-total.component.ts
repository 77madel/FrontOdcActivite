import { Component, AfterViewInit } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import {Activity, GlobalCrudService} from '../../../../core';

@Component({
  selector: 'app-activite-total',
  templateUrl: './activite-total.component.html',
  styleUrls: ['./activite-total.component.css'],
  standalone: true
})
export class ActiviteTotalComponent implements AfterViewInit {
  calendar!: Calendar;
  activiteList: Activity[] = [];
  events: any[] = []; // Pour stocker les événements transformés

  constructor(private globalService: GlobalCrudService) {}

  ngAfterViewInit() {
    this.getAllActivite(); // Appel de la méthode pour récupérer les activités

    const calendarOptions: CalendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay',
      },
      initialView: 'dayGridMonth',
      locales: [frLocale],
      locale: 'fr',
      events: this.events, // Utilisation des événements transformés
      dateClick: this.onDateClick.bind(this),
    };

    this.calendar = new Calendar(document.getElementById('calendar')!, calendarOptions);
    this.calendar.render();
  }

  getAllActivite() {
    this.globalService.get("activite").subscribe({
      next: (value: Activity[]) => {
        this.activiteList = value;
        console.log('Response Activite', this.activiteList);
        this.transformActivitiesToEvents(); // Transformation après réception
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  transformActivitiesToEvents() {
    this.events = this.activiteList.map(activity => {
      let color: string;

      // Définir la couleur selon le statut
      switch (activity.statut) {
        case 'En_Cours':
          color = 'green'; // Vert
          break;
        case 'En_Attente':
          color = 'blue'; // Bleu
          break;
        case 'Termine':
          color = 'red'; // Rouge
          break;
        default:
          color = 'gray'; // Couleur par défaut
      }

      return {
        title: activity.nom, // Nom de l'activité
        start: activity.dateDebut, // Date de début
        end: activity.dateFin, // Date de fin
        color: color, // Couleur définie selon le statut
      };
    });

    // Mettre à jour le calendrier avec les événements transformés
    this.calendar.addEventSource(this.events); // Ajouter les événements au calendrier
  }

  onDateClick(info: any) {
    alert('Date sélectionnée : ' + info.dateStr);
  }
}
