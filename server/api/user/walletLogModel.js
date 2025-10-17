const mongoose = require("mongoose");

const walletLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sponsorId: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ["credit", "debit"], default: "credit" },
  walletBalance: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WalletLog", walletLogSchema);
