const Product = require("./productModel")
const User = require("../user/userModel")
const companyController = require("../company/companyController")


const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description });
    await product.save();
    res.json({
      status:201,
      success: true, 
      message:"user is create successfully",
      product });
  } catch (err) {
    res.json({
      status:500,
      success:false,
      message:"internal server error",
      error:err.message
    })
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      status:200,
      success: true,
      message:"all product get successfully",
      products 
    });
  } catch (err) {
    res.json({
      status:500,
      success:false,
      message:"internal server error",
      error:err.message
    })
  }
};



// Add product purchase for a user
const purchaseProduct = async (req, res) => {
  try {
    const { sponsorId, productId } = req.body;

    const user = await User.findOne({ sponsorId });
    if (!user) return res.json({
      status:401,
      success:false,
       message: "User not found"
       });

    const product = await Product.findById(productId);
    if (!product) return res.json({ 
      status:404,
      success:false,
      message: "Product not found" 
    });

    // Add to user's purchases
    user.purchases.push({
      productId: product._id,
      productName: product.name,
      price: product.price,
    });
    await user.save();

    // Record sale in company
    await companyController.addProductSale(`${user.name} (${user._id})`, product.price);

    res.json({
      status:200,
      success: true,
      message: "Product purchased successfully. (No commission applied)",
      purchases: user.purchases,
    });
  } catch (err) {
   res.json({
      status:500,
      success:false,
      message:"internal server error",
      error:err.message
    })
  }
};

module.exports = { createProduct, getProducts, purchaseProduct };