const express = require('express');
const methodOverride = require('method-override')
const app = express();
var exphbs = require('express-handlebars');
const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb('fa1e604e4a94f038943c6e3cbfc8f18d')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rotten-potatoes', { useMongoClient: true });
const bodyParser = require('body-parser');
const Schema = mongoose.Schema

const Comment = mongoose.model('Comment', {
  title: String,
  content: String,
  reviewId: { type: Schema.Types.ObjectId, ref: 'Review' }
});

const Review = mongoose.model('Review', {
    title: String,
    description: String, 
    movieTitle: String,
    movieId:{ type: String, required: true }

  });

app.use(methodOverride('_method'))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({ extended: true }));

  //Reviews route 
  // app.get('/', (req, res) => {
  //  Review.find()
  //   .then(reviews => {
  //       res.render('reviews-index', { reviews: reviews});
  //   })
  //   .catch(err => {
  //       console.log(err)
  //   })
  // });

  app.get('/', (req, res) => {
    moviedb.miscNowPlayingMovies().then(response => {
      res.render('movies-index', { movies: response.results });
    }).catch(console.error)
  })

  app.get('/movies/:id', (req, res) => {
    moviedb.movieInfo({ id: req.params.id }).then(movie => {
      Review.find({ movieId: req.params.id }).then(reviews => {
        res.render('movies-show', { movie: movie, reviews: reviews });
      })
    }).catch(console.error)
  })
  


  app.get('/movies/:movieId/reviews/new', (req, res) => {
    res.render('reviews-new', {movieId: req.params.movieId});
  });

  app.post('/reviews', (req, res) => {
    Review.create(req.body).then((review) =>{
        console.log(review);
        res.redirect(`/reviews/${review._id}`)
    }).catch((err) => {
        console.log(err.message);
    })
  });

  app.get('/reviews/:id', (req, res) => {
    Review.findById(req.params.id).then(review => {
      Comment.find({ reviewId: req.params.id }).then(comments => {
        res.render('reviews-show', { review: review, comments: comments })
      })
    }).catch((err) => {
      console.log(err.message)
    });
  });

  app.put('/reviews/:id', (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body)
      .then(review => {
        res.redirect(`/reviews/${review._id}`)
      })
      .catch(err => {
        console.log(err.message)
      })
  })

  app.delete('/reviews/:id', function (req, res) {
    console.log("DELETE review")
    Review.findByIdAndRemove(req.params.id).then((review) => {
      res.redirect('/');
    }).catch((err) => {
      console.log(err.message);
    })
  })

  app.get('/reviews/:id/edit', function (req, res) {
    Review.findById(req.params.id, function(err, review) {
      res.render('reviews-edit', {review: review});
    })
  })


  app.post('/movies/:movieId/reviews', (req, res) => {
    console.log(req.body)
  })

  // app.post('/reviews/comments', function(req,res) {
  //   console.log("BEER!!!s")
  //   console.log(req.body)
  //   Comment.create(req.body).then(comment => {
  //     res.redirect(`/reviews/${comment.reviewId}`)
  //   }).catch((err) => {
  //     console.log(err.message)
  //   })
  // })

  app.delete('/reviews/comments/:id', function (req, res) {
    console.log("DELETE comment")
    Comment.findByIdAndRemove(req.params.id).then((comment) => {
      res.redirect(`/reviews/${comment.reviewId}`);
    }).catch((err) => {
      console.log(err.message);
    })
  })




  app.listen(3000, () => {
    console.log('App listening on port 3000!')
  });

 