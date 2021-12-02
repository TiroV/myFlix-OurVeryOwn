const express = require('express');
  morgan = require('morgan');
const app = express();

app.use(morgan('common'));

//Function for the movie list!
let topTenMovies = [
  {
    title: 'Akira',
    director: 'Katsuhiro Otomo'
  },
  {
    title: 'Ponyo',
    author: 'Hyao Miyazaki'
  },
  {
    title: 'Penguin Highway',
    director: 'Hiroyasu Ishida'
  },
  {
    title: 'Blade Runner',
    director: 'Ridley Scott'
  },
  {
    title: 'Shang-Chi and the Legend of the Ten Rings',
    director: 'Destin Daniel Cretton'
  },
  {
    title: 'Dune',
    director: 'Denis Villeneuve'
  },
  {
    title: 'The Secret of NIMH',
    director: 'Don Bluth'
  },
  {
    title: 'Tokyo Godfathers',
    director: 'Satoshi Kon'
  },
  {
    title: 'Coco',
    director: 'Lee Unkrich'
  },
  {
    title: 'Ender\'s Game',
    director: 'Gavin Hood'
  },

];

// GET requests
//The front page of the server.
app.get('/', (req, res) => {
  res.send('Soon to be a wonderful repository of amazing movies. Stay tuned!');

});
//The location that shows the documentation on what the website will be.
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
  //Validating through console that the pull was sucessful.
    
});
//The directory that calls for the function to pull the topTenMovies function.
app.get('/movies', (req, res) => {
  res.json(topTenMovies);

});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
