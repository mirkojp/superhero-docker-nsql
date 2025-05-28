const mongoose = require('mongoose');


const superheroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  realName: { type: String},
  house: { type: String, required: true },
  biography: { type: String, required: true },
  abilities: [{ type: String }],
  images: {
    type: [{
      data: Buffer,
      contentType: String
    }],
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length >= 1 && v.length <= 5;
      },
      message: 'Images must be between 1 and 5'
    }
  },
  yearOfFirstAppearance: { type: Number, required: true }
});


const Superhero = mongoose.model('Superhero', superheroSchema, 'superheroes');

module.exports = Superhero;