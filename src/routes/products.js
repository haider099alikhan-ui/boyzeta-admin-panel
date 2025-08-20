const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchByBarcode,
  getStats,
  getRecentProducts,
  getProductsWithAlternatives
} = require('../controllers/productController');

const {
  validateProduct,
  validateUpdateProduct,
  validateQuery,
  validateId
} = require('../middlewares/validation');

const adminAuth = require('../middlewares/adminAuth');

// @route   POST /api/products
// @desc    Create a new product
// @access  Admin only
router.post('/', adminAuth, validateProduct, createProduct);

// @route   GET /api/products
// @desc    Get all products with pagination and search
// @access  Public
router.get('/', validateQuery, getProducts);

// @route   GET /api/products/stats
// @desc    Get boycott statistics
// @access  Public
router.get('/stats', getStats);

// @route   GET /api/products/recent
// @desc    Get recent products
// @access  Public
router.get('/recent', getRecentProducts);

// @route   GET /api/products/with-alternatives
// @desc    Get products with alternatives
// @access  Public
router.get('/with-alternatives', getProductsWithAlternatives);

// @route   GET /api/products/search/barcode/:barcode
// @desc    Search products by barcode
// @access  Public
router.get('/search/barcode/:barcode', searchByBarcode);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', validateId, getProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin only
router.put('/:id', adminAuth, validateId, validateUpdateProduct, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin only
router.delete('/:id', adminAuth, validateId, deleteProduct);

module.exports = router;
