'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// helping functions
function TimeFormatter(stringTime) {
  var newTime = stringTime.split(':');
  var hour = newTime[0];
  var minute = newTime[1];
  return [hour, minute];
}
function xAxis() {
  var x = [];
  for (var index = 0; index < 24; index++) {
    x = x.concat(index);
  }
  return x;
}
function dataFormatter(height, width, trainTimes) {
  var y = new Array(24).fill(0);
  var x = xAxis(),
      Width = parseInt(width),
      Height = parseInt(height);
  for (var i = 1; i < 24; i++) {
    for (var index in trainTimes) {
      if (TimeFormatter(trainTimes[index])[0] == i) {
        y[i] = y[i] + 1;
      }
    }
  }
  var yMax = Math.max.apply(Math, _toConsumableArray(y)),
      xMax = Math.max.apply(Math, _toConsumableArray(x));
  var dt = [],
      y0 = 0,
      x1 = 0;
  for (var _i = 0; _i < 24; _i++) {
    // y0=y[i]*Height / yMax;//original
    // x1=x[i] * Width / xMax;//original
    y0 = y[_i];
    x1 = x[_i];
    // dt=dt.concat({x:x1,y:Height-y0});//ORIGINAL
    dt = dt.concat({ x: x1, y: y0 });
  }
  return dt;
}
function arange(n) {
  return [].concat(_toConsumableArray(Array(n).keys()));
}
function serieInator(p1, p2, p3, p4, n) {
  var res = [];
  for (var i = 0; i < n; i++) {
    var a1 = p1[i],
        a2 = p2[i],
        a3 = p3[i],
        a4 = p4[i];
    res = res.concat({ x: a1['x'], values: [{ value: a1['y'], index: 0, rate: 'روزهای شنبه تا چهارشنبه' }, { value: a2['y'], index: 1, rate: 'روزهای پنجشنبه' }, { value: a3['y'], index: 2, rate: 'روزهای جمعه' }, { value: a4['y'], index: 3, rate: 'روزهای تعطیل' }] });
  }
  return res;
}

