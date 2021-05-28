import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { style } from 'd3';
import { ppid } from 'process';

/** Описание линии, которая будет отображаться на графике, 
 * как некий порог значений, чтобы визуально понимать переход границы */
export interface GraphLimit {
  /** Название порога */
  name: string,
  /** Хначение порога */
  value: number,
  /** Цвет, которым будет отображаться линия и график */
  color: string
}

/** Данные для рисования */
export interface GraphData {
  /** Время значения */
  date: Date,
  /** Значение */
  value: number
}

@Component({
  selector: 'app-monitoring-graph',
  templateUrl: './monitoring-graph.component.html',
  styleUrls: ['./monitoring-graph.component.css']
})
export class MonitoringGraphComponent implements OnInit, OnChanges {
  /** Пороги значений для отображения на графике */
  @Input()
  public set limits(limits: GraphLimit[]) {
    if (!limits) return;
    // Сортируем лимиты, для удобного дальнейшего использования
    this._limits = limits.sort((a, b) => a.value > b.value ? -1 : 1);
  }
  private _limits: GraphLimit[];

  /** Цвет графика при однотонном рисовании (по умолчанию 'steelblue') */
  @Input()
  public graphColor: string | number = 'steelblue';

  /** Значения для рисования графика (внутреннее поле) */
  private _graphData: GraphData[];
  /** Значения для рисования графика */
  @Input()
  public set graphData(data: GraphData[]) {
    if (!data) return;
    this._graphData = data;
    this.updateGraph();
  }

  /** Единицы измерения по оси Y */
  @Input()
  public yUnits: string;

  /** Показывать или нет пороги значений на графике. По умолчанию true */
  @Input()
  public showLimits: boolean = true;

  /** Расцвечивать график по цветам лимитов. По умолчанию true */
  @Input()
  public colorizeByLimits: boolean = true;

