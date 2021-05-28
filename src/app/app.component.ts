import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { color, xml } from 'd3';
import { Observable } from 'rxjs';
import { GraphData, GraphLimit } from './monitoring-graph/monitoring-graph.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './../assets/shema.css']
})
export class AppComponent implements OnInit {
  public limits = [{
    name: "Херово",
    value: 200,
    color: "#ffdd00"
  },
  {
    name: "Очень херово",
    value: 300,
    color: "#ff7b00"
  }
    ,
  {
    name: "Писец",
    value: 400,
    color: "red"
  }
  ];

  public graphData: GraphData[];

  data = [
    {
      id: 'shkaf_line',
      state: 'yellow'
    },
    {
      id: 'АСО-1-3-В_x0028_USB_x0029_',
      state: 'blue'
    }
  ];

  constructor(private el: ElementRef<HTMLElement>) { }

  public colorizeGraph: boolean = true;
  public colorizeGraphChange(event){
    this.colorizeGraph = event.target.checked;
  }

  public showLimits: boolean = true;
  public showLimitsChange(event){
    this.showLimits = event.target.checked;
  }


  ngOnInit(): void {
    // Загружаем данные
    d3.csv('./assets/sensor.csv', (row, index, columns) => {
      return {
        date: d3.timeParse('%d-%m-%Y %H:%M')(row.date),
        value: Number.parseFloat(row.value)
      } as GraphData;
    })
      .then(data => {
        this.graphData = data;
      });
    const _this = this;
    /*d3.xml('./assets/shema.svg')
    .then((t) => {
      document.body.appendChild(t.documentElement);
      const svg = d3.select('svg');
      let elements = svg.selectAll('*')
        .data(_this.data, function(d: any) {
           return (d && d.id) || (this as any).id;
        });

        elements.style('stroke', (d) => {
          return d.state;
        });
      
      setTimeout(() => {
        _this.data[0].state = 'green';
        _this.data[1].state = 'red';
        elements
          .style('stroke', (d) => {
            return d.state;
          });

          this.blink(elements);

      }, 5000);

    });*/

  }

  blink(selection: d3.Selection<d3.BaseType, any, d3.BaseType, any>): void {
    selection
      .transition()
      .duration(100)
      .style('stroke', 'red')
      .style('stroke-width', '100')
      .delay(900)
      .transition()
      .duration(100)
      .style('stroke', 'black')
      .style('stroke-width', '10')
      .delay(900)
      .on('end', () => {
        this.blink(selection);
      });
    //    ^------^---- calling blink again when the transition ends
  }

}
