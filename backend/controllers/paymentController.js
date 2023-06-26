const catchAsyncError = require("../middleware/catchAsyncError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res.status(200).json({
    client_secret: paymentIntent.client_secret,
  });
});

exports.sendStripeApiKey = (req, res, next) => {
  res.status(200).json({
    apiKey: process.env.STRIPE_API_KEY,
  });
};
