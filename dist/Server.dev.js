"use strict";

var express = require('express');

require('./db/config');

var Users = require('./db/Users');

var Product = require('./db/Product');

var cors = require("cors");

var app = express();
app.use(express.json());
app.use(cors()); // const connectDB = async () =>{
//     mongoose.connect('mongodb://localhost:27017/e-comm');
//     const productSchema = new mongoose.Schema({});
//     const product = mongoose.model('users',productSchema);
//     const data = await product.find();
//     console.log("data",data)
// }
// connectDB();

app.post('/register', function _callee(req, res) {
  var user, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = new Users(req.body);
          _context.next = 3;
          return regeneratorRuntime.awrap(user.save());

        case 3:
          result = _context.sent;
          result = result.toObject();
          delete result.password;
          console.warn(result);
          res.send(result);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.post('/login', function _callee2(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(req.body.email && req.body.password)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(Users.findOne(req.body).select("-password"));

        case 3:
          user = _context2.sent;

          if (user) {
            res.send(user);
          } else {
            res.send("user not found");
          }

          _context2.next = 8;
          break;

        case 7:
          res.send("user not found");

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.post('/add-product', function _callee3(req, res) {
  var product, result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          product = new Product(req.body);
          _context3.next = 3;
          return regeneratorRuntime.awrap(product.save());

        case 3:
          result = _context3.sent;
          console.log(result);
          res.send(result);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
app.get('/products', function _callee4(req, res) {
  var Products;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Product.find());

        case 2:
          Products = _context4.sent;

          if (Products.length > 0) {
            res.send(Products);
          } else {
            response.send({
              result: "no data found"
            });
          }

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
});
app["delete"]('/product/:id', function _callee5(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Product.deleteOne({
            _id: req.params.id
          }));

        case 2:
          result = _context5.sent;
          res.send(result); // res.send("hiii")

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});
app.get('/product/:id', function _callee6(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Product.findOne({
            _id: req.params.id
          }));

        case 2:
          result = _context6.sent;

          if (result) {
            res.send(result);
          } else {
            res.send({
              result: "No records found"
            });
          }

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
});
app.put('/product/:id', function _callee7(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: req.params.id
          }, {
            $set: req.body
          }));

        case 2:
          result = _context7.sent;
          res.send(result);

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
});
app.get('/search/:key', function _callee8(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Product.find({
            "$or": [{
              name: {
                $regex: req.params.key
              }
            }, {
              comapny: {
                $regex: req.params.key
              }
            }, {
              price: {
                $regex: req.params.key
              }
            }, {
              category: {
                $regex: req.params.key
              }
            }]
          }));

        case 2:
          result = _context8.sent;
          res.send(result);

        case 4:
        case "end":
          return _context8.stop();
      }
    }
  });
});
app.listen(8080);