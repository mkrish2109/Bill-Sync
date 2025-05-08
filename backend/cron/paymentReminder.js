const cron = require('node-cron');
const Bill = require('../models/Bill');

module.exports = () => {
  cron.schedule('0 9 * * *', async () => {
    const dueBills = await Bill.find({
      type: 'delivered',
      paymentStatus: 'pending',
      notified: false,
      paymentDueDate: { $lte: new Date() }
    });

    dueBills.forEach(async bill => {
      console.log(`Reminder: Payment due for bill ID ${bill._id}`);
      bill.notified = true;
      await bill.save();
    });
  });
};
