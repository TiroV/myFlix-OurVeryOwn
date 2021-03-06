const express = require('express');
morgan = require('morgan');
const app = express();


app.use(morgan('common'));

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

//Original Mongoose connect line, for local. Comment out when being unused!
//mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

//New mongoose connect, for server connecting. Comment out when being unused! Currently in use.
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For using the cors package
let allowedOrigins = ['http:://localhost:8080', 'http://localhost:1234', 'http://testsite.com', 'http://localhost:4200', 'https://tirov.github.io', 'https://our-very-own.herokuapp.com/'];

/**
 * Cors package
 * @constant
 * @type {object}
 * @default
 */
const cors = require('cors');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn't found on the list of allowed origins
      let message = 'the CORS policy for this application does not allow all access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

// Requires passport module and imports passport.js
const passport = require('passport');
require('./passport');


// GET requests. The endpoints.


/**
 * Redirects user to index.html
 * /index endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */

app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Soon to be a wonderful repository of amazing movies. Stay tuned!');

});

/**
 * Gets the user documentation
 * /documentation endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get('/documentation', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
  //Validating through console that the pull was sucessful.

});
/**
 * Returns a list of all movies
 * /movies endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});


/**
 * Returns a specific movie by name
 * /movies/:title endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * Returns a list of genres
 * /genres endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Returns list of genres.');

});

/**
 * Returns a specific genre by name
 * /genres endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * Returns a list of directors
 * /directors endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Returns a list of directors.');

});

/**
 * Returns a director by name
 * /genres/:name endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * Returns a list of users
 * /users endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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
/* We???ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

/**
 * Creates a new user
 * /users endpoint
 * method: post
 * @param { express.request } req
 * @param { express.response } res
 */
app.post('/users',


  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//To allow users to update their user info, by specific username
/* We???ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

/**
 * Updates the information of a specific user
 * /users/:Username endpoint
 * method: put
 * @param { express.request } req
 * @param { express.response } res
 */

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
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



/**
 * Adds a movie to a user's favorites
 * /users/:Username/movies/:MovieID endpoint
 * method: post
 * @param { express.request } req
 * @param { express.response } res
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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


/**
 * Deletes a movie from the user's favorites
 * /users/:Username/movies/:MovieID endpoint
 * method: delete
 * @param { express.request } req
 * @param { express.response } res
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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



/**
 * Deletes a specific user
 * /users/:Username endpoint
 * method: delete
 * @param { express.request } req
 * @param { express.response } res
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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



/**
 * Gets a specific user by name
 * /users/:Username endpoint
 * method: get
 * @param { express.request } req
 * @param { express.response } res
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on port 8080.');
});
