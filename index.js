'use strict'
const GHIBLI_MOVIES_ALL_COLORS = './data/ghibli_colors.json';

let allColorsData;
let simulation, nodes;
let salarySizeScale, salaryXScale, categoryColorScale
let categoryLegend, salaryLegend

const margin = {left: 500, top: 50, bottom: 50, right: 500}
const width = window.innerWidth - margin.left - margin.right
const height = 1000 - margin.top - margin.bottom

let animationPositions = {
  byHue: 700,
}

let animations = {
  fadeLength: 200
}

// loading and organize data
// function preload() {
//   allColorsData = loadJSON(GHIBLI_MOVIES_ALL_COLORS);
// }

let sortByHue;
let classifyData;
// function loadData() {
//   console.log(allColorsData)
//   const allColors = [];
//   for (const i in allColorsData) {
//     const movie = allColorsData[i];
//     allColors.push(...movie.colors);
//   }
//   sortByHue = allColors.sort((a, b) => (a[0] - b[0]));
// }

// function setup() {
//   // createCanvas(canvas.width, canvas.height);
//   loadData();
//   drawInitial()
// }

// const classifiedColors = {
//   'red': '#FD050D',
//   'yellow': '#FF8000',
//   'green': '#00FF00',
//   'cyan': '#00FFFF',
//   'blue': '#0000FF',
//   'purple': '#8000FF',
// };

const colorCategroy = [
  '#FD050D',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#8000FF',
];

function classifyColors(data) {
  console.log(data)
  var red = []
  var yellow = [];
  var cyan = []
  var blue = [];
  var green = [];
  var purple = [];
  for(const i in data) {
    let color = data[i];
    let hue = color[0];

      // if(hue >= 0 && hue <= 80) {
      //     warm.push(color);
      // }

      // if(hue > 80 && hue <= 330) {
      //     cold.push(color)
      // }

    if(hue >= 330 && hue <= 360 || hue >=0 && hue < 30) {
      red.push(color);
    } else if(hue < 90 && hue >= 30) {
      yellow.push(color);
    } else if(hue >= 90 && hue < 150) {
      green.push(color);
    } else if(hue >= 150 && hue < 210) {
      cyan.push(color);
    } else if(hue >= 210 && hue < 270) {
      blue.push(color);
    } else if(hue >= 270 && hue < 330) {
      purple.push(color);
    }
  }

  const classifiedColors = [
    red,
    yellow,
    green,
    cyan,
    blue,
    purple,
  ];

  const classifiedColorsCounts = [
    red.length,
    yellow.length,
    green.length,
    cyan.length,
    blue.length,
    purple.length,
  ]
  return {classifiedColors, classifiedColorsCounts};
}

d3.json(GHIBLI_MOVIES_ALL_COLORS).then(data => {
  allColorsData = data
  console.log(allColorsData)
  const allColors = [];
  for (const i in allColorsData) {
    const movie = allColorsData[i];
    allColors.push(...movie.colors);
  }
  sortByHue = allColors.sort((a, b) => (a[0] - b[0]));
  classifyData = classifyColors(sortByHue);
  console.log(classifyData)
  setTimeout(drawInitial(), 100)
})

