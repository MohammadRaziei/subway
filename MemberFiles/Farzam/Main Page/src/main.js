class MainPage extends React.Component {
  render() {
    const title = 'برای سفر راحت ، هوشمند عمل کن',hyperTexts=['صفحه اصلی','شبیه سازی'],number='02188888';

    return (
      <div>
        <Header title={title} hypers={hyperTexts} num={number}/>
      </div>
    );
  }
}
class BckgrndImage extends React.Component {
  render(){
    return(
      <img id='bcgImg' src='../src/photos/background.jpg'></img>
    )
  }
}
class Header extends React.Component {
  render() {
    return (
      <div>
        <div>
          <img id='hIcon' src='../src/icons/MetroIcon.png' title='metro icon'></img>
        </div>
        <div>
          <label id='title' className='header fa'>{this.props.title}</label>
        </div>
        <div>
          <a id='hyper1' className='header fa' href=''>{this.props.hypers[0]}</a>
        </div>
        <div>
          <a id='hyper2' className='header fa' href='../../Display App/dist/index.html'>{this.props.hypers[1]}</a>
        </div>
        <div>
          <svg id='contactNumBox'>
            <rect fill="rgba(242,211,10,1)" id="Rectangle_7" rx="22" ry="22" x="0" y="0" width="144" height="44"/>
          </svg>
        </div>
        <div>
          <label className="header contactNum" >{this.props.num}</label>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MainPage />, document.getElementById('header'));
