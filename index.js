'use strict'
const GHIBLI_MOVIES_ALL_COLORS = './data/ghibli_colors.json';

let allColorsData;
let simulation, nodes;
let salarySizeScale, salaryXScale, categoryColorScale
let categoryLegend, salaryLegend

const margin = {left: 170, top: 50, bottom: 50, right: 20}
const width = 1000 - margin.left - margin.right
const height = 950 - margin.top - margin.bottom

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

d3.json(GHIBLI_MOVIES_ALL_COLORS).then(data => {
  allColorsData = data
  console.log(allColorsData)
  const allColors = [];
  for (const i in allColorsData) {
    const movie = allColorsData[i];
    allColors.push(...movie.colors);
  }
  sortByHue = allColors.sort((a, b) => (a[0] - b[0]));
  setTimeout(drawInitial(), 100)
})

function drawInitial(){
  console.log('init')
  let svg = d3.select("#data-visualization")
                .append('svg')
                .attr('width', 1000)
                .attr('height', 950)
                .attr('opacity', 1)

  svg.attr('width', width + margin.left + margin.right);
  svg.attr('height', height + margin.top + margin.bottom);

  var container1 = svg.append('g')
                    .attr('id','container1');
  var container2 = svg.append('g')
    .attr('id','container2');

  container1.selectAll("rect").data(sortByHue).enter()
    .append('rect')
      .attr('class', 'rect')
      .attr("x", (d, i) => i * (width / (sortByHue.length)))
      .attr("y", 0)
      .attr('width', width / (sortByHue.length))
      .attr('height', 50)
      .attr('fill', function(d) { return d3.hsl(d[0], d[1], d[2])})
  
  container2.selectAll("rect").data(sortByHue).enter()
    .append('rect')
      .attr('class', 'hue-rect')
      .attr("x", (d, i) => i * (width / (sortByHue.length)))
      .attr("y", 0)
      .attr('width', width / (sortByHue.length))
      .attr('height', 50)
      .attr('fill', function(d) { return d3.hsl(d[0], 1, 0.5)})

  svg.selectAll('.rect').transition().attr('opacity', 0)
  svg.selectAll('.hue-rect').transition().attr('opacity', 0)
}


const showOriginal = () => {
  let svg = d3.select('#data-visualization').select('svg')
  svg.selectAll('.hue-rect').transition().attr('opacity', 0)
  svg.selectAll('.rect').transition().attr('opacity', 1)
}

const showHue = () => {
  let svg = d3.select('#data-visualization').select('svg')
  svg.selectAll('.hue-rect').transition().attr('opacity', 1)
  svg.selectAll('.rect').transition().attr('opacity', 0)
}

const hideAll = () => {
  let svg = d3.select('#data-visualization').select('svg')
  svg.selectAll('.hue-rect').transition().attr('opacity', 0)
  svg.selectAll('.rect').transition().attr('opacity', 0)
}

let activationFunctions = [
  showOriginal,
  showHue,
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
    activationFunctions[i]();
  })
  lastIndex = activeIndex;
})

// cleaning element when scroll away
function clean(){
  let svg = d3.select('#data-visualization').select('svg')
  svg.select('.rect').transition().attr('opacity', 0)
}

