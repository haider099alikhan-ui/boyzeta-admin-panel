const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with pagination and search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      boycott, 
      barcode, 
      sortBy = 'name', 
      sortOrder = 'asc' 
    } = req.query;

    // Build query
    let query = {};
    
    // Barcode search (highest priority)
    if (barcode) {
      query.barcodes = barcode;
    }
    // Text search
    else if (search) {
      query.$text = { $search: search };
    }
    
    // Boycott filter
    if (boycott !== undefined) {
      query.boycott = boycott === 'true';
    }

    // Build sort object
    let sort = {};
    if (sortBy === 'relevance' && search) {
      sort = { score: { $meta: 'textScore' } };
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Build pagination info
    const pagination = {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1
    };

    res.status(200).json({
      success: true,
      data: products,
      pagination,
      message: `Found ${products.length} products`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products by barcode
// @route   GET /api/products/search/barcode/:barcode
// @access  Public
const searchByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    
    const product = await Product.findByBarcode(barcode);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found for this barcode'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get boycott statistics
// @route   GET /api/products/stats
// @access  Public
const getStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$boycott',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalProducts = await Product.countDocuments();
    const boycottedProducts = stats.find(stat => stat._id === true)?.count || 0;
    const nonBoycottedProducts = stats.find(stat => stat._id === false)?.count || 0;

    res.status(200).json({
      success: true,
      data: {
        total: totalProducts,
        boycotted: boycottedProducts,
        nonBoycotted: nonBoycottedProducts,
        boycottPercentage: totalProducts > 0 ? ((boycottedProducts / totalProducts) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent products
// @route   GET /api/products/recent
// @access  Public
const getRecentProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.find()
      .sort({ lastUpdated: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: products,
      message: `Found ${products.length} recent products`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products with alternatives
// @route   GET /api/products/with-alternatives
// @access  Public
const getProductsWithAlternatives = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find({
      alternatives: { $exists: true, $ne: [], $size: { $gt: 0 } }
    })
      .sort({ lastUpdated: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments({
      alternatives: { $exists: true, $ne: [], $size: { $gt: 0 } }
    });

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      message: `Found ${products.length} products with alternatives`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchByBarcode,
  getStats,
  getRecentProducts,
  getProductsWithAlternatives
};
