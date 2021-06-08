'use strict'
const GHIBLI_MOVIES_INFO = './data/ghibli_movies_info.json';
var moviePosters = {};

let canvas = {
	width: window.innerWidth,
	height: window.innerHeight,
	moviePosters: null
}

function preload() {
	let ghibliMovieInfo = GHIBLI_MOVIES_INFO;
	loadJSON(ghibliMovieInfo, (data) => {
		moviePosters = getImages(data);
	});
}

function setup() {
	createCanvas(canvas.width, canvas.height);
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