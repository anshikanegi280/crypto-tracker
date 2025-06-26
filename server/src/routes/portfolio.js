const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Route to get the user's portfolio
router.get('/', portfolioController.getPortfolio);

// Route to add a coin to the user's portfolio (POST to /api/portfolio/add)
router.post('/add', portfolioController.addCoinToPortfolio);

// Route to add a coin directly to portfolio (POST to /api/portfolio)
router.post('/', portfolioController.addCoinToPortfolio);

// Route to remove a coin from the user's portfolio
router.delete('/remove/:coinId', portfolioController.removeCoinFromPortfolio);

// Route to get portfolio summary with current values
router.get('/summary', portfolioController.getPortfolio);

module.exports = router;