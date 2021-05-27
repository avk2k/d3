import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { color, xml } from 'd3';
import { Observable } from 'rxjs';

declare module 'd3' {
  export function pointer(event, target): [number, number];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './../assets/shema.css']
})
export class AppComponent implements OnInit {
  title = 'd3';
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

  ngOnInit(): void {
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
    const limits = [{
      name: "Херово",
      value: 200,
      color: "#f09797"
    },
    {
      name: "Очень херово",
      value: 300,
      color: "#e83838"
    }
      ,
    {
      name: "Писец",
      value: 400,
      color: "#fc0000"
    }
    ];
    //d3.select('html').insert('p', 'svg').text('werwerwe');
    d3.csv('./assets/sensor.csv', (row, index, columns) => {
      return {
        date: d3.timeParse('%d-%m-%Y %H:%M')(row.date),
        value: Number.parseFloat(row.value)
      };
    })
      .then(data => {
        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 100, left: 30 },
          width = 600 - margin.left - margin.right,
          height =
            600 -
            margin.top -
            margin.bottom;

        // Добавляем основной объект SVG
        const svg = d3
          .select('#sensorGraph')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // Определяем параметры обрезки данных при отрисовке
        // Иначе график уходит за прелы области данных
        svg
          .append('defs')
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('width', width)
          .attr('height', height)
          .attr('x', 0)
          .attr('y', 0);

        const locale = d3.timeFormatLocale({
          dateTime: '%A, %e %B %Y г. %X',
          date: '%d.%m.%Y',
          time: '%H:%M:%S',
          periods: ['AM', 'PM'],
          days: [
            'воскресенье',
            'понедельник',
            'вторник',
            'среда',
            'четверг',
            'пятница',
            'суббота'
          ],
          shortDays: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
          months: [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
          ],
          shortMonths: [
            'янв',
            'фев',
            'мар',
            'апр',
            'май',
            'июн',
            'июл',
            'авг',
            'сен',
            'окт',
            'ноя',
            'дек'
          ]
        });

        let xScale = d3
          .scaleTime()
          .domain(d3.extent(data, d => d.date))
          .range([0, width]);
        const origXScale = xScale.copy();

        /** Формирование оси X
         * @param scale Функция скалировния dhtvtyb
         */
        const xAxis = (scale: d3.ScaleTime<number, number>) =>
          d3
            .axisBottom(scale)
            .tickPadding(0)
            .tickFormat((d: Date, i) => {
              if (d.getHours() === 0) {
                return locale.format('%d %B %Y')(d);
              } else {
                return locale.format('%H:%M')(d);
              }
            });

        /**
         * Формирование меток на оси X
         * @param axis ось X
         */
        const xLabels = (
          axis: d3.Selection<SVGElement, unknown, HTMLElement, unknown>
        ) => {
          axis
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');
        };

        const svgXAxis = svg
          .append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis(xScale))
          .call(xLabels);

        // Max value observed:
        const max = d3.max(data, (d) => d.value);

        // Рисуем ось Y
        const y = d3
          .scaleLinear()
          .domain([0, max])
          .range([height, 0]);
        const yAxis = d3.axisLeft(y).ticks(5);
        svg.append('g').call(yAxis);

        //#region Рисуем линии лимитов
        const group = svg
          .selectAll("#limits")
          .data(limits)
          .join('g');

        group
          .append('line')
          .attr('transform', (d) => 'translate(0,' + y(d.value) + ')')
          .style('stroke', (d) => d.color)
          .style('stroke-width', 2)
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', width)
          .attr('y2', 0);
        group
          .append('text')
          .attr('transform', (d) => 'translate(0,' + y(d.value) + ')')
          .attr('y', -4)
          .attr('x', 10)
          .attr('text-anchor', 'bottom')
          .text((d) => d.name);
        //#endregion

        // Рисум график
        const points = svg
          .append('path')
          .datum(data)
          .attr('clip-path', 'url(#clip)')
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr(
            'd',
            d3
              .line<{ date: Date; value: number }>()
              .x(d => xScale(d.date))
              .y(d => y(d.value))
          );

        const callout = (g, value) => {
          if (!value) return g.style("display", "none");

          g
            .style("display", null)
            .style("pointer-events", "none")
            .style("font", "10px sans-serif");

          const path = g.selectAll("path")
            .data([null])
            .join("path")
            .attr("fill", "white")
            .attr("stroke", "black");

          const text = g.selectAll("text")
            .data([null])
            .join("text")
            .call(text => text
              .selectAll("tspan")
              .data((value + "").split(/\n/))
              .join("tspan")
              .attr("x", 0)
              .attr("y", (d, i) => `${i * 1.1}em`)
              .style("font-weight", (_, i) => i ? null : "bold")
              .text(d => d));

          const { x, y, width: w, height: h } = text.node().getBBox();

          text.attr("transform", `translate(${-w / 2},${15 - y})`);
          path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
        }

        const bisect = (mx: number) => {
          const bis = d3.bisector(d => (d as any).date).left;
          const date = xScale.invert(mx);
          const index = bis(data, date, 1);
          const a = data[index - 1];
          const b = data[index];
          return b && (date.valueOf() - a.date.valueOf() > b.date.valueOf() - date.valueOf()) ? b : a;
        }

        /** Рисование перекрестия
         * @param g Группа, в которую будут добавляться элементы графики
         * @param data Данные в выбранной точке (где будет перекрестие)
         */
        const hover = (g: d3.Selection<SVGElement, unknown, HTMLElement, any>, data: { date: Date, value: number }) => {
          // Если нет данных, то скрываем группу
          if (!data) return g.style("display", "none");

          const baloonMargin = 5;

          // Показываем группу
          g
            .style("display", null)

          const color = (d) => {
            if (!d) {
              return 'black';
            }
            let limit = limits.sort((a, b) => a.value > b.value ? -1 : 1).find(v => d.value > v.value);
            if (!limit) {
              return 'green';
            }
            return limit.color;
          }

          // Горизонтальная линия
          const hoverVLine = g
            .selectAll("#vLine")
            .data([null])
            .join("line")
            .attr("id", "vLine")
            .attr("y2", height)
            .attr("stroke-width", "0.2")
            .attr("stroke", "black");
          // Вертикальная линия
          const hoverHLine = g
            .selectAll("#hLine")
            .data([data])
            .join("line")
            .attr("id", "hLine")
            .attr("x2", width)
            .attr("stroke-width", "0.2")
            .attr("stroke", 'black');
          // Кружок в точке пересечения
          const hoverCircle = g
            .selectAll("#circle")
            .data([data])
            .join("circle")
            .attr("id", "circle")
            .attr("r", 3)
            .attr("stroke-width", 2)
            .attr("stroke", 'black');

          const baloon = g.selectAll("rect")
            .data([data])
            .join("rect")
            .attr("fill", "white")
            .attr("stroke-width", 1)
            .attr("stroke", color);

          const value = g
            .selectAll("#value")
            .data([null])
            .join("text")
            .attr("id", "value")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "hanging")
            .call(text => text
              .selectAll("tspan")
              .data((data.value + "").split(/\n/))
              .join("tspan")
              .attr("x", 0)
              .attr("y", margin.top)
              .style("font-weight", (_, i) => i ? null : "bold")
              .text(d => d));


          // Трансформируем все объекты в нужное место
          hoverVLine.attr('transform', 'translate(' + xScale(data.date) + ',0)');
          hoverHLine.attr('transform', 'translate(0,' + y(data.value) + ')');
          hoverCircle.attr("transform", `translate(${xScale(data.date)},${y(data.value)})`)
          value.attr("transform", `translate(${xScale(data.date)},${baloonMargin})`)

          const rect = (value.node() as SVGGraphicsElement).getBBox({ stroke: false });



          //baloon.attr("d", `M${-rect.width / 2 - baloonMargin},-${baloonMargin}h${rect.width + baloonMargin*2}v${rect.height + baloonMargin*2}h-${rect.width + baloonMargin*2}z`);
          baloon
            .attr("x", -rect.width / 2 - baloonMargin)
            .attr("y", rect.y - baloonMargin)
            .attr("width", rect.width + baloonMargin * 2)
            .attr("height", rect.height + baloonMargin * 2);
          baloon.attr("transform", `translate(${xScale(data.date)},${baloonMargin})`)
        }
        const tooltip = svg.append("g");

