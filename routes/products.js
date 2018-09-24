const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Products');
const Order = require('../models/Order');


router.get('/', ensureAuthenticated, function (req, res){
    Product.find({})
    .then(products =>{
        res.render('products/index', {
            products:products
        });
    });
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/products');
    });
   
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/products/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/products/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('products/shopping-cart', {products: null});
   } 
    var cart = new Cart(req.session.cart);
    res.render('products/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty});
});

router.get('/checkout', ensureAuthenticated, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('products/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('products/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
    // res.render('products/checkout', {total: cart.totalPrice, totalQ: cart.totalQty, errMsg: errMsg, noError: !errMsg});
});

router.post('/', ensureAuthenticated, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('products/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    
    var stripe = require("stripe")(
        "sk_test_fwmVPdJfpkmwlQRedXec5IxR"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('products/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    }); 
    // res.send('hey');
    
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;