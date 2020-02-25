'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisibilityToggle = function (_React$Component) {
  _inherits(VisibilityToggle, _React$Component);

  function VisibilityToggle(props) {
    _classCallCheck(this, VisibilityToggle);

    var _this = _possibleConstructorReturn(this, (VisibilityToggle.__proto__ || Object.getPrototypeOf(VisibilityToggle)).call(this, props));

    _this.changeLine = _this.changeLine.bind(_this);
    _this.clickRoute = _this.clickRoute.bind(_this);
    _this.changeRoute = _this.changeRoute.bind(_this);
    _this.clickStation = _this.clickStation.bind(_this);
    _this.state = { RouteVis: false, StVis: false, sign: '',
      line: '', station: '', linecolor: ['#ffffff', '#ee2e24', '#0b55a0', '#2bbdee', '#fcc204'] };
    return _this;
  }

  _createClass(VisibilityToggle, [{
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
        node.setAttribute("id", 'station' + _index);
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
          document.getElementById('station' + _index2).innerHTML = st;
        }
      }
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
          'Visibility Toggle'
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
          { id: 'SL', disabled: !this.state.StVis, defaultValue: 'noStation', onClick: this.clickStation },
          React.createElement(
            'option',
            { disabled: 'true', value: 'noStation' },
            '--select station--'
          )
        )
      );
    }
  }]);

  return VisibilityToggle;
}(React.Component);

ReactDOM.render(React.createElement(VisibilityToggle, null), document.getElementById('app'));
