const Product = require('../models/Product');

// @desc    Get all products (with searching, filtering, and sorting)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, brand, search, sort, minPrice, maxPrice } = req.query;
    let queryObj = {};

    // Filter by category
    if (category && category !== 'All') {
      queryObj.category = category;
    }

    // Filter by brand
    if (brand && brand !== 'All') {
      queryObj.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = Number(minPrice);
      if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // Search query mapping
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { grade: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Product.find(queryObj);

    // Sorting
    if (sort) {
      if (sort === 'price-asc') query = query.sort('price');
      else if (sort === 'price-desc') query = query.sort('-price');
      else if (sort === 'name-asc') query = query.sort('name');
      else if (sort === 'name-desc') query = query.sort('-name');
    } else {
      query = query.sort('name'); // Default sort alphabetically
    }

    const products = await query;
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found in catalogue');
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin Only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product successfully added to catalogue',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details or stocks (Admin Only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found');
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product parameters updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product from database (Admin Only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found');
    }

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Product removed from database',
    });
  } catch (error) {
    next(error);
  }
};
