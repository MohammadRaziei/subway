'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  // console.log('dataFormatter');
  // console.log(height+1);
  // console.log(width+1);
  // console.log(trainTimes+1);
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
    y0 = y[_i] * Height / yMax;
    x1 = x[_i] * Width / xMax;
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
        a4 = p4[i],
        res0 = {};
    res = res.concat({ x: a1['x'], regularDay: a1['y'], thursday: a2['y'], friday: a3['y'], holiDay: a4['y'] });
  }
  return res;
}

var VisibilityToggle = function (_React$Component) {
  _inherits(VisibilityToggle, _React$Component);

  function VisibilityToggle(props) {
    _classCallCheck(this, VisibilityToggle);

    var _this = _possibleConstructorReturn(this, (VisibilityToggle.__proto__ || Object.getPrototypeOf(VisibilityToggle)).call(this, props));

    _this.onFormSubmit = _this.onFormSubmit.bind(_this);
    _this.changeDay = _this.changeDay.bind(_this);
    _this.changeLine = _this.changeLine.bind(_this);
    _this.clickRoute = _this.clickRoute.bind(_this);
    _this.changeRoute = _this.changeRoute.bind(_this);
    _this.clickStation = _this.clickStation.bind(_this);
    _this.changekStation = _this.changekStation.bind(_this);
    _this.fetchStatioData = _this.fetchStatioData.bind(_this);
    _this.state = { RouteVis: false, StVis: false, day: '', btnVis: false, sign: '',
      line: '', station: '', linecolor: ['#ffffff', '#ee2e24', '#0b55a0', '#2bbdee', '#fcc204'] };
    return _this;
  }
  // data = Object.assign(d3.csvParse(await FileAttachment("unemployment-2.csv").text(), d3.autoType), {y: "Unemployment"})
  //event handlers


  _createClass(VisibilityToggle, [{
    key: 'onFormSubmit',
    value: function onFormSubmit(e) {
      e.preventDefault();
    }
  }, {
    key: 'changeDay',
    value: function changeDay() {
      var newDay = document.getElementById('DL').value;
      this.setState(function (prevState) {
        return { day: newDay };
      });
    }
  }, {
    key: 'changeLine',
    value: function changeLine() {
      if (document.getElementById('LL')) {
        this.setState(function (prevState) {
          return { RouteVis: true };
        });
        var lineNum = document.getElementById('LL').value;
        console.log(typeof lineNum === 'undefined' ? 'undefined' : _typeof(lineNum));
        console.log(lineNum);
        var color = this.state.linecolor[lineNum[4]];
        document.getElementById('LL').style.backgroundColor = color;
        this.setState(function (prevState) {
          return { line: lineNum };
        });
        fetch('../src/' + lineNum + 'routes.json').then(function (response) {
          return response.text();
        }).then(function (data) {
          localStorage.setItem('stations', data);
        });
        var Routes = JSON.parse(localStorage.getItem('stations'));
        Routes = Routes[lineNum];
        localStorage.setItem('rt', Routes);

        var RL = [];
        Routes.map(function (index) {
          return RL = RL.concat(index['route']);
        });
        document.getElementById('positiveRoute').innerHTML = RL[0];
        document.getElementById('negativeRoute').innerHTML = RL[1];
      }
    }
  }, {
    key: 'clickRoute',
    value: function clickRoute() {
      console.log('clickRoute');
    }
  }, {
    key: 'changeRoute',
    value: function changeRoute() {
      console.log('changeRoute');

      var sgn = document.getElementById('RL').value;
      this.setState(function (prevState) {
        return { StVis: true };
      });
      this.setState(function (prevState) {
        return { sign: sgn };
      });
      var line = this.state.line;
      fetch('../src/' + line + sgn + '.json').then(function (response) {
        return response.text();
      }).then(function (data) {
        localStorage.setItem('stationsName', data);
      });
      var sts = JSON.parse(localStorage.getItem('stationsName'));
      sts = sts[line];
      var stations = [];
      for (var index = 0; index < sts.length; index++) {
        stations = stations.concat(sts[index]['station']);
      }
      for (var _index = 0; _index < stations.length; _index++) {
        var node = document.createElement("option");
        node.setAttribute("id", '' + _index);
        node.setAttribute("value", '' + _index);
        document.getElementById('SL').appendChild(node);
      }
    }
  }, {
    key: 'clickStation',
    value: function clickStation() {
      var sgn = this.state.sign;
      var line = this.state.line;
      var sts = JSON.parse(localStorage.getItem('stationsName'));
      sts = sts[line];
      var stations = [];
      for (var index = 0; index < sts.length; index++) {
        stations = stations.concat(sts[index]['station']);
      }
      for (var _index2 = 0; _index2 < stations.length; _index2++) {
        var st = stations[_index2];
        if (st) {
          document.getElementById('' + _index2).innerHTML = st;
        }
      }
    }
  }, {
    key: 'changekStation',
    value: function changekStation() {
      var val = document.getElementById('SL').value;
      var stName = document.getElementById(val).text;
      this.setState(function (prevState) {
        return { station: { 'index': val, 'name': stName } };
      });
      this.setState(function (prevState) {
        return { btnVis: true };
      });
    }
  }, {
    key: 'fetchStatioData',
    value: function fetchStatioData() {
      localStorage.setItem('index', 0);
      var height = 400,
          width = 600;
      var sign = this.state.sign,
          station = this.state.station,
          line = this.state.line;
      // console.log(`${line} of route${sign} at station${station} on ${day}`);const day=this.state.day;

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
      */

      localStorage.setItem('index1', 0);
      d3.csv('../src/trainData/trainData_line0' + line[4] + '_' + sign + '_regularDay.csv', function (data) {
        var i = parseInt(localStorage.getItem('index1'));
        if (i == station['index']) {
          var ds = dataFormatter(height, width, data); // create svg element:
          localStorage.setItem('regD', JSON.stringify(ds));
        }
        localStorage.setItem('index1', i + 1);
      });
      localStorage.setItem('index2', 0);
      d3.csv('../src/trainData/trainData_line0' + line[4] + '_' + sign + '_thursday.csv', function (data) {
        var i = parseInt(localStorage.getItem('index2'));
        if (i == station['index']) {
          var ds = dataFormatter(height, width, data); // create svg element:
          localStorage.setItem('thursD', JSON.stringify(ds));
        }
        localStorage.setItem('index2', i + 1);
      });
      localStorage.setItem('index3', 0);
      d3.csv('../src/trainData/trainData_line0' + line[4] + '_' + sign + '_friday.csv', function (data) {
        var i = parseInt(localStorage.getItem('index3'));
        if (i == station['index']) {
          var ds = dataFormatter(height, width, data); // create svg element:
          localStorage.setItem('friD', JSON.stringify(ds));
        }
        localStorage.setItem('index3', i + 1);
      });
      localStorage.setItem('index4', 0);
      d3.csv('../src/trainData/trainData_line0' + line[4] + '_' + sign + '_holiDay.csv', function (data) {
        var i = parseInt(localStorage.getItem('index4'));
        if (i == station['index']) {
          var ds = dataFormatter(height, width, data); // create svg element:
          localStorage.setItem('holiD', JSON.stringify(ds));
        }
        localStorage.setItem('index4', i + 1);
      });
      var ds0 = JSON.parse(localStorage.getItem('regD'));
      var ds1 = JSON.parse(localStorage.getItem('thursD'));
      var ds2 = JSON.parse(localStorage.getItem('friD'));
      var ds3 = JSON.parse(localStorage.getItem('holiD'));
      console.log('inator:');
      var data = serieInator(ds0, ds1, ds2, ds3, ds0['length']);
      console.log(data);
      var svg = d3.select("svg").attr("width", width).attr("height", height);
      // const color = d3.scaleOrdinal()
      //     .domain(data.columns.slice(1))
      //     .range(d3.schemeCategory10);s
      var z = d3.interpolateCool;

      var stack = d3.stack().keys(['regularDay', 'thursday', 'friday', 'holiDay']).order(d3.stackOrderNone).offset(d3.stackOffsetNone);

      var series = stack(data);
      localStorage.setItem('data', JSON.stringify(data));
      localStorage.setItem('series', JSON.stringify(series));
      // series = d3.stack()
      //     .keys(data.columns.slice(1))
      //     .offset(d3.stackOffsetWiggle)
      //     .order(d3.stackOrderInsideOut)
      //   (data);
      var margin = { top: 0, right: 20, bottom: 30, left: 20 };
      var x = d3.scaleUtc().domain(d3.extent(data, function (d) {
        return d.x;
      })).range([margin.left, width - margin.right]);
      var y = d3.scaleLinear().domain([d3.min(series, function (d) {
        return d3.min(d, function (d) {
          return d[0];
        });
      }), d3.max(series, function (d) {
        return d3.max(d, function (d) {
          return d[1];
        });
      })]).range([height - margin.bottom, margin.top]);

      var area = d3.area().x(function (d) {
        return x(d.data.x);
      }).y0(function (d) {
        return y(d[0]);
      }).y1(function (d) {
        return y(d[1]);
      });

      svg.append("g").selectAll("path").data(series).join("path")
      // .attr("fill", ({key}) => color(key))
      .attr("d", area).attr("fill", function () {
        return z(Math.random());
      }).append("title").text(function (_ref) {
        var key = _ref.key;
        return key;
      });

      // svg.append("g")
      //     .call(xAxis);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          'Data Visualization'
        ),
        React.createElement(
          'form',
          { onSubmit: this.onFormSubmit },
          false && React.createElement(
            'select',
            { onChange: this.changeDay, defaultValue: 'noDay', id: 'DL' },
            React.createElement(
              'option',
              { className: 'day', id: 'nd', disabled: 'true', value: 'noDay' },
              '--select day--'
            ),
            React.createElement(
              'option',
              { className: 'day', id: 'day1', value: 'regularDay' },
              'Regural Day'
            ),
            React.createElement(
              'option',
              { className: 'day', id: 'day2', value: 'thursday' },
              'Thursday'
            ),
            React.createElement(
              'option',
              { className: 'day', id: 'day3', value: 'friday' },
              'Friday'
            ),
            React.createElement(
              'option',
              { className: 'day', id: 'day4', value: 'holiDay' },
              'Holliday'
            )
          ),
          true && React.createElement(
            'select',
            { className: 'line', onChange: this.changeLine, defaultValue: 'noLine', id: 'LL' },
            React.createElement(
              'option',
              { className: 'line', id: 'nl', disabled: 'true', value: 'noLine' },
              '--select line--'
            ),
            React.createElement(
              'option',
              { className: 'line', id: 'line1', value: 'line1' },
              'line 1'
            ),
            React.createElement(
              'option',
              { className: 'line', id: 'line2', value: 'line2' },
              'line 2'
            ),
            React.createElement(
              'option',
              { className: 'line', id: 'line3', value: 'line3' },
              'line 3'
            ),
            React.createElement(
              'option',
              { className: 'line', id: 'line4', value: 'line4' },
              'line 4'
            )
          ),
          true && React.createElement(
            'select',
            { id: 'RL', defaultValue: 'noRoute', disabled: !this.state.RouteVis, onClick: this.clickRoute, onChange: this.changeRoute },
            React.createElement(
              'option',
              { disabled: 'true', value: 'noRoute' },
              '--select route--'
            ),
            React.createElement(
              'option',
              { id: 'positiveRoute', value: 'positive' },
              ' line 2'
            ),
            React.createElement(
              'option',
              { id: 'negativeRoute', value: 'negative' },
              ' line 3'
            )
          ),
          this.state.RouteVis && React.createElement(
            'select',
            { id: 'SL', disabled: !this.state.StVis, defaultValue: 'noStation', onClick: this.clickStation, onChange: this.changekStation },
            React.createElement(
              'option',
              { disabled: 'true', value: 'noStation' },
              '--select station--'
            )
          ),
          React.createElement(
            'button',
            { disabled: !this.state.btnVis, onClick: this.fetchStatioData },
            'fetchStatioData'
          )
        ),
        React.createElement(
          'div',
          { id: 'dataSVG', className: 'area' },
          React.createElement(
            'svg',
            null,
            'svg here'
          )
        )
      );
    }
  }]);

  return VisibilityToggle;
}(React.Component);

ReactDOM.render(React.createElement(VisibilityToggle, null), document.getElementById('app'));
