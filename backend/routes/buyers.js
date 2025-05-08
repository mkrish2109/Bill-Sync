const express = require('express');
const router = express.Router();
const Buyer = require('../models/Buyer');

router.post('/', async (req, res) => {
  const buyer = await Buyer.create(req.body);
  res.json(buyer);
});

router.get('/', async (req, res) => {
  const buyers = await Buyer.find();
  res.json(buyers);
});

module.exports = router;
