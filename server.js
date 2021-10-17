require('dotenv').config();
// const morgan = require("morgan");

const mongoose = require('mongoose');
// this is for errors after a connection has been established
mongoose.connection.on('error', (err) => {
  console.log(err);
});

const {
  PORT = 3000,
  MONGODB_URI_CARS = 'mongodb://localhost/cars', //<-- implicit db creation
  MONGODB_URI_PIZZAS = 'mongodb://localhost/pizzas', //<-- implicit db creation
} = process.env;

// (async () => {
//   try {
//     let conn = await mongoose.createConnection(MONGODB_URI);
//     let conn2 = await mongoose.createConnection(MONGODB_URI2);
//     // console.log("connected", conn);
//     // this is for errors after a connection has been established
//     mongoose.connection.on('error', (err) => {
//       console.log(err);
//     });
//   } catch (error) {
//     // this is for connection error
//     console.log(error);
//   }
// })();

//CREATE MULTIPLE DATABASES

function getConnection(uri) {
  try {
    return mongoose.createConnection(uri);
  } catch (error) {
    // this is for connection error
    console.log(error);
  }
}

const Schema = mongoose.Schema;

const conn = getConnection(MONGODB_URI_CARS);
const carSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bhp: {
    type: Number,
    required: true,
  },
  avatar_url: {
    type: String,
    default: 'https://static.thenounproject.com/png/449586-200.png',
  },
});

const Car = conn.model('Car', carSchema);

//PIZZA SCHEMA
const conn2 = getConnection(MONGODB_URI_PIZZAS);
const pizzaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  toppings: {
    type: String,
    required: true,
  },
});

const Pizza = conn2.model('Pizza', pizzaSchema);

const express = require('express');

const app = express();

// app.use(morgan('combined'));

app.use(express.static('public'));

app.use(express.json());

// app.use(function(req, res, next)
//   console.log('middleware');
//   next();
// })

//CRUD FUNCTION FOR CARS

app.get('/api/v1/cars', (req, res) => {
  Car.find({}).exec((err, cars) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(cars);
  });
});

app.post('/api/v1/cars', (req, res) => {
  console.log(req.body);
  const car = new Car(req.body);
  car.save((err, newCar) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(newCar);
  });
});

app.put('/api/v1/cars/:id', (req, res) => {
  Car.updateOne({ _id: req.params.id }, req.body, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.delete('/api/v1/cars/:id', (req, res) => {
  Car.remove({ _id: req.params.id }, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

//CRUD FUNCTIONS FOR PIZZAS

//Get all
app.get('/api/v1/pizzas', (req, res) => {
  Pizza.find({}).exec((err, pizzas) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(pizzas);
  });
});

//Get by id
app.get('/api/v1/pizzas/:id', (req, res) => {
  Pizza.findById({ _id: req.params.id }, (err, pizza) => {
    if (err) return res.status(404).send(err);
    res.status(200).json(pizza);
  });
});

//Get with condition
app.get('/api/v1/pizzasLarge', (req, res) => { 
Pizza.find({ size: { $gte: 15} }, (err, pizzas) => {
    if (err) return res.status(404).send(err);
    res.status(200).json(pizzas);
  });
});

// Test using query parameter

// app.get('/api/v1/pizzaSize', (req, res) => {
//   let size = 0;
//   if (req.query.size) {
//     size = req.query.size;
//   }

//   Pizza.find({ size: { $gt: size } }, (err, pizza) => {
//     if (err) return res.status(404).send(err);
//     res.status(200).json(pizza);
//   });
// });

//Create
app.post('/api/v1/pizzas', (req, res) => {
  console.log(req.body);
  const pizza = new Pizza(req.body);
  pizza.save((err, newPizza) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(newPizza);
  });
});

//Update
app.put('/api/v1/pizzas/:id', (req, res) => {
  Pizza.updateOne({ _id: req.params.id }, req.body, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

//Add
app.delete('/api/v1/pizzas/:id', (req, res) => {
  Pizza.remove({ _id: req.params.id }, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
