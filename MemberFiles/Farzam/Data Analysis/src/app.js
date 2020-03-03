// helping functions
function TimeFormatter(stringTime) {
  var newTime=stringTime.split(':');
  var hour=newTime[0];
  var minute=newTime[1];  
  return [hour,minute];
}
function xAxis(){
  let x=[];
for (let index = 0; index < 24; index++) {
  x=x.concat(index);
  }
  return x;
}
function dataFormatter(height,width,trainTimes){
  let y= new Array(24).fill(0);
  // console.log('dataFormatter');
  // console.log(height+1);
  // console.log(width+1);
  // console.log(trainTimes+1);
  const x=xAxis(),Width=parseInt(width),Height=parseInt(height);
  for (let i = 1; i < 24; i++) {
    for (let index in trainTimes) {
      if (TimeFormatter(trainTimes[index])[0]==i) {
        y[i]=y[i]+1;
      }
    }
  }
  const yMax=Math.max(...y),xMax=Math.max(...x);
  let dt=[],y0=0,x1=0;
  for (let i = 0; i < 24; i++) {
    y0=y[i]*Height / yMax;
    x1=x[i] * Width / xMax;
    // dt=dt.concat({x:x1,y:Height-y0});//ORIGINAL
    dt=dt.concat({x:x1,y:y0});
} 
  return dt;
}
function arange(n) {
  return [...Array(n).keys()];
}
function serieInator(p1,p2,p3,p4,n) {
  let res=[];
  for (let i = 0; i < n; i++) {
    let a1=p1[i],a2=p2[i],a3=p3[i],a4=p4[i],res0={};
    res=res.concat(     {x:a1['x'],regularDay:a1['y'],thursday:a2['y'],friday:a3['y'],holiDay:a4['y']}    );
  }
  return(res);
}

class VisibilityToggle extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.changeDay = this.changeDay.bind(this);
    this.changeLine = this.changeLine.bind(this);
    this.clickRoute = this.clickRoute.bind(this);
    this.changeRoute = this.changeRoute.bind(this);
    this.clickStation = this.clickStation.bind(this);
    this.changekStation = this.changekStation.bind(this);
    this.fetchStatioData = this.fetchStatioData.bind(this);
    this.state = {RouteVis: false,StVis:false,day:'',btnVis:false,sign:'',
    line:'',station:'',linecolor:['#ffffff','#ee2e24','#0b55a0','#2bbdee','#fcc204']};
  }
  // data = Object.assign(d3.csvParse(await FileAttachment("unemployment-2.csv").text(), d3.autoType), {y: "Unemployment"})
//event handlers
onFormSubmit(e){e.preventDefault();}
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
    node.setAttribute("id", `${index}`);
    node.setAttribute("value", `${index}`);
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
            document.getElementById(`${index}`).innerHTML=st;        
      }
    }
}
changekStation(){
  const val=document.getElementById('SL').value;
  const stName=document.getElementById(val).text;
  this.setState((prevState)=>{  return {station:{'index':val,'name':stName}};   }     );
  this.setState((prevState)=>{  return {btnVis:true   }}     );
}
fetchStatioData(){
  localStorage.setItem('index',0);
  const height=400,width=600;
  const  sign=this.state.sign, station=this.state.station, line=this.state.line;
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

  localStorage.setItem('index1',0);
  d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_regularDay.csv`,
    function (data) {
      const i=parseInt(localStorage.getItem('index1'));
      if (i==station['index']) {
        let ds=dataFormatter(height,width,data); // create svg element:
        localStorage.setItem('regD',JSON.stringify(ds));
      }
      localStorage.setItem('index1',i+1);
    }
  );
  localStorage.setItem('index2',0);
  d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_thursday.csv`,
    function (data) {
      const i=parseInt(localStorage.getItem('index2'));
      if (i==station['index']) {
        let ds=dataFormatter(height,width,data); // create svg element:
        localStorage.setItem('thursD',JSON.stringify(ds));
      }
      localStorage.setItem('index2',i+1);
    }
  );
  localStorage.setItem('index3',0);
  d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_friday.csv`,
    function (data) {
    const i=parseInt(localStorage.getItem('index3'));
    if (i==station['index']) {
      let ds=dataFormatter(height,width,data); // create svg element:
      localStorage.setItem('friD',JSON.stringify(ds));
    }
    localStorage.setItem('index3',i+1);
    }
  );
  localStorage.setItem('index4',0);
  d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_holiDay.csv`,
    function (data) {
  const i=parseInt(localStorage.getItem('index4'));
  if (i==station['index']) {
    let ds=dataFormatter(height,width,data); // create svg element:
    localStorage.setItem('holiD',JSON.stringify(ds));
  }
  localStorage.setItem('index4',i+1);
    }
  );
