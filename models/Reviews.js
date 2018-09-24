const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReviewsSchema = new Schema({
reviewName:{
  type: String,
  required: true
},
reviewDesc:{
  type: String,
  required: true
},
imageName:{
  type: String,
  required: true
},
reviewReview:{
  type: String,
  required: true
},
DomID:{
  type: Number,
  unique : true,
  required: false
},
date: {
  type: Date,
  default: Date.now
}
});

mongoose.model('reviews', ReviewsSchema);