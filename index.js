'use strict'
const GHIBLI_MOVIES_INFO = './data/ghibli_movies_info.json';
const GHIBLI_MOVIES_ALL_COLORS = './data/ghibli_colors.json';
var moviePosters = [];
let frame;
let currentIndex = 0

let canvas = {
  width: window.innerWidth,
  height: 5000,
  moviePosters: null
}

let posterImage = {
  width: 130,
  height: 200,
  startingPosition: 40,
  gutter: 60,
}

let allColorsData;

let animationPositions = {
  byHue: 400,
}
let posterPositions = [{
    x: posterImage.startingPosition,
    y: 32.5,
  },
  {
    x: posterImage.startingPosition + posterImage.width + posterImage.gutter,
    y: 96.5,
  },
  {
    x: (posterImage.startingPosition + posterImage.width * 2) + posterImage.gutter * 2,
    y: 56,
  },
  {
    x: (posterImage.startingPosition + posterImage.width * 3) + posterImage.gutter * 3,
    y: 27,
  },
  {
    x: (posterImage.startingPosition + posterImage.width * 4) + posterImage.gutter * 4,
    y: 68,
  },
];



function preload() {
  loadJSON(GHIBLI_MOVIES_INFO, (data) => {
    let count = 0;
    for (const i in data) {
      if (count % 5 === 0) {
        moviePosters.push([]);
      }
      moviePosters[Math.floor(count / 5)].push(
        loadImage(data[i].poster_path)
      );
      count++;
    }
    // console.log(moviePosters)
  });
  allColorsData = loadJSON(GHIBLI_MOVIES_ALL_COLORS)
  frame = loadImage('./img/frame.png');
}

let sortByHue;

function loadData() {
  const allColors = [];
  for (const i in allColorsData) {
    const movie = allColorsData[i];
    allColors.push(...movie.colors);
  }
  sortByHue = allColors.sort((a, b) => (a[0] - b[0]));
}





function setup() {
  createCanvas(canvas.width, canvas.height);
  loadData();
  let posterList = moviePosters[currentIndex];
  posterList.forEach((poster, index) => {
    // console.log(poster)
    image(frame, posterPositions[index % 5].x - 30, posterPositions[index % 5].y - 270, posterImage.width * 1.5, posterImage.height + 300)
    image(poster, posterPositions[index % 5].x, posterPositions[index % 5].y, posterImage.width, posterImage.height);
  })

}

// const sortByHue = ghibliData.sort((a, b) => (a[0] - b[0]));
function draw() {
  let pos = window.scrollY;


  if (pos > animationPositions.byHue) {
    noStroke()
    colorMode(HSB)
    for (let i = 0; i < sortByHue.length; i++) {
      let c = color(`hsl(${sortByHue[i][0].toFixed(0)}, ${sortByHue[i][1] * 100}%, ${sortByHue[i][2] * 100}%)`)
      // let c = color(`hsl(240, ${sortByHue[i][0] * 100}%, 50%)`);
      fill(c)
      rect((window.innerWidth - sortByHue.length * 4) / 2 + i * 4, 500, 4, 85)

    }
  }

  // clear();


  // image(moviePosters, 0, 0, canvas.width, canvas.height);
}

const getImages = (ghibliMovies) => {
  let images = [];
  let count = 0;
  for (const item in ghibliMovies) {
    if (count % 5 === 0) {
      images.push([]);
    }
    images[Math.floor(count / 5)].push(ghibliMovies[item].poster_path);
    count++;
  }
  return images;
}

function pressStringButton() {
  currentIndex = (currentIndex + 1) % 3;
  let posterList = moviePosters[currentIndex];
  posterList.forEach((poster, index) => {
    // console.log(poster)
    image(frame, posterPositions[index % 5].x - 30, posterPositions[index % 5].y - 270, posterImage.width * 1.5, posterImage.height + 300)
    image(poster, posterPositions[index % 5].x, posterPositions[index % 5].y, posterImage.width, posterImage.height);
  })
}