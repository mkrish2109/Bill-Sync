const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  type: {
    type: String,
    required: true,
    enum: [
      "request", // For payment requests
      "status_update", // For status changes
      "payment_success", // When payment is successful
      "payment_failed", // When payment fails
      "invoice_created", // When new invoice is generated
      "invoice_due", // When invoice is due
      "invoice_overdue", // When invoice is overdue
      "reminder", // For payment reminders
      "refund", // For refund notifications
      "system", // For system-wide notifications
    ],
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
