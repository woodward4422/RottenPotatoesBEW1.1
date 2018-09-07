const express = require('express');
const methodOverride = require('method-override')
const app = express();
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rotten-potatoes', { useMongoClient: true });
const bodyParser = require('body-parser');


const Review = mongoose.model('Review', {
    title: String,
    description: String, 
    movieTitle: String
  });

app.use(methodOverride('_method'))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({ extended: true }));

  //Reviews route 
  app.get('/', (req, res) => {
   Review.find()
    .then(reviews => {
        res.render('reviews-index', { reviews: reviews});
    })
    .catch(err => {
        console.log(err)
    })
  });

  app.get('/reviews/new', (req, res) => {
    res.render('reviews-new', {});
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
   Review.findById(req.params.id).then((review) => {
        res.render('reviews-show', { review: review })
   }).catch((err) => {
       console.log(err.message);
   })
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

  app.get('/reviews/:id/edit', function (req, res) {
    Review.findById(req.params.id, function(err, review) {
      res.render('reviews-edit', {review: review});
    })
  })


  app.listen(3000, () => {
    console.log('App listening on port 3000!')
  });

 