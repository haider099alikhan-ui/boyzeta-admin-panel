const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, requirePermission } = require('../middlewares/auth');

// @route   POST /api/bulk-upload
// @desc    Upload CSV file and import companies
// @access  Private (requires bulk upload permission)
router.post('/', protect, requirePermission('canBulkUpload'), async (req, res) => {
  try {
    const { companies } = req.body;
    
    if (!companies || !Array.isArray(companies)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected array of companies.'
      });
    }
    
    const results = [];
    const errors = [];
    const barcodeConflicts = [];
    
    // First pass: validate all data and check for barcode conflicts
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      
      try {
        // Validate required fields
        if (!company.name || typeof company.boycott !== 'boolean' || !company.reason) {
          errors.push({
            row: i + 1,
            error: 'Missing required fields: name, boycott, reason'
          });
          continue;
        }
        
        // Validate barcode format if provided
        if (company.barcodes && Array.isArray(company.barcodes)) {
          for (const barcode of company.barcodes) {
            if (!/^\d{8,14}$/.test(barcode)) {
              errors.push({
                row: i + 1,
                error: `Invalid barcode format: ${barcode}. Must be 8-14 digits.`
              });
            }
          }
        }
        
        // Check for barcode conflicts with existing companies
        if (company.barcodes && company.barcodes.length > 0) {
          const existingBarcodes = await Product.find({
            barcodes: { $in: company.barcodes }
          });
          
          if (existingBarcodes.length > 0) {
            const conflicts = existingBarcodes.map(existing => ({
              company: existing.name,
              barcodes: existing.barcodes.filter(barcode => company.barcodes.includes(barcode))
            }));
            
            barcodeConflicts.push({
              row: i + 1,
              company: company.name,
              conflicts
            });
          }
        }
        
      } catch (error) {
        errors.push({
          row: i + 1,
          error: error.message
        });
      }
    }
    
    // If there are validation errors or barcode conflicts, return them
    if (errors.length > 0 || barcodeConflicts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please fix the errors before uploading.',
        errors,
        barcodeConflicts,
        summary: {
          total: companies.length,
          successful: 0,
          failed: errors.length + barcodeConflicts.length
        }
      });
    }
    
    // Second pass: process valid companies
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      
      try {
        // Check if company already exists
        const existingCompany = await Product.findOne({ name: company.name });
        
        if (existingCompany) {
          // Update existing company with new barcodes
          const newBarcodes = company.barcodes || [];
          const existingBarcodes = existingCompany.barcodes || [];
          
          // Add new barcodes that don't already exist
          const uniqueNewBarcodes = newBarcodes.filter(barcode => !existingBarcodes.includes(barcode));
          
          if (uniqueNewBarcodes.length > 0) {
            existingCompany.barcodes = [...existingBarcodes, ...uniqueNewBarcodes];
            existingCompany.lastUpdated = new Date();
            await existingCompany.save();
            
            results.push({
              row: i + 1,
              success: true,
              company: existingCompany.name,
              action: 'updated',
              newBarcodes: uniqueNewBarcodes
            });
          } else {
            results.push({
              row: i + 1,
              success: true,
              company: existingCompany.name,
              action: 'no_changes',
              message: 'Company already exists with all barcodes'
            });
          }
        } else {
          // Create new company
          const newCompany = new Product({
            name: company.name.trim(),
            boycott: company.boycott,
            reason: company.reason.trim(),
            country: company.country || 'GLOBAL',
            alternatives: company.alternatives || [],
            barcodes: company.barcodes || [],
            proofUrls: company.proofUrls || []
          });
          
          await newCompany.save();
          
          results.push({
            row: i + 1,
            success: true,
            company: newCompany.name,
            action: 'created'
          });
        }
        
      } catch (error) {
        errors.push({
          row: i + 1,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      message: `Import completed. ${results.length} companies processed successfully.`,
      results,
      errors,
      barcodeConflicts,
      summary: {
        total: companies.length,
        successful: results.length,
        failed: errors.length
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk upload',
      error: error.message
    });
  }
});

module.exports = router;
