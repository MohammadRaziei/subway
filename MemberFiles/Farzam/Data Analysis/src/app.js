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
    // y0=y[i]*Height / yMax;//original
    // x1=x[i] * Width / xMax;//original
    y0=y[i];
    x1=x[i] ;
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
    let a1=p1[i],a2=p2[i],a3=p3[i],a4=p4[i];
    res=res.concat(     { x:a1['x'] , values: [ {value:a1['y'],rate:'روزهای شنبه تا چهارشنبه'} , {value:a2['y'],rate:'روزهای پنجشنبه'} , {value:a3['y'],rate:'روزهای جمعه'} , {value:a4['y'],rate:'روزهای تعطیل'}]} );
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
  fetch(`../src/${line}${sgn}Fa.json`).then(response => response.text()).then(function (data) {localStorage.setItem('stationsName',data);});
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
const margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
let svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

let x1 = d3.scale.ordinal();

let y = d3.scale.linear()
    .range([height, 0]);

let xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");
let yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
let color = d3.scale.ordinal()
    .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

let categoriesNames = data.map(function(d) { return d.x; });
let rateNames = data[0].values.map(function(d) { return d.rate; });

x0.domain(categoriesNames);
x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
y.domain(   [0, d3.max(data, function(x) { return d3.max(x.values, function(d) { return d.value; }  ); })]    );

//axes
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
svg.append("g")
        .attr("class", "y axis")
        .style('opacity','0')
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight','bold')
        .text("تعداد قطار");


svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

let slice = svg.selectAll(".slice")
    .data(data)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform",function(d) { return "translate(" + x0(d.x) + ",0)"; });

slice.selectAll("rect")
    .data(function(d) { return d.values; })
.enter().append("rect")
    .attr("width", x1.rangeBand())
    .attr("x", function(d) { return x1(d.rate); })
    .style("fill", function(d) { return color(d.rate) })
    .attr("y", function(d) { return y(0); })
    .attr("height", function(d) { return height - y(0); })
    .on("mouseover", function(d) {
        d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
    })
    .on("mouseout", function(d) {
        d3.select(this).style("fill", color(d.rate));
    });

slice.selectAll("rect")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(1000)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); });

//Legend
let legend = svg.selectAll(".legend")
    .data(data[0].values.map(function(d) { return d.rate; }).reverse())
.enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
    .style("opacity","0");

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) { return color(d); });

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {return d; });

legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

}

  
  render() {
    return (<div>
      <h1>trains per each hour</h1>
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
          <option className='line' id="line1" value="line1">خط یک</option>
          <option className='line' id="line2" value="line2">خط دو</option>
          <option className='line' id="line3" value="line3">خط سه</option>
          <option className='line' id="line4" value="line4">خط چهار</option>
        </select>)}
      
        {true &&(<select id='RL' defaultValue='noRoute' disabled={!this.state.RouteVis} onClick={this.clickRoute} onChange={this.changeRoute}>
          <option disabled='true' value="noRoute">--select route--</option>
          <option id='positiveRoute' value="positive">مسیر رفت</option>
          <option id='negativeRoute' value="negative">مسیر برگضت</option>
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
