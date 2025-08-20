const Joi = require('joi');

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .min(1)
    .max(200)
    .messages({
      'string.empty': 'Product name is required',
      'string.max': 'Product name cannot exceed 200 characters',
      'any.required': 'Product name is required'
    }),
  
  boycott: Joi.boolean()
    .required()
    .messages({
      'any.required': 'Boycott status is required',
      'boolean.base': 'Boycott must be a boolean value'
    }),
  
  reason: Joi.string()
    .optional()
    .trim()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Reason cannot exceed 1000 characters'
    }),
  
  alternatives: Joi.array()
    .items(
      Joi.string()
        .trim()
        .min(1)
        .max(200)
    )
    .optional()
    .messages({
      'array.base': 'Alternatives must be an array',
      'string.min': 'Alternative name cannot be empty',
      'string.max': 'Alternative name cannot exceed 200 characters'
    }),
  
  barcodes: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(/^\d{8,14}$/)
        .messages({
          'string.pattern.base': 'Barcode must be 8-14 digits'
        })
    )
    .optional()
    .messages({
      'array.base': 'Barcodes must be an array'
    }),
  
  proofUrls: Joi.array()
    .items(
      Joi.string()
        .trim()
        .uri()
        .messages({
          'string.uri': 'Invalid URL format'
        })
    )
    .optional()
    .messages({
      'array.base': 'Proof URLs must be an array'
    })
});

const updateProductSchema = Joi.object({
  name: Joi.string()
    .optional()
    .trim()
    .min(1)
    .max(200)
    .messages({
      'string.empty': 'Product name cannot be empty',
      'string.max': 'Product name cannot exceed 200 characters'
    }),
  
  boycott: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Boycott must be a boolean value'
    }),
  
  reason: Joi.string()
    .optional()
    .trim()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Reason cannot exceed 1000 characters'
    }),
  
  alternatives: Joi.array()
    .items(
      Joi.string()
        .trim()
        .min(1)
        .max(200)
    )
    .optional()
    .messages({
      'array.base': 'Alternatives must be an array',
      'string.min': 'Alternative name cannot be empty',
      'string.max': 'Alternative name cannot exceed 200 characters'
    }),
  
  barcodes: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(/^\d{8,14}$/)
        .messages({
          'string.pattern.base': 'Barcode must be 8-14 digits'
        })
    )
    .optional()
    .messages({
      'array.base': 'Barcodes must be an array'
    }),
  
  proofUrls: Joi.array()
    .items(
      Joi.string()
        .trim()
        .uri()
        .messages({
          'string.uri': 'Invalid URL format'
        })
    )
    .optional()
    .messages({
      'array.base': 'Proof URLs must be an array'
    })
});

const querySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  
  search: Joi.string()
    .optional()
    .trim()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query cannot exceed 100 characters'
    }),
  
  boycott: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Boycott filter must be a boolean value'
    }),
  
  barcode: Joi.string()
    .optional()
    .trim()
    .pattern(/^\d{8,14}$/)
    .messages({
      'string.pattern.base': 'Barcode must be 8-14 digits'
    }),
  
  sortBy: Joi.string()
    .valid('name', 'createdAt', 'lastUpdated', 'relevance')
    .default('name')
    .messages({
      'any.only': 'Sort by must be one of: name, createdAt, lastUpdated, relevance'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('asc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    })
});

const idSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid product ID format',
      'any.required': 'Product ID is required'
    })
});

// Validation middleware functions
const validateProduct = (req, res, next) => {
  const { error, value } = productSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  req.body = value;
  next();
};

const validateUpdateProduct = (req, res, next) => {
  const { error, value } = updateProductSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  req.body = value;
  next();
};

const validateQuery = (req, res, next) => {
  const { error, value } = querySchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Query validation failed',
      details: errors
    });
  }

  req.query = value;
  next();
};

const validateId = (req, res, next) => {
  const { error } = idSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      error: 'Invalid product ID',
      message: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateProduct,
  validateUpdateProduct,
  validateQuery,
  validateId
};