function drawInitial(){
  console.log('init')
  let svg = d3.select("#data-visualization")
                .append('svg')
                .attr('width', '100%')
                .attr('height', 950)
                .attr('opacity', 1)

  svg.attr('width', width + margin.left + margin.right);
  svg.attr('height', height + margin.top + margin.bottom);

  var originalRects = svg.append('g')
                    .attr('id','originalRects')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var hueRects = svg.append('g')
    .attr('id','hueRects')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var classifyRects = svg.append('g')
    .attr('id','classifyRects')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var classifyRectsSep = svg.append('g')
    .attr('id','classifyRectsSep')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var donutChart = svg.append('g')
    .attr('id','donutChart')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  originalRects.selectAll("rect").data(sortByHue).enter()
    .append('rect')
      .attr('class', 'rect')
      .attr("x", (d, i) => i * (width / (sortByHue.length)))
      .attr("y", 0)
      .attr('width', width / (sortByHue.length))
      .attr('height', 50)
      .attr('fill', function(d) { return d3.hsl(d[0], d[1], d[2])})
  
  hueRects.selectAll("rect").data(sortByHue).enter()
    .append('rect')
      .attr('class', 'hue-rect')
      .attr("x", (d, i) => i * (width / (sortByHue.length)))
      .attr("y", 0)
      .attr('width', width / (sortByHue.length))
      .attr('height', 50)
      .attr('fill', function(d) { return d3.hsl(d[0], 1, 0.5)})
  
  const sumColor = 0;
  // classifyColors.classifiedColorsCounts.forEach((count) => {sumColor += count});
  let classifyCategroyXs = []
  let sum = 0;
  for(let i = 0; i < classifyData.classifiedColorsCounts.length; i++) {
    sum += classifyData.classifiedColorsCounts[i];
    classifyCategroyXs.push(sum);
  }

  classifyRects.selectAll("rect").data(classifyData.classifiedColorsCounts).enter()
    .append('rect')
      .attr('class', 'classify-rect')
      .attr("x", (d, i) => (classifyCategroyXs[i-1] * width / (sortByHue.length) || 0))
      .attr("y", 0)
      .attr('width', (d, i) => width * (d/250))
      .attr('height', 50)
      .attr('fill', function(d, i) { return colorCategroy[i]})

  classifyRectsSep.selectAll("rect").data(classifyData.classifiedColorsCounts).enter()
    .append('rect')
      .attr('class', 'classify-rect-sep')
      .attr("x", (d, i) => (classifyCategroyXs[i-1] * width / (sortByHue.length) || 0 + i * 50))
      .attr("y", (d, i) => 50 * (i % 2))
      .attr('width', (d, i) => width * (d/250))
      .attr('height', 50)
      .attr('fill', function(d, i) { return colorCategroy[i]});
  

    var data = [2, 4, 8, 10];

    // var svg = d3.select("svg"),
    //     width = svg.attr("width"),
    //     height = svg.attr("height"),
    //     radius = Math.min(width, height) / 2,
    //     g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

    // Generate the pie
    var pie = d3.pie();

    // Generate the arcs
    var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

    //Generate groups
    var arcs = donutChart.selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc")

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);

    hideAll();
}

const showOriginal = () => {
  let svg = d3.select('#data-visualization').select('svg');
  svg.selectAll('.rect').transition().attr('opacity', 1);
  svg.selectAll('.hue-rect').transition().attr('opacity', 0);
  svg.selectAll('.classify-rect').transition().attr('opacity', 0)
  svg.selectAll('.classify-rect-sep').transition().attr('opacity', 0)

}

const showHue = () => {
  let svg = d3.select('#data-visualization').select('svg')
  svg.selectAll('.hue-rect').transition().attr('opacity', 1)
  svg.selectAll('.rect').transition().attr('opacity', 0)
  svg.selectAll('.classify-rect').transition().attr('opacity', 0)
  svg.selectAll('.classify-rect-sep').transition().attr('opacity', 0)

}

const showClassify = () => {
  let svg = d3.select('#data-visualization').select('svg')
  svg.selectAll('.hue-rect').transition().attr('opacity', 0)
  svg.selectAll('.classify-rect').transition().attr('opacity', 1)
  svg.selectAll('.classify-rect-sep').transition().attr('opacity', 0)
}


const showClassifySep = () => {
  let svg = d3.select('#data-visualization').select('svg')
  svg.selectAll('.hue-rect').transition().attr('opacity', 0)
  svg.selectAll('.classify-rect').transition().attr('opacity', 0)
  svg.selectAll('.classify-rect-sep').transition().attr('opacity', 1)
}

const hideAll = () => {
  let svg = d3.select('#data-visualization').select('svg')
  svg.selectAll('.hue-rect').transition().attr('opacity', 0)
  svg.selectAll('.rect').transition().attr('opacity', 0)
  svg.selectAll('.classify-rect').transition().attr('opacity', 0)
  svg.selectAll('.classify-rect-sep').transition().attr('opacity', 0)
}

let activationFunctions = [
  showOriginal,
  showHue,
  showClassify,
  showClassifySep
]

// Handle Scroller
let scroll = scroller()
  .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
  d3.selectAll('.step')
    .transition().duration(500)
    .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});

  activeIndex = index
  let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
  let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);

  scrolledSections.forEach(i => {
    console.log('e')
    activationFunctions[i]();
  })
  lastIndex = activeIndex;
})

// cleaning element when scroll away
function clean(){
  let svg = d3.select('#data-visualization').select('svg')
  svg.select('.rect').transition().attr('opacity', 0)
}



var dataset = [
  { count: 10, size: 45 }, 
  { count: 20, size: 55 },
  { count: 30, size: 65 },
  { count: 40, size: 75 }
];

