'use strict'
const GHIBLI_MOVIES_INFO = './data/ghibli_movies_info.json';
var moviePosters = [];
let frame;
let currentIndex = 0

let canvas = {
	width: window.innerWidth / 1.5,
	height: 500,
	moviePosters: null
}

let posterImage = {
  width: 130,
  height: 200,
  startingPosition: 40,
  gutter: 60,
}

let posterPositions  = [
  {
    x: posterImage.startingPosition,
    y: 32.5,
  },
  {
    x: posterImage.startingPosition + posterImage.width + posterImage.gutter,
    y: 96.5,
  },
  {
    x: (posterImage.startingPosition + posterImage.width * 2) + posterImage.gutter* 2,
    y: 56,
  },
  {
    x: (posterImage.startingPosition + posterImage.width * 3)  + posterImage.gutter* 3,
    y: 27,
  },
  {
    x: (posterImage.startingPosition + posterImage.width * 4)  + posterImage.gutter* 4,
    y: 68,
  },
];

function preload() {
	loadJSON(GHIBLI_MOVIES_INFO, (data) => {
    let count = 0;
    for (const i in data) {
      if(count % 5 === 0) {
        moviePosters.push([]);
      }
      moviePosters[Math.floor(count / 5)].push(
        loadImage(data[i].poster_path)
      );
      count ++;
    }
    console.log(moviePosters)
	});
  frame = loadImage('./img/frame.png');
}

function setup() {
	createCanvas(canvas.width, canvas.height);
  let posterList = moviePosters[currentIndex];
  posterList.forEach((poster, index) => {
    console.log(poster)
    image(frame, posterPositions[index % 5].x - 30, posterPositions[index % 5].y - 270,  posterImage.width*1.5,  posterImage.height + 300) 
    image(poster, posterPositions[index % 5].x, posterPositions[index % 5].y, posterImage.width, posterImage.height);
  })
}

function draw() {
  // image(moviePosters, 0, 0, canvas.width, canvas.height);
}

const getImages = (ghibliMovies) => {
  let images = [];
  let count = 0;
  for (const item in ghibliMovies) {
    if(count % 5 === 0) {
      images.push([]);
    }
    images[Math.floor(count / 5)].push(ghibliMovies[item].poster_path);
    count ++;
  }
  return images;
}

function pressStringButton() {
  currentIndex = (currentIndex + 1) % 3;
  let posterList = moviePosters[currentIndex];
  posterList.forEach((poster, index) => {
    console.log(poster)
    image(frame, posterPositions[index % 5].x - 30, posterPositions[index % 5].y - 270,  posterImage.width*1.5,  posterImage.height + 300) 
    image(poster, posterPositions[index % 5].x, posterPositions[index % 5].y, posterImage.width, posterImage.height);
  })
}