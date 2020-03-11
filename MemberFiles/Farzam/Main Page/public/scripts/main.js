'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainPage = function (_React$Component) {
  _inherits(MainPage, _React$Component);

  function MainPage() {
    _classCallCheck(this, MainPage);

    return _possibleConstructorReturn(this, (MainPage.__proto__ || Object.getPrototypeOf(MainPage)).apply(this, arguments));
  }

  _createClass(MainPage, [{
    key: 'render',
    value: function render() {
      var title = 'برای سفر راحت ، هوشمند عمل کن',
          hyperTexts = ['صفحه اصلی', 'شبیه سازی'],
          number = 'تماس با ما';

      return React.createElement(
        'div',
        null,
        React.createElement(Header, { title: title, hypers: hyperTexts, num: number })
      );
    }
  }]);

  return MainPage;
}(React.Component);

var BckgrndImage = function (_React$Component2) {
  _inherits(BckgrndImage, _React$Component2);

  function BckgrndImage() {
    _classCallCheck(this, BckgrndImage);

    return _possibleConstructorReturn(this, (BckgrndImage.__proto__ || Object.getPrototypeOf(BckgrndImage)).apply(this, arguments));
  }

  _createClass(BckgrndImage, [{
    key: 'render',
    value: function render() {
      return React.createElement('img', { id: 'bcgImg', src: '../src/photos/background.jpg' });
    }
  }]);

  return BckgrndImage;
}(React.Component);

var Header = function (_React$Component3) {
  _inherits(Header, _React$Component3);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
  }

  _createClass(Header, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement('img', { id: 'hIcon', src: '../src/icons/MetroIcon.png', title: 'metro icon' })
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { id: 'title', className: 'header fa' },
            this.props.title
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'a',
            { id: 'hyper1', className: 'header fa', href: '' },
            this.props.hypers[0]
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'a',
            { id: 'hyper2', className: 'header fa', href: '../../Display App/dist/index.html' },
            this.props.hypers[1]
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'svg',
            { id: 'contactNumBox' },
            React.createElement('rect', { fill: 'rgba(242,211,10,1)', id: 'Rectangle_7', rx: '22', ry: '22', x: '0', y: '0', width: '144', height: '44' })
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'a',
            { href: '', className: 'header contactNum' },
            this.props.num
          )
        )
      );
    }
  }]);

  return Header;
}(React.Component);

ReactDOM.render(React.createElement(MainPage, null), document.getElementById('header'));
