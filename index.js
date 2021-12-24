const express = require('express');
  morgan = require('morgan');
const app = express();

app.use(morgan('common'));

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));








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
    director: 'Hyao Miyazaki',
    genre: 'Cyberpunk',
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
//Calls list of movies.
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
    });

//The specific title of a movie.
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title })
        .then((movie) => {
          res.json(movie);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err);
        });
    }
  );

//A list of genres
app.get('/genres', (req, res) => {
  res.send('Returns list of genres.');

});

//The specific name of a genre
app.get('/genres/:name', (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.name })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//A search for directors
app.get('/directors', (req, res) => {
  res.send('Returns a list of directors.');

});
//For specific directors
app.get('/directors/:name', (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);


//USER INFO HERE ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });

});
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//To allow users to update their usern info, by specific username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});



// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


//To allow users to update their usernames
app.delete('/users/:Username/:movies/:movieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // ensures that the updated document is returned
  (err, removeFavorite) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(removeFavorite);
    }
  });
});



// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });


//END OF USER INFO ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
});





// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
