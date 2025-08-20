const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    index: true // Index for fast name searches
  },
  boycott: {
    type: Boolean,
    required: [true, 'Boycott status is required'],
    index: true // Index for filtering by boycott status
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [1000, 'Reason cannot exceed 1000 characters']
  },
  country: {
    type: String,
    trim: true,
    enum: ['GLOBAL', 'IN', 'PK', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'EE', 'LV', 'LT', 'MT', 'CY', 'LU', 'IE', 'PT', 'GR', 'JP', 'KR', 'CN', 'SG', 'MY', 'TH', 'VN', 'ID', 'PH', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'GY', 'SR', 'GF', 'FK', 'AI', 'BM', 'VG', 'KY', 'TC', 'MS', 'AG', 'DM', 'LC', 'VC', 'BB', 'GD', 'TT', 'JM', 'HT', 'DO', 'PR', 'CU', 'BS', 'AW', 'CW', 'SX', 'BQ', 'MF', 'BL', 'GP', 'MQ', 'RE', 'YT', 'NC', 'PF', 'WF', 'TK', 'NU', 'CK', 'WS', 'TO', 'FJ', 'VU', 'NC', 'SB', 'KI', 'TV', 'NR', 'PW', 'MH', 'FM', 'PG', 'BN', 'KH', 'LA', 'MM', 'BD', 'LK', 'NP', 'BT', 'MV', 'YE', 'OM', 'AE', 'QA', 'BH', 'KW', 'JO', 'LB', 'SY', 'IQ', 'IR', 'AF', 'TJ', 'UZ', 'TM', 'KG', 'KZ', 'MN', 'GE', 'AM', 'AZ', 'BY', 'MD', 'UA', 'RS', 'ME', 'AL', 'MK', 'XK', 'BA', 'AD', 'MC', 'LI', 'SM', 'VA', 'MT', 'IS', 'FO', 'GL', 'AX', 'GI', 'JE', 'GG', 'IM', 'IO', 'SH', 'AC', 'TA', 'BV', 'GS', 'TF', 'HM', 'AQ', 'EH', 'SS', 'SD', 'TD', 'CF', 'CM', 'GQ', 'GA', 'CG', 'CD', 'AO', 'ZM', 'ZW', 'BW', 'NA', 'SZ', 'LS', 'MG', 'MU', 'SC', 'KM', 'YT', 'RE', 'DJ', 'SO', 'ET', 'ER', 'KE', 'TZ', 'UG', 'RW', 'BI', 'MW', 'MZ', 'ZW', 'AO', 'NA', 'BW', 'ZA', 'SZ', 'LS', 'MG', 'MU', 'SC', 'KM', 'YT', 'RE', 'DJ', 'SO', 'ET', 'ER', 'KE', 'TZ', 'UG', 'RW', 'BI', 'MW', 'MZ'],
    default: 'GLOBAL',
    index: true
  },
  alternatives: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Alternative name cannot exceed 200 characters']
    },
    countryCode: {
      type: String,
      required: true,
      enum: ['GLOBAL', 'IN', 'PK', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'EE', 'LV', 'LT', 'MT', 'CY', 'LU', 'IE', 'PT', 'GR', 'JP', 'KR', 'CN', 'SG', 'MY', 'TH', 'VN', 'ID', 'PH', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'GY', 'SR', 'GF', 'FK', 'AI', 'BM', 'VG', 'KY', 'TC', 'MS', 'AG', 'DM', 'LC', 'VC', 'BB', 'GD', 'TT', 'JM', 'HT', 'DO', 'PR', 'CU', 'BS', 'AW', 'CW', 'SX', 'BQ', 'MF', 'BL', 'GP', 'MQ', 'RE', 'YT', 'NC', 'PF', 'WF', 'TK', 'NU', 'CK', 'WS', 'TO', 'FJ', 'VU', 'NC', 'SB', 'KI', 'TV', 'NR', 'PW', 'MH', 'FM', 'PG', 'BN', 'KH', 'LA', 'MM', 'BD', 'LK', 'NP', 'BT', 'MV', 'YE', 'OM', 'AE', 'QA', 'BH', 'KW', 'JO', 'LB', 'SY', 'IQ', 'IR', 'AF', 'TJ', 'UZ', 'TM', 'KG', 'KZ', 'MN', 'GE', 'AM', 'AZ', 'BY', 'MD', 'UA', 'RS', 'ME', 'AL', 'MK', 'XK', 'BA', 'AD', 'MC', 'LI', 'SM', 'VA', 'MT', 'IS', 'FO', 'GL', 'AX', 'GI', 'JE', 'GG', 'IM', 'IO', 'SH', 'AC', 'TA', 'BV', 'GS', 'TF', 'HM', 'AQ', 'EH', 'SS', 'SD', 'TD', 'CF', 'CM', 'GQ', 'GA', 'CG', 'CD', 'AO', 'ZM', 'ZW', 'BW', 'NA', 'SZ', 'LS', 'MG', 'MU', 'SC', 'KM', 'YT', 'RE', 'DJ', 'SO', 'ET', 'ER', 'KE', 'TZ', 'UG', 'RW', 'BI', 'MW', 'MZ'],
      default: 'GLOBAL'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    }
  }],
  barcodes: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic barcode validation (UPC/EAN format)
        return /^\d{8,14}$/.test(v);
      },
      message: 'Barcode must be 8-14 digits'
    },
    index: true // Index for fast barcode lookups
  }],
  proofUrls: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid URL format'
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting by last updated
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting by creation date
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common query patterns
productSchema.index({ name: 'text' }); // Text search index
productSchema.index({ boycott: 1, name: 1 }); // For filtering by boycott status and sorting by name
productSchema.index({ boycott: 1, lastUpdated: -1 }); // For getting recent boycotted products
productSchema.index({ barcodes: 1, boycott: 1 }); // For barcode lookups with boycott status