  /** Ширина графика (без отступов) */
  private graphWidth: number;
  /** Высота графика (без отступов) */
  private graphHeight: number;


  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.colorizeByLimits) {
      this.setGraphColor();
    }
    if (changes.showLimits) {
      d3.select("#limits").transition().style("opacity", changes.showLimits.currentValue ? 1 : 0);
    }

  }

  private setGraphColor() {
    d3.select("#graphLine")
    .attr('stroke', (d) => this.colorizeByLimits && this._limits?.length > 0 ? 'url(#limitsGradient)' : this.graphColor)
  }

  /** Обновление графика */
  private updateGraph() {
    // Если нет данных, то выходим
    if (!this._graphData) return;
    // Определяем размеры графика
    const margin = { top: 10, right: 30, bottom: 100, left: 30 };
    this.graphWidth = 600 - margin.left - margin.right;
    this.graphHeight =
      600 -
      margin.top -
      margin.bottom;

    // Удаляем старый график
    d3
      .selectAll('#monitoringGraph>*')
      .remove();

    // Добавляем основной объект SVG
    const svg = d3
      .select('#monitoringGraph')
      .append('svg')
      .attr('width', this.graphWidth + margin.left + margin.right)
      .attr('height', this.graphHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Определяем параметры обрезки данных при отрисовке
    // Иначе график уходит за прелы области данных
    svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.graphWidth)
      .attr('height', this.graphHeight)
      .attr('x', 0)
      .attr('y', 0);

    /** Формат времени для России. Нужен для преобразования временных значений */
    const timeFormat_Russian = d3.timeFormatLocale({
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

    /** Функция определения цвета по данным на основе лимитов */
    const color = (d: GraphData) => {
      if (!d || !this._limits) {
        return 'black';
      }
      let limit = this._limits.find(v => d.value > v.value);
      if (!limit) {
        return this._limits?.length > 0 ? 'green' : this.graphColor;
      }
      return limit.color;
    }

    let xScale = d3
      .scaleTime()
      .domain(d3.extent(this._graphData, d => d.date))
      .range([0, this.graphWidth]);
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
            return timeFormat_Russian.format('%d %B %Y')(d);
          } else {
            return timeFormat_Russian.format('%H:%M')(d);
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
      .attr('transform', 'translate(0,' + this.graphHeight + ')')
      .call(xAxis(xScale))
      .call(xLabels);

    /** Максимальное значение по значениям */
    const max = d3.max(this._graphData, (d) => d.value);

    // Рисуем ось Y
    const y = d3
      .scaleLinear()
      .domain([0, max])
      .range([this.graphHeight, 0]);
    const yAxis = d3
      .axisLeft(y)
      .ticks(5);
    svg.append('g').call(yAxis)
      .append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text(this.yUnits);

    //#region Рисуем линии лимитов
    this.drawLimits(svg, y);
    //#endregion

    if (this._limits) {
      svg.append("linearGradient")
        .attr("id", "limitsGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", this.graphHeight)
        .selectAll("stop")
        .data(() => {
          let res = [];
          const sorted = [...this._limits];
          sorted.push({ value: 0, color: 'green', name: '' });
          for (var i = 0; i < sorted.length - 1; i++) {
            res.push({ offset: y(sorted[i].value) / this.graphHeight, color: sorted[i].color })
            res.push({ offset: y(sorted[i].value) / this.graphHeight, color: sorted[i + 1].color })
          }
          return res;
        })
        .join("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
    }


    const points = svg
      .append('path')
      .datum(this._graphData)
      .attr("id", "graphLine")
      .attr('clip-path', 'url(#clip)')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line<{ date: Date; value: number }>()
          .x(d => xScale(d.date))
          .y(d => y(d.value))
      );
    this.setGraphColor();
      

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

    /** Находим ближайшую точку графика к вертикальной линии
     * @param mx координата X
     * @returns Ближайший элемент данных
     */
    const bisect = (mx: number) => {
      const bis = d3.bisector(d => (d as any).date).left;
      const date = xScale.invert(mx);
      const index = bis(this._graphData, date, 1);
      const a = this._graphData[index - 1];
      const b = this._graphData[index];
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

      // Горизонтальная линия
      const hoverVLine = g
        .selectAll("#vLine")
        .data([null])
        .join("line")
        .attr("id", "vLine")
        .attr("y2", this.graphHeight)
        .attr("stroke-width", "0.2")
        .attr("stroke", "black");
      // Вертикальная линия
      const hoverHLine = g
        .selectAll("#hLine")
        .data([data])
        .join("line")
        .attr("id", "hLine")
        .attr("x2", this.graphWidth)
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
          .text(d => `${d} ${this.yUnits}`.trimEnd()));


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
      .extent([[0, 0], [this.graphWidth, this.graphHeight]])
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
      .attr('width', this.graphWidth)
      .attr('height', this.graphHeight)
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

  }



  /** Рисование лимитов на графике
   * @param svg Главный элемент
   */
  private drawLimits(
    svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    yScale: d3.ScaleLinear<number, number, never>) {
    if (!this.showLimits || (!this._limits || this._limits.length === 0)) return;
    /** Группа с горизонтальными линиями на основе лимитов */

    const lineGroups = svg
      .selectAll('#limits') // выбираем объекты с идентификатором limits
      .data([null]) // Это нужно чтобы создать элемент, если его нет
      .join('g') // создаем элемент
      .attr('id', 'limits')
      .selectAll()
      .data(this._limits)
      .enter()
      .append('g')
      .attr("name", (d) => d.name);;


    lineGroups
      .append('line')
      .attr('transform', (d) => 'translate(0,' + yScale(d.value) + ')')
      .style('stroke', (d) => d.color)
      .style('stroke-width', 2)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', this.graphWidth)
      .attr('y2', 0);
    lineGroups
      .append('text')
      .attr('transform', (d) => 'translate(0,' + yScale(d.value) + ')')
      .attr('y', -4)
      .attr('x', 10)
      .attr('text-anchor', 'bottom')
      .text((d) => d.name);
  }
}