let ds0=JSON.parse(localStorage.getItem('regD'));
let ds1=JSON.parse(localStorage.getItem('thursD'));
let ds2=JSON.parse(localStorage.getItem('friD'));
let ds3=JSON.parse(localStorage.getItem('holiD'));
console.log('inator:');
const data=serieInator(ds0,ds1,ds2,ds3,ds0['length']);
console.log(data);
let svg = d3.select("svg").attr("width", width).attr("height", height);
// const color = d3.scaleOrdinal()
//     .domain(data.columns.slice(1))
//     .range(d3.schemeCategory10);s
var z = d3.interpolateCool

var stack = d3.stack()
.keys(['regularDay','thursday','friday','holiDay'])
.order(d3.stackOrderNone)
.offset(d3.stackOffsetNone);

var series = stack(data);
localStorage.setItem('data',JSON.stringify(data));
localStorage.setItem('series',JSON.stringify(series));
// series = d3.stack()
//     .keys(data.columns.slice(1))
//     .offset(d3.stackOffsetWiggle)
//     .order(d3.stackOrderInsideOut)
//   (data);
const margin = ({top: 0, right: 20, bottom: 30, left: 20});
let x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.x))
    .range([margin.left, width - margin.right]);
let y = d3.scaleLinear()
    .domain([d3.min(series, d => d3.min(d, d => d[0])), d3.max(series, d => d3.max(d, d => d[1]))])
    .range([height - margin.bottom, margin.top]);

const area = d3.area()
    .x(d => x(d.data.x))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

svg.append("g")
    .selectAll("path")
    .data(series)
    .join("path")
        // .attr("fill", ({key}) => color(key))
        .attr("d", area)
        .attr("fill", () => z(Math.random()))
    .append("title")
        .text(({key}) => key);

// svg.append("g")
//     .call(xAxis);
}

  
  render() {
    return (<div>
      <h1>Data Visualization</h1>
      <form onSubmit={this.onFormSubmit}>
        {false && (<select onChange={this.changeDay} defaultValue='noDay' id='DL'>
          <option className='day' id='nd' disabled='true' value="noDay">--select day--</option>
          <option className='day' id="day1" value="regularDay">Regural Day</option>
          <option className='day' id="day2" value="thursday">Thursday</option>
          <option className='day' id="day3" value="friday">Friday</option>
          <option className='day' id="day4" value="holiDay">Holliday</option>
        </select>)}
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
      
        {this.state.RouteVis&&  (<select id='SL' disabled={!this.state.StVis} defaultValue='noStation' onClick={this.clickStation} onChange={this.changekStation}>    
          <option disabled='true' value='noStation'>--select station--</option>
        </select>)}
        {/*<button disabled={!(this.state.day && this.state.btnVis)} onClick={this.fetchStatioData}>fetchStatioData</button>*/}
        <button disabled={!(this.state.btnVis)} onClick={this.fetchStatioData}>fetchStatioData</button>
        </form>
      <div id='dataSVG' className='area'><svg>svg here</svg></div>
    </div>);
  }
}

ReactDOM.render(<VisibilityToggle />, document.getElementById('app'));
