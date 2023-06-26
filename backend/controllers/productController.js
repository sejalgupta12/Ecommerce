const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeature = require("../utils/apiFeatures");
const cloudinary = require("cloudinary").v2;

// Create Product -- Admin

exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imageLink = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });

    imageLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imageLink;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

// Get All products

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query.clone();
  res.status(200).json({
    status: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Update product -- Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let images = [];
  if (typeof req.body.images == "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images != undefined) {
    const imageLink = [];
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imageLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imageLink;
    req.body.user = req.user.id;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete product -- Admin

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  //deleting images from cloudinary

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Create new review or update review

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  let product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  console.log("isReviewed==========", isReviewed, product, req.body);
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    console.log("review==========", review);
    product.reviews.push(review);
    product.noOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.ratings = product.reviews.length
    ? product.reviews.map((rev) => {
        return (avg += rev.rating);
      }) / product.reviews.length
    : 0;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All reviews

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found"), 400);
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found"), 400);
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  const ratings = reviews.length
    ? reviews.map((rev) => {
        return (avg += rev.rating);
      }) / reviews.length
    : 0;
  const noOfReviews = reviews.length;

  console.log("ratings", ratings, reviews, noOfReviews);
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      noOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

//Get all products -- (admin)

exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});