        const hoverGroup = svg.append("g");

        // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
        const zoom = d3
          .zoom()
          .scaleExtent([1, 100])
          .extent([[0, 0], [width, height]])
          .on('zoom', (event: any) => {
            tooltip.call(callout, null)
            hoverGroup.call(hover, null)
            // Получаем новый масштаб по оси X
            xScale = event.transform.rescaleX(origXScale);
            // Обновляем ось X
            svgXAxis.call(xAxis(xScale)).call(xLabels);
            // Обновляем данные в соответсвии с новым масштабом по оси X
            points.attr(
              'd',
              d3
                .line<{ date: Date; value: number }>()
                .x(d => xScale(d.date))
                .y(d => y(d.value))
            );
          });

        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        const graphArea = svg
          .append('rect')
          .attr('width', width)
          .attr('height', height)
          .style('fill', 'none')
          .style('pointer-events', 'all')
          //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
          .call(zoom);

        graphArea.on("touchmove mousemove", function (event) {
          const coords = d3.pointer(event, this);
          const v = bisect(coords[0]);
          hoverGroup.call(hover, v);
          /*tooltip
            .attr("transform", `translate(${xScale(v.date)},${y(v.value)})`)
            .call(callout, `${v.value}\n${locale.format('%H:%M, %d %B %Y')(v.date)}`);*/
        });

        graphArea.on("touchend mouseleave", () => {
          tooltip.call(callout, null);
          hoverGroup.call(hover, null);
        });

      })
      .catch(e => {
        console.error(e);
      });


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
