import { Injectable } from '@angular/core';
import ApexCharts from 'apexcharts';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  renderDonutChart(container: HTMLElement, title: string, labels: string[], series: number[]): void {
    const options = {
      chart: {
        type: 'donut',
        height: 400,
        defaultLocale: "en"
      },
      title: {
        text: title,
        align: 'center'
      },
      theme: {
        mode: 'light'
      },
      labels: labels,
      series: series,
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        formatter: (val: number, opts: any) => {
          const count = opts.w.globals.series[opts.seriesIndex]; // valor absoluto
          return `${count} (${val.toFixed(1)}%)`; // ex: "5 (25%)"
        }
      }
    };

    const chart = new ApexCharts(container, options);
    chart.render();
  }
}
