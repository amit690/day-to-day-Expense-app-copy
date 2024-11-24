const Razorpay = require('razorpay');
const crypto = require('crypto');


const User = require('../models/user');
const Payment = require('../models/Payment');


// Create a new Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to initiate payment
exports.purchasePremium = async (req, res) => {
    try {
        const amount = 49900; // Premium price in paisa (e.g., ₹499)

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount,
            currency: 'INR',
            receipt: 'premium_receipt_' + req.userId,
        });

        // Store order in the database
        await Payment.create({
            orderId: order.id,
            userId: req.userId,
            status: 'processing',
        });

        res.status(201).json({
            orderId: order.id,
            key_id: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};


// Route to verify payment
exports.verifyPayment = async (req, res) => {
    try {
        const { payment_id, order_id, signature } = req.body;

        // Generate the signature again and verify
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(order_id + '|' + payment_id)
            .digest('hex');

        if (generatedSignature !== signature) {
            // Update payment status to 'failure'
            await Payment.update(
                { status: 'failure' },
                { where: { orderId: order_id } }
            );
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        // Mark user as premium
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.premium = true;
        await user.save();

        // Update payment status to 'success'
        await Payment.update(
            { status: 'success' },
            { where: { orderId: order_id } }
        );

        res.status(200).json({ success: true, message: 'Payment verified and premium activated' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};

