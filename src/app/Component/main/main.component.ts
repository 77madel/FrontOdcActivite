// import { Component, OnInit, ViewChild } from '@angular/core';
// import {
//   ApexAxisChartSeries,
//   ApexChart,
//   ChartComponent,
//   ApexDataLabels,
//   ApexPlotOptions,
//   ApexYAxis,
//   ApexLegend,
//   ApexStroke,
//   ApexXAxis,
//   ApexFill,
//   ApexTooltip
// } from "ng-apexcharts";
// import { GlobalCrudService } from '../../core';
// import { MatIcon } from "@angular/material/icon";
// import { options } from '@fullcalendar/core/preact.js';
//
// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   plotOptions: ApexPlotOptions;
//   yaxis: ApexYAxis;
//   xaxis: ApexXAxis;
//   fill: ApexFill;
//   tooltip: ApexTooltip;
//   stroke: ApexStroke;
//   legend?: ApexLegend; // facultatif si non utilisé
// };
//
// @Component({
//     selector: 'app-main',
//     imports: [
//         ChartComponent,
//     ],
//     templateUrl: './main.component.html',
//     styleUrls: ['./main.component.scss']
// })
// export class MainComponent implements OnInit {
//   @ViewChild("chart") chart: ChartComponent | undefined;
//   chartOptions: Partial<ChartOptions> = {};
//
//   nombreGenre: any[] = [];
//
//   constructor(private globalService: GlobalCrudService) {}
//
//   ngOnInit(): void {
//     this.getNombreUitlisateur();
//     this.getNombreActivite();
//     this.getNombreActiviteEncours();
//     this.getNombreActiviteEnAttente();
//     this.getNombreActiviteTerminer();
//     this.fetchGenreData();
//   }
//
//   nombreUtilisateurs: number | undefined;
//   nombreActivite: number = 0;
//   nombreActiviteEncours: number = 0;
//   nombreActiviteEnAttente: number = 0;
//   nombreActiviteTerminer: number = 0;
//
//   getNombreUitlisateur() {
//     this.globalService.get("utilisateur/nombre").subscribe({
//       next: (count) => this.nombreUtilisateurs = count,
//       error: err => console.log(err),
//     });
//   }
//
//   getNombreActivite() {
//     this.globalService.get("activite/nombre").subscribe({
//       next: (count) => this.nombreActivite = count,
//       error: err => console.log(err),
//     });
//   }
//
//   getNombreActiviteEncours() {
//     this.globalService.get("activite/nombreActivitesEncours").subscribe({
//       next: (count) => this.nombreActiviteEncours = count,
//       error: err => console.log(err),
//     });
//   }
//
//   getNombreActiviteEnAttente() {
//     this.globalService.get("activite/nombreActivitesEnAttente").subscribe({
//       next: (count) => this.nombreActiviteEnAttente = count,
//       error: err => console.log(err),
//     });
//   }
//
//   getNombreActiviteTerminer() {
//     this.globalService.get("activite/nombreActivitesTerminer").subscribe({
//       next: (count) => this.nombreActiviteTerminer = count,
//       error: err => console.log(err),
//     });
//   }
//
//   initializeChart() {
//     const hommeData = this.nombreGenre.find(g => g.genre === "Homme")?.count || 0;
//     const femmeData = this.nombreGenre.find(g => g.genre === "Femme")?.count || 0;
//
//     this.chartOptions = {
//       series: [
//         { name: "Homme", data: [hommeData] },
//         { name: "Femme", data: [femmeData] },
//       ],
//       chart: { type: "bar", height: 350 },
//       plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
//       dataLabels: { enabled: false },
//       stroke: { show: true, width: 2, colors: ["transparent"] },
//       xaxis: { categories: ["Genre"],  },
//       yaxis: { title: { text: "Count" } },
//       fill: { opacity: 1 },
//       tooltip: { y: { formatter: (val: number) => `${val} participants` } }
//     };
//   }
//
//   fetchGenreData() {
//     this.globalService.get("reporting/participants-par-genre").subscribe({
//       next: (data) => {
//         this.nombreGenre = data;
//         console.log("Reporting", this.nombreGenre);
//         this.initializeChart();
//       },
//       error: (err) => console.error("Erreur lors de la récupération des données de genre :", err),
//     });
//   }
//
//
// }

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { GlobalCrudService } from '../../core';
import {NgIf} from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend?: ApexLegend;
};

@Component({
  selector: 'app-main',
  imports: [
    ChartComponent,
    NgIf,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'bar', height: 350 },
    dataLabels: { enabled: false}, // Initialize dataLabels with a default object
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories: ["Genre"] },
    yaxis: { title: { text: "Count" } },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val: number) => `${val} participants` } }
  };

  nombreGenre: any[] = [];

  constructor(private globalService: GlobalCrudService) {}

    ngOnInit(): void {
    this.getNombreUitlisateur();
    this.getNombreActivite();
    this.getNombreActiviteEncours();
    this.getNombreActiviteEnAttente();
    this.getNombreActiviteTerminer();
    this.fetchGenreData();
  }

  nombreUtilisateurs: number | undefined;
  nombreActivite: number = 0;
  nombreActiviteEncours: number = 0;
  nombreActiviteEnAttente: number = 0;
  nombreActiviteTerminer: number = 0;

  getNombreUitlisateur() {
    this.globalService.get("utilisateur/nombre").subscribe({
      next: (count) => this.nombreUtilisateurs = count,
      error: err => console.log(err),
    });
  }

  getNombreActivite() {
    this.globalService.get("activite/nombre").subscribe({
      next: (count) => this.nombreActivite = count,
      error: err => console.log(err),
    });
  }

  getNombreActiviteEncours() {
    this.globalService.get("activite/nombreActivitesEncours").subscribe({
      next: (count) => this.nombreActiviteEncours = count,
      error: err => console.log(err),
    });
  }

  getNombreActiviteEnAttente() {
    this.globalService.get("activite/nombreActivitesEnAttente").subscribe({
      next: (count) => this.nombreActiviteEnAttente = count,
      error: err => console.log(err),
    });
  }

  getNombreActiviteTerminer() {
    this.globalService.get("activite/nombreActivitesTerminer").subscribe({
      next: (count) => this.nombreActiviteTerminer = count,
      error: err => console.log(err),
    });
  }

  initializeChart() {
    const hommeData = this.nombreGenre.find(g => g.genre === "Homme")?.count || 0;
    const femmeData = this.nombreGenre.find(g => g.genre === "Femme")?.count || 0;

    this.chartOptions.series = [ // Mettre à jour les séries
      { name: "Homme", data: [hommeData] },
      { name: "Femme", data: [femmeData] },
    ];

    // Pas besoin de réinitialiser le graphique, il suffit de mettre à jour les séries
    if (this.chart) {
      this.chart.updateSeries(this.chartOptions.series, true); // Utiliser updateSeries
    }
  }

  fetchGenreData() {
    this.globalService.get("reporting/participants-par-genre").subscribe({
      next: (data) => {
        this.nombreGenre = data;
        this.initializeChart(); // Appeler initializeChart ici
      },
      error: (err) => console.error("Erreur lors de la récupération des données de genre :", err),
    });
  }
}
