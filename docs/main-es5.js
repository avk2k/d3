(function () {
  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
    /***/
    "/evS":
    /*!****************************************************************!*\
      !*** ./src/app/monitoring-graph/monitoring-graph.component.ts ***!
      \****************************************************************/

    /*! exports provided: MonitoringGraphComponent */

    /***/
    function evS(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "MonitoringGraphComponent", function () {
        return MonitoringGraphComponent;
      });
      /* harmony import */


      var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! tslib */
      "mrSG");
      /* harmony import */


      var _raw_loader_monitoring_graph_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! raw-loader!./monitoring-graph.component.html */
      "/fv4");
      /* harmony import */


      var _monitoring_graph_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./monitoring-graph.component.css */
      "srvU");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var d3__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! d3 */
      "VphZ");

      var MonitoringGraphComponent = /*#__PURE__*/function () {
        function MonitoringGraphComponent() {
          _classCallCheck(this, MonitoringGraphComponent);

          /** Цвет графика при однотонном рисовании (по умолчанию 'steelblue') */
          this.graphColor = 'steelblue';
          /** Показывать или нет пороги значений на графике. По умолчанию true */

          this.showLimits = true;
          /** Расцвечивать график по цветам лимитов. По умолчанию true */

          this.colorizeByLimits = true;
        }
        /** Пороги значений для отображения на графике */


        _createClass(MonitoringGraphComponent, [{
          key: "limits",
          set: function set(limits) {
            if (!limits) return; // Сортируем лимиты, для удобного дальнейшего использования

            this._limits = limits.sort(function (a, b) {
              return a.value > b.value ? -1 : 1;
            });
          }
          /** Значения для рисования графика */

        }, {
          key: "graphData",
          set: function set(data) {
            if (!data) return;
            this._graphData = data;
            this.updateGraph();
          }
        }, {
          key: "ngOnInit",
          value: function ngOnInit() {}
        }, {
          key: "ngOnChanges",
          value: function ngOnChanges(changes) {
            if (changes.colorizeByLimits) {
              this.setGraphColor();
            }

            if (changes.showLimits) {
              d3__WEBPACK_IMPORTED_MODULE_4__["select"]("#limits").transition().style("opacity", changes.showLimits.currentValue ? 1 : 0);
            }
          }
        }, {
          key: "setGraphColor",
          value: function setGraphColor() {
            var _this2 = this;

            d3__WEBPACK_IMPORTED_MODULE_4__["select"]("#graphLine").attr('stroke', function (d) {
              var _a;

              return _this2.colorizeByLimits && ((_a = _this2._limits) === null || _a === void 0 ? void 0 : _a.length) > 0 ? 'url(#limitsGradient)' : _this2.graphColor;
            });
          }
          /** Обновление графика */

        }, {
          key: "updateGraph",
          value: function updateGraph() {
            var _this3 = this;

            // Если нет данных, то выходим
            if (!this._graphData) return; // Определяем размеры графика

            var margin = {
              top: 10,
              right: 30,
              bottom: 100,
              left: 30
            };
            this.graphWidth = 600 - margin.left - margin.right;
            this.graphHeight = 600 - margin.top - margin.bottom; // Удаляем старый график

            d3__WEBPACK_IMPORTED_MODULE_4__["selectAll"]('#monitoringGraph>*').remove(); // Добавляем основной объект SVG

            var svg = d3__WEBPACK_IMPORTED_MODULE_4__["select"]('#monitoringGraph').append('svg').attr('width', this.graphWidth + margin.left + margin.right).attr('height', this.graphHeight + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); // Определяем параметры обрезки данных при отрисовке
            // Иначе график уходит за прелы области данных

            svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', this.graphWidth).attr('height', this.graphHeight).attr('x', 0).attr('y', 0);
            /** Формат времени для России. Нужен для преобразования временных значений */

            var timeFormat_Russian = d3__WEBPACK_IMPORTED_MODULE_4__["timeFormatLocale"]({
              dateTime: '%A, %e %B %Y г. %X',
              date: '%d.%m.%Y',
              time: '%H:%M:%S',
              periods: ['AM', 'PM'],
              days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
              shortDays: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
              months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
              shortMonths: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
            });
            /** Функция определения цвета по данным на основе лимитов */

            var color = function color(d) {
              var _a;

              if (!d || !_this3._limits) {
                return 'black';
              }

              var limit = _this3._limits.find(function (v) {
                return d.value > v.value;
              });

              if (!limit) {
                return ((_a = _this3._limits) === null || _a === void 0 ? void 0 : _a.length) > 0 ? 'green' : _this3.graphColor;
              }

              return limit.color;
            };

            var xScale = d3__WEBPACK_IMPORTED_MODULE_4__["scaleTime"]().domain(d3__WEBPACK_IMPORTED_MODULE_4__["extent"](this._graphData, function (d) {
              return d.date;
            })).range([0, this.graphWidth]);
            var origXScale = xScale.copy();
            /** Формирование оси X
             * @param scale Функция скалировния dhtvtyb
             */

            var xAxis = function xAxis(scale) {
              return d3__WEBPACK_IMPORTED_MODULE_4__["axisBottom"](scale).tickPadding(0).tickFormat(function (d, i) {
                if (d.getHours() === 0) {
                  return timeFormat_Russian.format('%d %B %Y')(d);
                } else {
                  return timeFormat_Russian.format('%H:%M')(d);
                }
              });
            };
            /**
             * Формирование меток на оси X
             * @param axis ось X
             */


            var xLabels = function xLabels(axis) {
              axis.selectAll('text').style('text-anchor', 'end').attr('dx', '-.8em').attr('dy', '.15em').attr('transform', 'rotate(-45)');
            };

            var svgXAxis = svg.append('g').attr('transform', 'translate(0,' + this.graphHeight + ')').call(xAxis(xScale)).call(xLabels);
            /** Максимальное значение по значениям */

            var max = d3__WEBPACK_IMPORTED_MODULE_4__["max"](this._graphData, function (d) {
              return d.value;
            }); // Рисуем ось Y

            var y = d3__WEBPACK_IMPORTED_MODULE_4__["scaleLinear"]().domain([0, max]).range([this.graphHeight, 0]);
            var yAxis = d3__WEBPACK_IMPORTED_MODULE_4__["axisLeft"](y).ticks(5);
            svg.append('g').call(yAxis).append("text").attr("x", 10).attr("y", 10).attr("fill", "currentColor").attr("text-anchor", "start").text(this.yUnits); //#region Рисуем линии лимитов

            this.drawLimits(svg, y); //#endregion

            if (this._limits) {
              svg.append("linearGradient").attr("id", "limitsGradient").attr("gradientUnits", "userSpaceOnUse").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", this.graphHeight).selectAll("stop").data(function () {
                var res = [];

                var sorted = _toConsumableArray(_this3._limits);

                sorted.push({
                  value: 0,
                  color: 'green',
                  name: ''
                });

                for (var i = 0; i < sorted.length - 1; i++) {
                  res.push({
                    offset: y(sorted[i].value) / _this3.graphHeight,
                    color: sorted[i].color
                  });
                  res.push({
                    offset: y(sorted[i].value) / _this3.graphHeight,
                    color: sorted[i + 1].color
                  });
                }

                return res;
              }).join("stop").attr("offset", function (d) {
                return d.offset;
              }).attr("stop-color", function (d) {
                return d.color;
              });
            }

            var points = svg.append('path').datum(this._graphData).attr("id", "graphLine").attr('clip-path', 'url(#clip)').attr('fill', 'none').attr('stroke-width', 1.5).attr('d', d3__WEBPACK_IMPORTED_MODULE_4__["line"]().x(function (d) {
              return xScale(d.date);
            }).y(function (d) {
              return y(d.value);
            }));
            this.setGraphColor();

            var callout = function callout(g, value) {
              if (!value) return g.style("display", "none");
              g.style("display", null).style("pointer-events", "none").style("font", "10px sans-serif");
              var path = g.selectAll("path").data([null]).join("path").attr("fill", "white").attr("stroke", "black");
              var text = g.selectAll("text").data([null]).join("text").call(function (text) {
                return text.selectAll("tspan").data((value + "").split(/\n/)).join("tspan").attr("x", 0).attr("y", function (d, i) {
                  return "".concat(i * 1.1, "em");
                }).style("font-weight", function (_, i) {
                  return i ? null : "bold";
                }).text(function (d) {
                  return d;
                });
              });

              var _text$node$getBBox = text.node().getBBox(),
                  x = _text$node$getBBox.x,
                  y = _text$node$getBBox.y,
                  w = _text$node$getBBox.width,
                  h = _text$node$getBBox.height;

              text.attr("transform", "translate(".concat(-w / 2, ",").concat(15 - y, ")"));
              path.attr("d", "M".concat(-w / 2 - 10, ",5H-5l5,-5l5,5H").concat(w / 2 + 10, "v").concat(h + 20, "h-").concat(w + 20, "z"));
            };
            /** Находим ближайшую точку графика к вертикальной линии
             * @param mx координата X
             * @returns Ближайший элемент данных
             */


            var bisect = function bisect(mx) {
              var bis = d3__WEBPACK_IMPORTED_MODULE_4__["bisector"](function (d) {
                return d.date;
              }).left;
              var date = xScale.invert(mx);
              var index = bis(_this3._graphData, date, 1);
              var a = _this3._graphData[index - 1];
              var b = _this3._graphData[index];
              return b && date.valueOf() - a.date.valueOf() > b.date.valueOf() - date.valueOf() ? b : a;
            };
            /** Рисование перекрестия
             * @param g Группа, в которую будут добавляться элементы графики
             * @param data Данные в выбранной точке (где будет перекрестие)
             */


            var hover = function hover(g, data) {
              // Если нет данных, то скрываем группу
              if (!data) return g.style("display", "none");
              var baloonMargin = 5; // Показываем группу

              g.style("display", null); // Горизонтальная линия

              var hoverVLine = g.selectAll("#vLine").data([null]).join("line").attr("id", "vLine").attr("y2", _this3.graphHeight).attr("stroke-width", "0.2").attr("stroke", "black"); // Вертикальная линия

              var hoverHLine = g.selectAll("#hLine").data([data]).join("line").attr("id", "hLine").attr("x2", _this3.graphWidth).attr("stroke-width", "0.2").attr("stroke", 'black'); // Кружок в точке пересечения

              var hoverCircle = g.selectAll("#circle").data([data]).join("circle").attr("id", "circle").attr("r", 3).attr("stroke-width", 2).attr("stroke", 'black');
              var baloon = g.selectAll("rect").data([data]).join("rect").attr("fill", "white").attr("stroke-width", 1).attr("stroke", color);
              var value = g.selectAll("#value").data([null]).join("text").attr("id", "value").attr("text-anchor", "middle").attr("alignment-baseline", "hanging").call(function (text) {
                return text.selectAll("tspan").data((data.value + "").split(/\n/)).join("tspan").attr("x", 0).attr("y", margin.top).style("font-weight", function (_, i) {
                  return i ? null : "bold";
                }).text(function (d) {
                  return "".concat(d, " ").concat(_this3.yUnits).trimEnd();
                });
              }); // Трансформируем все объекты в нужное место

              hoverVLine.attr('transform', 'translate(' + xScale(data.date) + ',0)');
              hoverHLine.attr('transform', 'translate(0,' + y(data.value) + ')');
              hoverCircle.attr("transform", "translate(".concat(xScale(data.date), ",").concat(y(data.value), ")"));
              value.attr("transform", "translate(".concat(xScale(data.date), ",").concat(baloonMargin, ")"));
              var rect = value.node().getBBox({
                stroke: false
              }); //baloon.attr("d", `M${-rect.width / 2 - baloonMargin},-${baloonMargin}h${rect.width + baloonMargin*2}v${rect.height + baloonMargin*2}h-${rect.width + baloonMargin*2}z`);

              baloon.attr("x", -rect.width / 2 - baloonMargin).attr("y", rect.y - baloonMargin).attr("width", rect.width + baloonMargin * 2).attr("height", rect.height + baloonMargin * 2);
              baloon.attr("transform", "translate(".concat(xScale(data.date), ",").concat(baloonMargin, ")"));
            };

            var tooltip = svg.append("g");
            var hoverGroup = svg.append("g"); // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom

            var zoom = d3__WEBPACK_IMPORTED_MODULE_4__["zoom"]().scaleExtent([1, 100]).extent([[0, 0], [this.graphWidth, this.graphHeight]]).on('zoom', function (event) {
              tooltip.call(callout, null);
              hoverGroup.call(hover, null); // Получаем новый масштаб по оси X

              xScale = event.transform.rescaleX(origXScale); // Обновляем ось X

              svgXAxis.call(xAxis(xScale)).call(xLabels); // Обновляем данные в соответсвии с новым масштабом по оси X

              points.attr('d', d3__WEBPACK_IMPORTED_MODULE_4__["line"]().x(function (d) {
                return xScale(d.date);
              }).y(function (d) {
                return y(d.value);
              }));
            }); // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom

            var graphArea = svg.append('rect').attr('width', this.graphWidth).attr('height', this.graphHeight).style('fill', 'none').style('pointer-events', 'all') //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);
            graphArea.on("touchmove mousemove", function (event) {
              var coords = d3__WEBPACK_IMPORTED_MODULE_4__["pointer"](event, this);
              var v = bisect(coords[0]);
              hoverGroup.call(hover, v);
              /*tooltip
                .attr("transform", `translate(${xScale(v.date)},${y(v.value)})`)
                .call(callout, `${v.value}\n${locale.format('%H:%M, %d %B %Y')(v.date)}`);*/
            });
            graphArea.on("touchend mouseleave", function () {
              tooltip.call(callout, null);
              hoverGroup.call(hover, null);
            });
          }
          /** Рисование лимитов на графике
           * @param svg Главный элемент
           */

        }, {
          key: "drawLimits",
          value: function drawLimits(svg, yScale) {
            if (!this.showLimits || !this._limits || this._limits.length === 0) return;
            /** Группа с горизонтальными линиями на основе лимитов */

            var lineGroups = svg.selectAll('#limits') // выбираем объекты с идентификатором limits
            .data([null]) // Это нужно чтобы создать элемент, если его нет
            .join('g') // создаем элемент
            .attr('id', 'limits').selectAll().data(this._limits).enter().append('g').attr("name", function (d) {
              return d.name;
            });
            ;
            lineGroups.append('line').attr('transform', function (d) {
              return 'translate(0,' + yScale(d.value) + ')';
            }).style('stroke', function (d) {
              return d.color;
            }).style('stroke-width', 2).attr('x1', 0).attr('y1', 0).attr('x2', this.graphWidth).attr('y2', 0);
            lineGroups.append('text').attr('transform', function (d) {
              return 'translate(0,' + yScale(d.value) + ')';
            }).attr('y', -4).attr('x', 10).attr('text-anchor', 'bottom').text(function (d) {
              return d.name;
            });
          }
        }]);

        return MonitoringGraphComponent;
      }();

      MonitoringGraphComponent.ctorParameters = function () {
        return [];
      };

      MonitoringGraphComponent.propDecorators = {
        limits: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"]
        }],
        graphColor: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"]
        }],
        graphData: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"]
        }],
        yUnits: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"]
        }],
        showLimits: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"]
        }],
        colorizeByLimits: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"]
        }]
      };
      MonitoringGraphComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-monitoring-graph',
        template: _raw_loader_monitoring_graph_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_monitoring_graph_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
      }), Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [])], MonitoringGraphComponent);
      /***/
    },

    /***/
    "/fv4":
    /*!********************************************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/monitoring-graph/monitoring-graph.component.html ***!
      \********************************************************************************************************/

    /*! exports provided: default */

    /***/
    function fv4(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<div id=\"monitoringGraph\"></div>\n";
      /***/
    },

    /***/
    0:
    /*!***************************!*\
      !*** multi ./src/main.ts ***!
      \***************************/

    /*! no static exports found */

    /***/
    function _(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(
      /*! F:\Work\Test\d3\d3\src\main.ts */
      "zUnb");
      /***/
    },

    /***/
    "3Ys4":
    /*!******************************!*\
      !*** ./src/assets/shema.css ***!
      \******************************/

    /*! exports provided: default */

    /***/
    function Ys4(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "@charset \"UTF-8\";\r\n.str15 {stroke:red;stroke-width:26.21;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str16 {stroke:#2B2A29;stroke-width:19.81;stroke-miterlimit:22.9256;stroke-dasharray:99.044807 99.044807}\r\n.str2 {stroke:black;stroke-width:25.61;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str10 {stroke:black;stroke-width:0.61;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str11 {stroke:black;stroke-width:5.7;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str5 {stroke:black;stroke-width:8.54;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str4 {stroke:black;stroke-width:34.15;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str0 {stroke:black;stroke-width:14.23;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str1 {stroke:black;stroke-width:39.85;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str13 {stroke:blue;stroke-width:17.08;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str7 {stroke:#00B800;stroke-width:17.08;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str9 {stroke:aqua;stroke-width:17.08;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str12 {stroke:#A953A0;stroke-width:17.08;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str8 {stroke:red;stroke-width:17.08;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str6 {stroke:fuchsia;stroke-width:17.08;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str14 {stroke:yellow;stroke-width:17.08;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.str3 {stroke:black;stroke-width:17.08;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}\r\n.fil8 {fill:none}\r\n.fil0 {fill:none;fill-rule:nonzero}\r\n.fil2 {fill:black;fill-rule:nonzero}\r\n.fil6 {fill:blue;fill-rule:nonzero}\r\n.fil4 {fill:#00B800;fill-rule:nonzero}\r\n.fil5 {fill:#A953A0;fill-rule:nonzero}\r\n.fil7 {fill:red;fill-rule:nonzero}\r\n.fil3 {fill:fuchsia;fill-rule:nonzero}\r\n.fil1 {fill:black;fill-rule:nonzero}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNoZW1hLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQkFBZ0I7QUFDaEIsUUFBUSxVQUFVLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsb0JBQW9CO0FBQ3JHLFFBQVEsY0FBYyxDQUFDLGtCQUFrQixDQUFDLHlCQUF5QixDQUFDLG9DQUFvQztBQUN4RyxPQUFPLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0I7QUFDdEcsUUFBUSxZQUFZLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsb0JBQW9CO0FBQ3RHLFFBQVEsWUFBWSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixDQUFDLG9CQUFvQjtBQUNyRyxPQUFPLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0I7QUFDckcsT0FBTyxZQUFZLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsb0JBQW9CO0FBQ3RHLE9BQU8sWUFBWSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixDQUFDLG9CQUFvQjtBQUN0RyxPQUFPLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0I7QUFDdEcsUUFBUSxXQUFXLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsb0JBQW9CO0FBQ3RHLE9BQU8sY0FBYyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixDQUFDLG9CQUFvQjtBQUN4RyxPQUFPLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0I7QUFDckcsUUFBUSxjQUFjLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsb0JBQW9CO0FBQ3pHLE9BQU8sVUFBVSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixDQUFDLG9CQUFvQjtBQUNwRyxPQUFPLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0I7QUFDeEcsUUFBUSxhQUFhLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsb0JBQW9CO0FBQ3hHLE9BQU8sWUFBWSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixDQUFDLG9CQUFvQjtBQUN0RyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTLENBQUMsaUJBQWlCO0FBQ2xDLE9BQU8sVUFBVSxDQUFDLGlCQUFpQjtBQUNuQyxPQUFPLFNBQVMsQ0FBQyxpQkFBaUI7QUFDbEMsT0FBTyxZQUFZLENBQUMsaUJBQWlCO0FBQ3JDLE9BQU8sWUFBWSxDQUFDLGlCQUFpQjtBQUNyQyxPQUFPLFFBQVEsQ0FBQyxpQkFBaUI7QUFDakMsT0FBTyxZQUFZLENBQUMsaUJBQWlCO0FBQ3JDLE9BQU8sVUFBVSxDQUFDLGlCQUFpQiIsImZpbGUiOiJzaGVtYS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAY2hhcnNldCBcIlVURi04XCI7XHJcbi5zdHIxNSB7c3Ryb2tlOnJlZDtzdHJva2Utd2lkdGg6MjYuMjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwfVxyXG4uc3RyMTYge3N0cm9rZTojMkIyQTI5O3N0cm9rZS13aWR0aDoxOS44MTtzdHJva2UtbWl0ZXJsaW1pdDoyMi45MjU2O3N0cm9rZS1kYXNoYXJyYXk6OTkuMDQ0ODA3IDk5LjA0NDgwN31cclxuLnN0cjIge3N0cm9rZTpibGFjaztzdHJva2Utd2lkdGg6MjUuNjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwfVxyXG4uc3RyMTAge3N0cm9rZTpibGFjaztzdHJva2Utd2lkdGg6MC42MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTB9XHJcbi5zdHIxMSB7c3Ryb2tlOmJsYWNrO3N0cm9rZS13aWR0aDo1Ljc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwfVxyXG4uc3RyNSB7c3Ryb2tlOmJsYWNrO3N0cm9rZS13aWR0aDo4LjU0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMH1cclxuLnN0cjQge3N0cm9rZTpibGFjaztzdHJva2Utd2lkdGg6MzQuMTU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwfVxyXG4uc3RyMCB7c3Ryb2tlOmJsYWNrO3N0cm9rZS13aWR0aDoxNC4yMztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTB9XHJcbi5zdHIxIHtzdHJva2U6YmxhY2s7c3Ryb2tlLXdpZHRoOjM5Ljg1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMH1cclxuLnN0cjEzIHtzdHJva2U6Ymx1ZTtzdHJva2Utd2lkdGg6MTcuMDg7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwfVxyXG4uc3RyNyB7c3Ryb2tlOiMwMEI4MDA7c3Ryb2tlLXdpZHRoOjE3LjA4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMH1cclxuLnN0cjkge3N0cm9rZTphcXVhO3N0cm9rZS13aWR0aDoxNy4wODtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTB9XHJcbi5zdHIxMiB7c3Ryb2tlOiNBOTUzQTA7c3Ryb2tlLXdpZHRoOjE3LjA4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMH1cclxuLnN0cjgge3N0cm9rZTpyZWQ7c3Ryb2tlLXdpZHRoOjE3LjA4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMH1cclxuLnN0cjYge3N0cm9rZTpmdWNoc2lhO3N0cm9rZS13aWR0aDoxNy4wODtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTB9XHJcbi5zdHIxNCB7c3Ryb2tlOnllbGxvdztzdHJva2Utd2lkdGg6MTcuMDg7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwfVxyXG4uc3RyMyB7c3Ryb2tlOmJsYWNrO3N0cm9rZS13aWR0aDoxNy4wODtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTB9XHJcbi5maWw4IHtmaWxsOm5vbmV9XHJcbi5maWwwIHtmaWxsOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm99XHJcbi5maWwyIHtmaWxsOmJsYWNrO2ZpbGwtcnVsZTpub256ZXJvfVxyXG4uZmlsNiB7ZmlsbDpibHVlO2ZpbGwtcnVsZTpub256ZXJvfVxyXG4uZmlsNCB7ZmlsbDojMDBCODAwO2ZpbGwtcnVsZTpub256ZXJvfVxyXG4uZmlsNSB7ZmlsbDojQTk1M0EwO2ZpbGwtcnVsZTpub256ZXJvfVxyXG4uZmlsNyB7ZmlsbDpyZWQ7ZmlsbC1ydWxlOm5vbnplcm99XHJcbi5maWwzIHtmaWxsOmZ1Y2hzaWE7ZmlsbC1ydWxlOm5vbnplcm99XHJcbi5maWwxIHtmaWxsOmJsYWNrO2ZpbGwtcnVsZTpub256ZXJvfVxyXG4iXX0= */";
      /***/
    },

    /***/
    "A3xY":
    /*!***********************************!*\
      !*** ./src/app/app.component.css ***!
      \***********************************/

    /*! exports provided: default */

    /***/
    function A3xY(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */";
      /***/
    },

    /***/
    "AytR":
    /*!*****************************************!*\
      !*** ./src/environments/environment.ts ***!
      \*****************************************/

    /*! exports provided: environment */

    /***/
    function AytR(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "environment", function () {
        return environment;
      }); // This file can be replaced during build by using the `fileReplacements` array.
      // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
      // The list of file replacements can be found in `angular.json`.


      var environment = {
        production: false
      };
      /*
       * For easier debugging in development mode, you can import the following file
       * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
       *
       * This import should be commented out in production mode because it will have a negative impact
       * on performance if an error is thrown.
       */
      // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

      /***/
    },

    /***/
    "Sy1n":
    /*!**********************************!*\
      !*** ./src/app/app.component.ts ***!
      \**********************************/

    /*! exports provided: AppComponent */

    /***/
    function Sy1n(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
        return AppComponent;
      });
      /* harmony import */


      var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! tslib */
      "mrSG");
      /* harmony import */


      var _raw_loader_app_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! raw-loader!./app.component.html */
      "VzVu");
      /* harmony import */


      var _app_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./app.component.css */
      "A3xY");
      /* harmony import */


      var _assets_shema_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./../assets/shema.css */
      "3Ys4");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var d3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! d3 */
      "VphZ");

      var AppComponent = /*#__PURE__*/function () {
        function AppComponent(el) {
          _classCallCheck(this, AppComponent);

          this.el = el;
          this.limits = [{
            name: "Херово",
            value: 200,
            color: "#ffdd00"
          }, {
            name: "Очень херово",
            value: 300,
            color: "#ff7b00"
          }, {
            name: "Писец",
            value: 400,
            color: "red"
          }];
          this.data = [{
            id: 'shkaf_line',
            state: 'yellow'
          }, {
            id: 'АСО-1-3-В_x0028_USB_x0029_',
            state: 'blue'
          }];
          this.colorizeGraph = true;
          this.showLimits = true;
        }

        _createClass(AppComponent, [{
          key: "colorizeGraphChange",
          value: function colorizeGraphChange(event) {
            this.colorizeGraph = event.target.checked;
          }
        }, {
          key: "showLimitsChange",
          value: function showLimitsChange(event) {
            this.showLimits = event.target.checked;
          }
        }, {
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this4 = this;

            // Загружаем данные
            d3__WEBPACK_IMPORTED_MODULE_5__["csv"]('./assets/sensor.csv', function (row, index, columns) {
              return {
                date: d3__WEBPACK_IMPORTED_MODULE_5__["timeParse"]('%d-%m-%Y %H:%M')(row.date),
                value: Number.parseFloat(row.value)
              };
            }).then(function (data) {
              _this4.graphData = data;
            });

            var _this = this;
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
        }, {
          key: "blink",
          value: function blink(selection) {
            var _this5 = this;

            selection.transition().duration(100).style('stroke', 'red').style('stroke-width', '100').delay(900).transition().duration(100).style('stroke', 'black').style('stroke-width', '10').delay(900).on('end', function () {
              _this5.blink(selection);
            }); //    ^------^---- calling blink again when the transition ends
          }
        }]);

        return AppComponent;
      }();

      AppComponent.ctorParameters = function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_4__["ElementRef"]
        }];
      };

      AppComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
        selector: 'app-root',
        template: _raw_loader_app_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_app_component_css__WEBPACK_IMPORTED_MODULE_2__["default"], _assets_shema_css__WEBPACK_IMPORTED_MODULE_3__["default"]]
      }), Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ElementRef"]])], AppComponent);
      /***/
    },

    /***/
    "VzVu":
    /*!**************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
      \**************************************************************************/

    /*! exports provided: default */

    /***/
    function VzVu(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<input if=\"cbColor\" type=\"checkbox\" [checked]=\"this.colorizeGraph\" (change)=\"this.colorizeGraphChange($event)\">\n<label for=\"cbColor\">Раскрасить график</label>\n<input if=\"cbLimits\" type=\"checkbox\" [checked]=\"this.showLimits\" (change)=\"this.showLimitsChange($event)\">\n<label for=\"cbLimits\">Линии лимитов</label>\n<app-monitoring-graph \n    [showLimits]=\"this.showLimits\"\n    [limits]=\"this.limits\"\n    [colorizeByLimits]=\"this.colorizeGraph\"\n    [graphData]=\"this.graphData\"\n    yUnits=\"мг/м3\"\n></app-monitoring-graph>\n<router-outlet></router-outlet>\n";
      /***/
    },

    /***/
    "ZAI4":
    /*!*******************************!*\
      !*** ./src/app/app.module.ts ***!
      \*******************************/

    /*! exports provided: AppModule */

    /***/
    function ZAI4(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppModule", function () {
        return AppModule;
      });
      /* harmony import */


      var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! tslib */
      "mrSG");
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./app-routing.module */
      "vY5A");
      /* harmony import */


      var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ./app.component */
      "Sy1n");
      /* harmony import */


      var _monitoring_graph_monitoring_graph_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! ./monitoring-graph/monitoring-graph.component */
      "/evS");

      var AppModule = function AppModule() {
        _classCallCheck(this, AppModule);
      };

      AppModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"], _monitoring_graph_monitoring_graph_component__WEBPACK_IMPORTED_MODULE_5__["MonitoringGraphComponent"]],
        imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"]],
        providers: [],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
      })], AppModule);
      /***/
    },

    /***/
    "srvU":
    /*!*****************************************************************!*\
      !*** ./src/app/monitoring-graph/monitoring-graph.component.css ***!
      \*****************************************************************/

    /*! exports provided: default */

    /***/
    function srvU(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJtb25pdG9yaW5nLWdyYXBoLmNvbXBvbmVudC5jc3MifQ== */";
      /***/
    },

    /***/
    "vY5A":
    /*!***************************************!*\
      !*** ./src/app/app-routing.module.ts ***!
      \***************************************/

    /*! exports provided: AppRoutingModule */

    /***/
    function vY5A(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function () {
        return AppRoutingModule;
      });
      /* harmony import */


      var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! tslib */
      "mrSG");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");

      var routes = [];

      var AppRoutingModule = function AppRoutingModule() {
        _classCallCheck(this, AppRoutingModule);
      };

      AppRoutingModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
      })], AppRoutingModule);
      /***/
    },

    /***/
    "zUnb":
    /*!*********************!*\
      !*** ./src/main.ts ***!
      \*********************/

    /*! no exports provided */

    /***/
    function zUnb(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/platform-browser-dynamic */
      "a3Wg");
      /* harmony import */


      var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./app/app.module */
      "ZAI4");
      /* harmony import */


      var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./environments/environment */
      "AytR");

      if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
      }

      Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])["catch"](function (err) {
        return console.error(err);
      });
      /***/
    },

    /***/
    "zn8P":
    /*!******************************************************!*\
      !*** ./$$_lazy_route_resource lazy namespace object ***!
      \******************************************************/

    /*! no static exports found */

    /***/
    function zn8P(module, exports) {
      function webpackEmptyAsyncContext(req) {
        // Here Promise.resolve().then() is used instead of new Promise() to prevent
        // uncaught exception popping up in devtools
        return Promise.resolve().then(function () {
          var e = new Error("Cannot find module '" + req + "'");
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        });
      }

      webpackEmptyAsyncContext.keys = function () {
        return [];
      };

      webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
      module.exports = webpackEmptyAsyncContext;
      webpackEmptyAsyncContext.id = "zn8P";
      /***/
    }
  }, [[0, "runtime", "vendor"]]]);
})();
//# sourceMappingURL=main-es5.js.map