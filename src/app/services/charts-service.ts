import { Injectable } from '@angular/core';
import ApexCharts from 'apexcharts';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  renderLineChart(container: HTMLElement, title: string, categories: string[], series: { name: string, data: number[] }[]): void {
    const options = {
      chart: {
        type: 'line',
        height: 400
      },
      title: {
        text: title,
        align: 'center'
      },
      xaxis: {
        categories: categories
      },
      series: series
    };

    const chart = new ApexCharts(container, options);
    chart.render();
  }
}
