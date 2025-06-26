const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    coins: [{
        coinId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        purchasePrice: {
            type: Number,
            required: true
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;