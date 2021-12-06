const express = require('express');
  morgan = require('morgan');
const app = express();

app.use(morgan('common'));

//Function for the movie list!
let topTenMovies = [
  {
    title: 'Akira',
    released: '1990',
    genre: 'Cyberpunk',
    director: {
      name: 'Katsuhiro Otomo',
      born: '1954',
      died: 'n/a',
      bio: 'ゴゴゴゴ'
    }


  },
  {
    title: 'Ponyo',
    director: 'Hyao Miyazaki'
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

// GET requests. The endpoints.
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

//The specific title of a movie.
app.get('/movies/:title', (req, res) => {
  res.send('Returns movie title.');

});

//A list of genres
app.get('/genres', (req, res) => {
  res.send('Returns list of genres.');

});

//The specific name of a genre
app.get('/genres/:genre', (req, res) => {
  res.send('Returns a specific movie by name.');

});

//A search for directors
app.get('/directors', (req, res) => {
  res.send('Returns a list of directors.');

});
//For specific directors
app.get('/directors/:name', (req, res) => {
  res.send('Returns specific directors by name.');

});
//USER INFO HERE ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
//Get all users
app.get('/users', (req, res) => {
  res.send('Returns all users.');


});
//Allows users to register
app.post('/users/:register', (req, res) => {
  res.send('Account is now registered');


});
//To allow users to update their usernames
app.put('/users/:update', (req, res) => {
  res.send('Allows users to update their information.');


});
//To allow users to add a movie to the list
app.post('/users/:movies/:addMovie', (req, res) => {
  res.send('Movie Added!');


});
//To allow users to update their usernames
app.delete('/users/:movies/:removeMovie', (req, res) => {
  res.send('Movie Removed!');


});
//To allow users to delete their account
app.delete('/users/:userDelete', (req, res) => {
  res.send('Account Deleted.');


});
//Get a specific user's name
app.get('/users/:username', (req, res) => {
  res.send('Return a specific user name.');

//END OF USER INFO ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
});





// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
