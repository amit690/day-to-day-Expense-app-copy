const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/premium', authenticate, purchaseController.purchasePremium);
router.post('/verify', authenticate, purchaseController.verifyPayment);

module.exports = router;