// Virtual for search relevance (can be used for ranking)
productSchema.virtual('searchRelevance').get(function() {
  let score = 0;
  if (this.boycott) score += 10;
  if (this.reason) score += 5;
  if (this.proofUrls && this.proofUrls.length > 0) score += 3;
  if (this.alternatives && this.alternatives.length > 0) score += 2;
  return score;
});

// Pre-save middleware to update lastUpdated
productSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Pre-update middleware to update lastUpdated
productSchema.pre('findOneAndUpdate', function(next) {
  this.set({ lastUpdated: new Date() });
  next();
});

// Static method for text search
productSchema.statics.searchProducts = function(query, options = {}) {
  const { page = 1, limit = 20, boycott, sortBy = 'name', sortOrder = 'asc' } = options;
  
  let searchQuery = {};
  
  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { barcodes: { $regex: query, $options: 'i' } },
      { reason: { $regex: query, $options: 'i' } }
    ];
  }
  
  if (boycott !== undefined) {
    searchQuery.boycott = boycott;
  }
  
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  return this.find(searchQuery)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get alternatives by country with GLOBAL fallback
productSchema.statics.getAlternativesByCountry = function(countryCode) {
  return this.aggregate([
    {
      $unwind: '$alternatives'
    },
    {
      $match: {
        $or: [
          { 'alternatives.countryCode': countryCode },
          { 'alternatives.countryCode': 'GLOBAL' }
        ]
      }
    },
    {
      $group: {
        _id: '$alternatives.name',
        countryCode: { $first: '$alternatives.countryCode' },
        description: { $first: '$alternatives.description' },
        companyName: { $first: '$name' },
        boycott: { $first: '$boycott' }
      }
    },
    {
      $sort: {
        countryCode: 1, // Country-specific first, then GLOBAL
        name: 1
      }
    }
  ]);
};

// Static method to get companies by country
productSchema.statics.getCompaniesByCountry = function(countryCode, options = {}) {
  const { page = 1, limit = 20, boycott } = options;
  
  let query = { country: countryCode };
  if (boycott !== undefined) {
    query.boycott = boycott;
  }
  
  return this.find(query)
    .sort({ name: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method for barcode lookup
productSchema.statics.findByBarcode = function(barcode) {
  return this.findOne({ barcodes: barcode }).lean();
};

// Instance method to add barcode
productSchema.methods.addBarcode = function(barcode) {
  if (!this.barcodes.includes(barcode)) {
    this.barcodes.push(barcode);
  }
  return this.save();
};

// Instance method to add alternative
productSchema.methods.addAlternative = function(alternative) {
  if (!this.alternatives.includes(alternative)) {
    this.alternatives.push(alternative);
  }
  return this.save();
};

// Instance method to add proof URL
productSchema.methods.addProofUrl = function(url) {
  if (!this.proofUrls.includes(url)) {
    this.proofUrls.push(url);
  }
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
