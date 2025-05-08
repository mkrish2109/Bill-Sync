const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

router.post('/', async (req, res) => {
  const { type, paymentDueInDays } = req.body;

  const paymentDueDate =
    type === 'delivered' && paymentDueInDays
      ? new Date(Date.now() + paymentDueInDays * 24 * 60 * 60 * 1000)
      : null;

  const bill = await Bill.create({ ...req.body, paymentDueDate });
  res.json(bill);
});

router.get('/', async (req, res) => {
  const bills = await Bill.find().populate('buyerId workerId');
  res.json(bills);
});

router.patch('/:id/pay', async (req, res) => {
  const bill = await Bill.findByIdAndUpdate(
    req.params.id,
    { paymentStatus: 'paid' },
    { new: true }
  );
  res.json(bill);
});

module.exports = router;
