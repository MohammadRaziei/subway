class VisibilityToggle extends React.Component {
  constructor(props) {
    super(props);
    this.changeDay = this.changeDay.bind(this);
    this.changeLine = this.changeLine.bind(this);
    this.clickRoute = this.clickRoute.bind(this);
    this.changeRoute = this.changeRoute.bind(this);
    this.clickStation = this.clickStation.bind(this);
    this.state = {RouteVis: false,StVis:false,day:'',sign:'',
    line:'',station:'',linecolor:['#ffffff','#ee2e24','#0b55a0','#2bbdee','#fcc204']};
  }
changeDay(){
  let newDay=document.getElementById('DL').value;
  this.setState(   (prevState) => { return{day: newDay}; }     );
}
changeLine(){
    if (document.getElementById('LL')) {
    this.setState((prevState) => {  return {RouteVis: true};   }     );
    let lineNum=document.getElementById('LL').value;
    console.log(typeof(lineNum));
    console.log(lineNum);
    const color = this.state.linecolor[lineNum[4]];
    document.getElementById('LL').style.backgroundColor=color;
    this.setState((prevState) => {  return {line: lineNum};   }     );
    fetch(`../src/${lineNum}routes.json`).then(response => response.text()).then(function (data) {localStorage.setItem('stations',data);});
    let Routes=JSON.parse(localStorage.getItem('stations'));
    Routes=Routes[lineNum];
    localStorage.setItem('rt',Routes);

  let RL=[];
  Routes.map(index => RL=RL.concat(index['route']));
  document.getElementById('positiveRoute').innerHTML=RL[0];
  document.getElementById('negativeRoute').innerHTML=RL[1];}
}
clickRoute(){
  console.log('clickRoute');
}
changeRoute(){
  console.log('changeRoute');

  const sgn=document.getElementById('RL').value;
  this.setState((prevState)=>{  return {StVis: true};   }     );
  this.setState((prevState)=>{  return {sign:sgn};   }     );
  const line=this.state.line;
  fetch(`../src/${line}${sgn}.json`).then(response => response.text()).then(function (data) {localStorage.setItem('stationsName',data);});
  let sts=JSON.parse(localStorage.getItem('stationsName'));
  sts=sts[line];
  let stations=[];
  for (let index = 0; index < sts.length; index++) {
    stations = stations.concat(sts[index]['station']);
  }
  for (let index = 0; index < stations.length; index++) {
    let node=document.createElement("option");
    node.setAttribute("id", `station${index}`);
    document.getElementById('SL').appendChild(node);
  }

}
clickStation(){
    const sgn=this.state.sign;
    const line=this.state.line;
    let sts=JSON.parse(localStorage.getItem('stationsName'));
    sts=sts[line];
    let stations=[];
    for (let index = 0; index < sts.length; index++) {
      stations = stations.concat(sts[index]['station']);
    }
    for (let index = 0; index < stations.length; index++) {
      const st=stations[index];
      if (st) {
            document.getElementById(`station${index}`).innerHTML=st;        
      }
    }
}

  
  render() {
    return (<div>
      <h1>Visibility Toggle</h1>
      <select onChange={this.changeDay} defaultValue='noDay' id='DL'>
        <option className='day' id='nd' disabled='true' value="noDay">--select day--</option>
        <option className='day' id="day1" value="ReguralDay">Regural Day</option>
        <option className='day' id="day2" value="ThursDay">Thursday</option>
        <option className='day' id="day3" value="FriDay">Friday</option>
        <option className='day' id="day4" value="HolliDay">Holliday</option>
      </select>
      {true &&(<select className='line' onChange={this.changeLine} defaultValue='noLine' id='LL'>
        <option className='line' id='nl' disabled='true' value="noLine">--select line--</option>
        <option className='line' id="line1" value="line1">line 1</option>
        <option className='line' id="line2" value="line2">line 2</option>
        <option className='line' id="line3" value="line3">line 3</option>
        <option className='line' id="line4" value="line4">line 4</option>
      </select>)}

      {true &&(<select id='RL' defaultValue='noRoute' disabled={!this.state.RouteVis} onClick={this.clickRoute} onChange={this.changeRoute}>
        <option disabled='true' value="noRoute">--select route--</option>
        <option id='positiveRoute' value="positive"> line 2</option>
        <option id='negativeRoute' value="negative"> line 3</option>
      </select>)}

      {this.state.RouteVis&&  (<select id='SL' disabled={!this.state.StVis} defaultValue='noStation' onClick={this.clickStation}>    
        <option disabled='true' value='noStation'>--select station--</option>
      </select>)}
    </div>);
  }
}

ReactDOM.render(<VisibilityToggle />, document.getElementById('app'));
