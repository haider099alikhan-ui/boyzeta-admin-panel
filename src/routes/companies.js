const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, requirePermission } = require('../middlewares/auth');

// @route   GET /api/companies
// @desc    Get all companies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    let query = {};
    if (search) {
      // Enhanced search by company name, barcode, reason, alternatives, country, and boycott status
      const searchRegex = { $regex: search, $options: 'i' };
      const boycottSearch = search.toLowerCase() === 'boycott' ? true : 
                           search.toLowerCase() === 'safe' ? false : null;
      
      query.$or = [
        { name: searchRegex },
        { barcodes: searchRegex },
        { reason: searchRegex },
        { country: searchRegex },
        { 'alternatives.name': searchRegex },
        { 'alternatives.countryCode': searchRegex },
        { 'alternatives.description': searchRegex }
      ];
      
      // Add boycott status search if applicable
      if (boycottSearch !== null) {
        query.$or.push({ boycott: boycottSearch });
      }
    }
    
    const companies = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: companies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      },
      message: `Found ${companies.length} companies`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Product.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/companies
// @desc    Create a new company
// @access  Private (requires create permission)
router.post('/', protect, requirePermission('canCreateCompanies'), async (req, res) => {
  try {
    const { name, boycott, reason, country, alternatives, barcodes, proofUrls } = req.body;
    
    // Check for barcode conflicts
    if (barcodes && barcodes.length > 0) {
      const existingBarcodes = await Product.find({
        barcodes: { $in: barcodes }
      });
      
      if (existingBarcodes.length > 0) {
        const conflictingBarcodes = existingBarcodes.map(company => ({
          company: company.name,
          barcodes: company.barcodes.filter(barcode => barcodes.includes(barcode))
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Some barcodes are already assigned to other companies',
          conflicts: conflictingBarcodes
        });
      }
    }
    
    const company = new Product({
      name,
      boycott,
      reason,
      country: country || 'GLOBAL',
      alternatives: alternatives || [],
      barcodes: barcodes || [],
      proofUrls: proofUrls || []
    });
    
    await company.save();
    
    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create company',
      error: error.message
    });
  }
});

// @route   PUT /api/companies/:id
// @desc    Update a company
// @access  Private (requires edit permission)
router.put('/:id', protect, requirePermission('canEditCompanies'), async (req, res) => {
  try {
    const { name, boycott, reason, country, alternatives, barcodes, proofUrls } = req.body;
    
    // Check for barcode conflicts (excluding current company)
    if (barcodes && barcodes.length > 0) {
      const existingBarcodes = await Product.find({
        _id: { $ne: req.params.id },
        barcodes: { $in: barcodes }
      });
      
      if (existingBarcodes.length > 0) {
        const conflictingBarcodes = existingBarcodes.map(company => ({
          company: company.name,
          barcodes: company.barcodes.filter(barcode => barcodes.includes(barcode))
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Some barcodes are already assigned to other companies',
          conflicts: conflictingBarcodes
        });
      }
    }
    
    const company = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        boycott,
        reason,
        country: country || 'GLOBAL',
        alternatives: alternatives || [],
        barcodes: barcodes || [],
        proofUrls: proofUrls || [],
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update company',
      error: error.message
    });
  }
});

// @route   DELETE /api/companies/:id
// @desc    Delete a company
// @access  Private (requires delete permission)
router.delete('/:id', protect, requirePermission('canDeleteCompanies'), async (req, res) => {
  try {
    const company = await Product.findByIdAndDelete(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete company',
      error: error.message
    });
  }
});

// @route   GET /api/companies/barcode/:barcode
// @desc    Find company by barcode
// @access  Public
router.get('/barcode/:barcode', async (req, res) => {
  try {
    const company = await Product.findOne({
      barcodes: req.params.barcode
    });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'No company found with this barcode'
      });
    }
    
    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
