const ratingModel = require("../models/ratingModel");
const itemModel = require("../models/itemModel");
const customerModel = require("../models/customerModel");


// ADD OR UPDATE A RATING FOR A PRODUCT
async function addRating(req, res) {
    try {
      const { productId, customerId, name, rating, comment } = req.body;
  
      // Check if the product and customer exist
      const product = await itemModel.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }
      
      const customer = await customerModel.findOne({customerId});
  
      if (!customer) {
        return res.status(404).json({ error: "Customer not found." });
      }
  
      // Check if the customer has already rated the product
      const existingRating = product.ratings.find(
        (rating) => rating.customerId.toString() === customerId
      );
  
      if (existingRating) {
        // Update the existing rating
        existingRating.name = name;
        existingRating.rating = rating;
        existingRating.comment = comment;
        existingRating.time = new Date().toLocaleString();
      } else {
        // Add a new rating
        let time = new Date().toLocaleString();
        product.ratings.push({ customerId, name, rating, comment, time });
      }
  
      // Calculate the new average rating and total rating counts
      const ratings = product.ratings;
      const totalRatingCount = ratings.length;
      const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = totalRatingCount > 0 ? sumRatings / totalRatingCount : 0;
  
      // Update the averageRating and totalRatingCount fields in the product
      product.averageRating = averageRating;
      product.totalRatingCount = totalRatingCount;
  
      // Count the number of customers who gave ratings of 5, 4, 3, 2, and 1
      // const ratingCounts = {
      //   5: 0,
      //   4: 0,
      //   3: 0,
      //   2: 0,
      //   1: 0,
      // };
  
      // ratings.forEach((rating) => {
      //   if (rating.rating in ratingCounts) {
      //     ratingCounts[rating.rating]++;
      //   }
      // });
  
      // Update the ratingCounts field in the product
      // product.ratingCounts = ratingCounts;
  
      // Calculate the percentage of customers who gave ratings of 5, 4, 3, 2, and 1
      const ratingPercentages = {};
  
      for (let i = 1; i <= 5; i++) {
        const ratingCount = ratings.filter((rating) => rating.rating === i).length;
        const percentage = (ratingCount / totalRatingCount) * 100 || 0;
        ratingPercentages[i] = percentage;
      }
  
      // Update the ratingPercentages field in the product
      product.ratingPercentages = ratingPercentages;
  
      // Save the product
      await product.save();
  
      return res.status(200).json(product);
    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };
        logger.error(`Error in addRating API: ${error.message}`, { meta: metadata });
        return res.status(500).json({ error: "Failed to add rating." });
    }
  }
  
  
  // GET ALL RATINGS
  const getAllRatings = async (req, res) => {
    try {
      let productId = req.params.productId;
      let ratings = await ratingModel.find({ productId });
  
      let averageRating;
      let ratingSum = 0;
      let totalRatingCount;
      for (let i = 0; i < ratings.length; i++) {
        ratingSum += ratings[i].rating;
      }
      averageRating = ratingSum / ratings.length;
      totalRatingCount = ratings.length;
      return res
        .status(200)
        .send({
          status: true,
          data: ratings,
          averageRating: averageRating,
          totalRatingCount: totalRatingCount,
        });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
  
  // GET ALL PRODUCTS WITH RATING
  const getAllProductsWithRating = async (req, res) => {
    try {
      let { productId, ratingId }= req.params;
  
      let products = await itemModel.find().populate("ratingId");
      return res.status(200).send({ status: true, data: products });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
  
  module.exports = { addRating, getAllRatings, getAllProductsWithRating };