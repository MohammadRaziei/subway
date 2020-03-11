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
    res=res.concat(     { x:a1['x'] , values: [ {value:a1['y'],index:0,rate:'روزهای شنبه تا چهارشنبه'} , {value:a2['y'],index:1,rate:'روزهای پنجشنبه'} , {value:a3['y'],index:2,rate:'روزهای جمعه'} , {value:a4['y'],index:3,rate:'روزهای تعطیل'}]} );
  }
  return(res);
}

class VisibilityToggle extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.changeLine = this.changeLine.bind(this);
    this.changeRoute = this.changeRoute.bind(this);
    this.changekStation = this.changekStation.bind(this);
    this.state = {RouteVis: false,StVis:false,btnVis:false,sign:'',svgFlag:false,
    line:'',station:'',linecolor:['#ffffff','#ee2e24','#0b55a0','#2bbdee','#fcc204']};
  }
//event handlers
onFormSubmit(e){e.preventDefault();}
changeLine(){
    this.setState((prevState) => {  return {StVis: false};   }     );
    document.getElementById('RL').value='noRoute'
    this.setState((prevState) => {  return {RouteVis: true};   }     );
    this.setState((prevState) => {  return {line: lineNum};   }     );
    let lineNum=document.getElementById('LL').value;
    console.log(lineNum);
    console.log(this.state.line);

    document.getElementById('LL').style.borderColor=this.state.linecolor[lineNum[4]];
    
    fetch(`../src/${lineNum}routes.json`)
      .then(response => response.text())
        .then(function (data) {
          const Routes= JSON.parse(data)[lineNum];
          let RL=[];
          Routes.map(index => RL=RL.concat(index['route']));
          document.getElementById('positiveRoute').innerHTML=RL[0];
          document.getElementById('negativeRoute').innerHTML=RL[1];
        }
    );



}
changeRoute(){
  console.log('changeRoute');
  document.getElementById('SL').value='noStation'
  const sgn=document.getElementById('RL').value;
  this.setState((prevState)=>{  return {StVis: true};   }     );
  this.setState((prevState)=>{  return {sign:sgn};   }     );
  const line=this.state.line;
  fetch(`../src/${line}${sgn}Fa.json`)
    .then(response => response.text())  
      .then(function (data) 
        {
          const sts=JSON.parse(data)[line];
          for (let index = 0; index < sts.length; index++) {
            let node=document.createElement("option");
            node.setAttribute("id", `${index}`);
            node.setAttribute("value", `${index}`);
            node.text=sts[index]['station'];
            document.getElementById('SL').appendChild(node);
            }
          }
        );

}
changekStation(){
  const val=document.getElementById('SL').value;
  const stName=document.getElementById(val).text;
  const station={'index':val,'name':stName}, line=this.state.line,sign=this.state.sign;
  d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_regularDay.csv`,
    function (data) {    
      let ds=dataFormatter(height,width,data[station['index']]);
      localStorage.setItem('regD',JSON.stringify(ds));
    }
  );

  d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_thursday.csv`,
    function (data) {
      let ds=dataFormatter(height,width,data[station['index']]);
      localStorage.setItem('thursD',JSON.stringify(ds));
    }
  );

  d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_friday.csv`,
    function (data) {
      let ds=dataFormatter(height,width,data[station['index']]);
      localStorage.setItem('friD',JSON.stringify(ds));
    }
  );

  d3.csv(`../src/trainData/trainData_line0${line[4]}_${sign}_holiDay.csv`,
    function (data) {
      let ds=dataFormatter(height,width,data[station['index']]);
      localStorage.setItem('holiD',JSON.stringify(ds));
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
  if (this.state.svgFlag) {
  const SVG=document.getElementById('dataSvg');
  SVG. parentNode. removeChild(SVG);
  }
  let svg = d3.select("#dataSVG")
    .append("svg")
      .attr('id','dataSvg')  
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


  svg.select('.y').transition().duration(750).delay(800).style('opacity','1');

  let slice = svg.selectAll(".slice")
    .data(data)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform",function(d) { return "translate(" + x0(d.x) + ",0)"; });

  slice.selectAll("rect")
    .data(function(d) { return d.values; })
  .enter().append("rect")
    .attr("width", x1.rangeBand())
    .attr("class", function(d) { return `day${3-d.index}rate`; })
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
    .delay(function (d) {return Math.random()*500;})
    .duration(1000)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); });

  //Legend
  let legend = svg.selectAll(".legend")
    .data(data[0].values.map(function(d) { return d.rate; }).reverse())
    .enter().append("g")
    .attr("class", function(d,i){return `legend${i}`;})
    .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
    .style("opacity","0")
    .on("mouseover", function(d,i){
      for (let k = 0; k < 4; k++) {
        if (k!=i) {
          let rec=d3.selectAll(`.day${k}rate`).style("opacity","0.1");
          console.log(k);
        }
      }
    })
    .on("mouseout", function(d,i){
      for (let k = 0; k < 4; k++) {
        if (k!=i) {
          let rec=d3.selectAll(`.day${k}rate`).style("opacity","1");
        }
      }
    });

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
  if (this.state.svgFlag) {
    legend.transition().duration(100).delay(function(d,i){ return  0; }).style("opacity","1");
    } else {
      legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
    }
  this.setState(   (prevState) => { return{svgFlag: true}; }     );

  this.setState((prevState)=>{  return {station:{'index':val,'name':stName}};   }     );
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

render() {
  return (<div id='reactApp'>
    <h1>چگالی قطار ها بر ساعت</h1>
    <form onSubmit={this.onFormSubmit}>
      {true &&(<select className='line' onChange={this.changeLine} defaultValue='noLine' id='LL'>
        <option className='line' id='nl' disabled='true' value="noLine">--خط مورد نظر را انتخاب کنید--</option>
        <option className='line' id="line1" value="line1">خط یک</option>
        <option className='line' id="line2" value="line2">خط دو</option>
        <option className='line' id="line3" value="line3">خط سه</option>
        <option className='line' id="line4" value="line4">خط چهار</option>
      </select>)}
    
      {true &&(<select id='RL' defaultValue='noRoute' disabled={!this.state.RouteVis} onChange={this.changeRoute}>
        <option disabled='true' value="noRoute">--مسیر مورد نظر را انتخاب کنید--</option>
        <option id='positiveRoute' value="positive">مسیر رفت</option>
        <option id='negativeRoute' value="negative">مسیر برگشت</option>
      </select>)}

      {true && (<select id='SL' disabled={!this.state.StVis} defaultValue='noStation' onChange={this.changekStation}>    
        <option disabled='true' value='noStation'>--ایستگاه مورد نظر را انتخاب کنید--</option>
      </select>)}
      </form>
    <div id='dataSVG' className='area'></div>
    </div>);
  }
}

ReactDOM.render(<VisibilityToggle />, document.getElementById('app'));