var VisibilityToggle = function (_React$Component) {
  _inherits(VisibilityToggle, _React$Component);

  function VisibilityToggle(props) {
    _classCallCheck(this, VisibilityToggle);

    var _this = _possibleConstructorReturn(this, (VisibilityToggle.__proto__ || Object.getPrototypeOf(VisibilityToggle)).call(this, props));

    _this.onFormSubmit = _this.onFormSubmit.bind(_this);
    _this.changeLine = _this.changeLine.bind(_this);
    _this.changeRoute = _this.changeRoute.bind(_this);
    _this.changekStation = _this.changekStation.bind(_this);
    _this.state = { RouteVis: false, StVis: false, btnVis: false, sign: '', svgFlag: false,
      line: '', station: '', linecolor: ['#ffffff', '#ee2e24', '#0b55a0', '#2bbdee', '#fcc204'] };
    return _this;
  }
  //event handlers


  _createClass(VisibilityToggle, [{
    key: 'onFormSubmit',
    value: function onFormSubmit(e) {
      e.preventDefault();
    }
  }, {
    key: 'changeLine',
    value: function changeLine() {
      this.setState(function (prevState) {
        return { StVis: false };
      });
      document.getElementById('RL').value = 'noRoute';
      this.setState(function (prevState) {
        return { RouteVis: true };
      });
      this.setState(function (prevState) {
        return { line: lineNum };
      });
      var lineNum = document.getElementById('LL').value;
      console.log(lineNum);
      console.log(this.state.line);

      document.getElementById('LL').style.borderColor = this.state.linecolor[lineNum[4]];

      fetch('../src/' + lineNum + 'routes.json').then(function (response) {
        return response.text();
      }).then(function (data) {
        var Routes = JSON.parse(data)[lineNum];
        var RL = [];
        Routes.map(function (index) {
          return RL = RL.concat(index['route']);
        });
        document.getElementById('positiveRoute').innerHTML = RL[0];
        document.getElementById('negativeRoute').innerHTML = RL[1];
      });
    }
  }, {
    key: 'changeRoute',
    value: function changeRoute() {
      console.log('changeRoute');
      document.getElementById('SL').value = 'noStation';
      var sgn = document.getElementById('RL').value;
      this.setState(function (prevState) {
        return { StVis: true };
      });
      this.setState(function (prevState) {
        return { sign: sgn };
      });
      var line = this.state.line;
      fetch('../src/' + line + sgn + 'Fa.json').then(function (response) {
        return response.text();
      }).then(function (data) {
        var sts = JSON.parse(data)[line];
        for (var index = 0; index < sts.length; index++) {
          var node = document.createElement("option");
          node.setAttribute("id", '' + index);
          node.setAttribute("value", '' + index);
          node.text = sts[index]['station'];
          document.getElementById('SL').appendChild(node);
        }
      });
    }
  }, {
    key: 'changekStation',
    value: function changekStation() {
      var val = document.getElementById('SL').value;
      var stName = document.getElementById(val).text;
      var station = { 'index': val, 'name': stName },
          line = this.state.line,
          sign = this.state.sign;
      d3.csv('../src/trainData/trainData_line0' + line[4] + '_' + sign + '_regularDay.csv', function (data) {
        var ds = dataFormatter(height, width, data[station['index']]);
        localStorage.setItem('regD', JSON.stringify(ds));
      });

      d3.csv('../src/trainData/trainData_line0' + line[4] + '_' + sign + '_thursday.csv', function (data) {
        var ds = dataFormatter(height, width, data[station['index']]);
        localStorage.setItem('thursD', JSON.stringify(ds));
      });

      d3.csv('../src/trainData/trainData_line0' + line[4] + '_' + sign + '_friday.csv', function (data) {
        var ds = dataFormatter(height, width, data[station['index']]);
        localStorage.setItem('friD', JSON.stringify(ds));
      });

      d3.csv('../src/trainData/trainData_line0' + line[4] + '_' + sign + '_holiDay.csv', function (data) {
        var ds = dataFormatter(height, width, data[station['index']]);
        localStorage.setItem('holiD', JSON.stringify(ds));
      });
      var ds0 = JSON.parse(localStorage.getItem('regD'));
      var ds1 = JSON.parse(localStorage.getItem('thursD'));
      var ds2 = JSON.parse(localStorage.getItem('friD'));
      var ds3 = JSON.parse(localStorage.getItem('holiD'));
      console.log('inator:');
      var data = serieInator(ds0, ds1, ds2, ds3, ds0['length']);
      console.log(data);
      var margin = { top: 20, right: 20, bottom: 30, left: 40 },
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
      if (this.state.svgFlag) {
        var SVG = document.getElementById('dataSvg');
        SVG.parentNode.removeChild(SVG);
      }
      var svg = d3.select("#dataSVG").append("svg").attr('id', 'dataSvg').attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg.axis().scale(x0).tickSize(0).orient("bottom");
      var yAxis = d3.svg.axis().scale(y).orient("left");
      var color = d3.scale.ordinal().range(["#ca0020", "#f4a582", "#d5d5d5", "#92c5de", "#0571b0"]);

      var categoriesNames = data.map(function (d) {
        return d.x;
      });
      var rateNames = data[0].values.map(function (d) {
        return d.rate;
      });

      x0.domain(categoriesNames);
      x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
      y.domain([0, d3.max(data, function (x) {
        return d3.max(x.values, function (d) {
          return d.value;
        });
      })]);

      //axes
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
      svg.append("g").attr("class", "y axis").style('opacity', '0').call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").style('font-weight', 'bold').text("تعداد قطار");

      svg.select('.y').transition().duration(750).delay(800).style('opacity', '1');

      var slice = svg.selectAll(".slice").data(data).enter().append("g").attr("class", "g").attr("transform", function (d) {
        return "translate(" + x0(d.x) + ",0)";
      });

      slice.selectAll("rect").data(function (d) {
        return d.values;
      }).enter().append("rect").attr("width", x1.rangeBand()).attr("class", function (d) {
        return 'day' + (3 - d.index) + 'rate';
      }).attr("x", function (d) {
        return x1(d.rate);
      }).style("fill", function (d) {
        return color(d.rate);
      }).attr("y", function (d) {
        return y(0);
      }).attr("height", function (d) {
        return height - y(0);
      }).on("mouseover", function (d) {
        d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
      }).on("mouseout", function (d) {
        d3.select(this).style("fill", color(d.rate));
      });

      slice.selectAll("rect").transition().delay(function (d) {
        return Math.random() * 500;
      }).duration(1000).attr("y", function (d) {
        return y(d.value);
      }).attr("height", function (d) {
        return height - y(d.value);
      });

      //Legend
      var legend = svg.selectAll(".legend").data(data[0].values.map(function (d) {
        return d.rate;
      }).reverse()).enter().append("g").attr("class", function (d, i) {
        return 'legend' + i;
      }).attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      }).style("opacity", "0").on("mouseover", function (d, i) {
        for (var k = 0; k < 4; k++) {
          if (k != i) {
            var rec = d3.selectAll('.day' + k + 'rate').style("opacity", "0.1");
            console.log(k);
          }
        }
      }).on("mouseout", function (d, i) {
        for (var k = 0; k < 4; k++) {
          if (k != i) {
            var rec = d3.selectAll('.day' + k + 'rate').style("opacity", "1");
          }
        }
      });

      legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", function (d) {
        return color(d);
      });

      legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
        return d;
      });
      if (this.state.svgFlag) {
        legend.transition().duration(100).delay(function (d, i) {
          return 0;
        }).style("opacity", "1");
      } else {
        legend.transition().duration(500).delay(function (d, i) {
          return 1300 + 100 * i;
        }).style("opacity", "1");
      }
      this.setState(function (prevState) {
        return { svgFlag: true };
      });

      this.setState(function (prevState) {
        return { station: { 'index': val, 'name': stName } };
      });
    }
    /*
    fetchStatioData(){  
      /*
        d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_${day}.csv`,
          function (data) {
            const i=parseInt(localStorage.getItem('index'));
            if (i==station['index']) {
              let ds=dataFormatter(height,width,data); // create svg element:
              // console.log(ds);
              let svg = d3.select("svg").attr("width", width).attr("height", height);
              let curveFunc = d3.area()
                .x(function(d) { return d.x }) // Position of both line breaks on the X axis
                .y1(function(d) { return d.y }) // Y position of top line breaks
                .y0(height);  // Y position of bottom line breaks (200 = bottom of svg area)
              // Add the path using this helper function 
              svg.append('path')
               .attr('d', curveFunc(ds))
               .attr('stroke', 'black')
               .attr('fill', '#69b3a2');  
            }
            localStorage.setItem('index',i+1);
          }
        );
    }*/

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'reactApp' },
        React.createElement(
          'h1',
          null,
          '\u0686\u06AF\u0627\u0644\u06CC \u0642\u0637\u0627\u0631 \u0647\u0627 \u0628\u0631 \u0633\u0627\u0639\u062A'
        ),
        React.createElement(
          'form',
          { onSubmit: this.onFormSubmit },
          true && React.createElement(
            'select',
            { className: 'line', onChange: this.changeLine, defaultValue: 'noLine', id: 'LL' },
            React.createElement(
              'option',
              { className: 'line', id: 'nl', disabled: 'true', value: 'noLine' },
              '--\u062E\u0637 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F--'
            ),
            React.createElement(
              'option',
              { className: 'line', id: 'line1', value: 'line1' },
              '\u062E\u0637 \u06CC\u06A9'
            ),
            React.createElement(
              'option',
              { className: 'line', id: 'line2', value: 'line2' },
              '\u062E\u0637 \u062F\u0648'
            ),
            React.createElement(
              'option',
              { className: 'line', id: 'line3', value: 'line3' },
              '\u062E\u0637 \u0633\u0647'
            ),
            React.createElement(
              'option',
              { className: 'line', id: 'line4', value: 'line4' },
              '\u062E\u0637 \u0686\u0647\u0627\u0631'
            )
          ),
          true && React.createElement(
            'select',
            { id: 'RL', defaultValue: 'noRoute', disabled: !this.state.RouteVis, onChange: this.changeRoute },
            React.createElement(
              'option',
              { disabled: 'true', value: 'noRoute' },
              '--\u0645\u0633\u06CC\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F--'
            ),
            React.createElement(
              'option',
              { id: 'positiveRoute', value: 'positive' },
              '\u0645\u0633\u06CC\u0631 \u0631\u0641\u062A'
            ),
            React.createElement(
              'option',
              { id: 'negativeRoute', value: 'negative' },
              '\u0645\u0633\u06CC\u0631 \u0628\u0631\u06AF\u0634\u062A'
            )
          ),
          true && React.createElement(
            'select',
            { id: 'SL', disabled: !this.state.StVis, defaultValue: 'noStation', onChange: this.changekStation },
            React.createElement(
              'option',
              { disabled: 'true', value: 'noStation' },
              '--\u0627\u06CC\u0633\u062A\u06AF\u0627\u0647 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F--'
            )
          )
        ),
        React.createElement('div', { id: 'dataSVG', className: 'area' })
      );
    }
  }]);

  return VisibilityToggle;
}(React.Component);

ReactDOM.render(React.createElement(VisibilityToggle, null), document.getElementById('app'));
