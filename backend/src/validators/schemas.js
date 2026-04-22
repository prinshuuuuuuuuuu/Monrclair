const Joi = require('joi');

const schemas = {
  banners: Joi.object({
    title: Joi.string().required().min(3).max(255),
    subtitle: Joi.string().allow('', null).max(500),
    image_url: Joi.string().uri().required(),
    mobile_image_url: Joi.string().uri().allow('', null),
    cta_1_text: Joi.string().allow('', null).max(50),
    cta_1_link: Joi.string().allow('', null).max(255),
    cta_2_text: Joi.string().allow('', null).max(50),
    cta_2_link: Joi.string().allow('', null).max(255),
    status: Joi.string().valid('active', 'inactive').default('active'),
    display_order: Joi.number().integer().default(0)
  }),

  testimonials: Joi.object({
    user_name: Joi.string().required().min(2).max(100),
    content: Joi.string().required().min(10).max(2000), // Allowing long text via rich editor potentially
    rating: Joi.number().min(1).max(5).required(),
    is_verified_purchase: Joi.boolean().default(true),
    status: Joi.string().valid('active', 'inactive', 'pending').default('active')
  }),

  brands: Joi.object({
    name: Joi.string().required().max(100),
    logo_url: Joi.string().uri().required(),
    is_premium: Joi.boolean().default(true),
    status: Joi.string().valid('active', 'inactive').default('active')
  }),

  faqs: Joi.object({
    question: Joi.string().required().min(10).max(500),
    answer: Joi.string().required().min(10).max(5000), // Rich text allowed
    category: Joi.string().required().max(100),
    status: Joi.string().valid('active', 'inactive').default('active')
  }),

  services: Joi.object({
    title: Joi.string().required().max(100),
    description: Joi.string().required().max(1000),
    icon_name: Joi.string().required().max(50),
    status: Joi.string().valid('active', 'inactive').default('active'),
    display_order: Joi.number().integer().default(0)
  }),

  teams: Joi.object({
    name: Joi.string().required().max(100),
    role: Joi.string().required().max(100),
    bio: Joi.string().allow('', null).max(2000), // Rich text allowed
    avatar_url: Joi.string().uri().allow('', null),
    status: Joi.string().valid('active', 'inactive').default('active')
  }),

  posts: Joi.object({
    title: Joi.string().required().max(255),
    slug: Joi.string().required().max(255),
    excerpt: Joi.string().allow('', null).max(500),
    content: Joi.string().required(), // Full rich text payload
    featured_image_url: Joi.string().uri().allow('', null),
    category: Joi.string().allow('', null).max(100),
    status: Joi.string().valid('published', 'draft', 'archived').default('draft')
  }),
  
  pages: Joi.object({
    title: Joi.string().required().max(255),
    slug: Joi.string().required().max(255),
    content: Joi.string().required(),
    status: Joi.string().valid('active', 'inactive').default('active')
  }),

  products: Joi.object({
    name: Joi.string().required().min(3).max(255),
    brand: Joi.string().required().max(255),
    model_number: Joi.string().allow('', null).max(255),
    category: Joi.string().allow('', null).max(255),
    collection: Joi.string().allow('', null).max(255),
    mrp: Joi.number().allow('', null),
    price: Joi.number().positive().required(),
    case_diameter: Joi.string().allow('', null).max(255),
    case_material: Joi.string().allow('', null).max(255),
    dial_colour: Joi.string().allow('', null).max(255),
    movement_type: Joi.string().allow('', null).max(255),
    caliber: Joi.string().allow('', null).max(255),
    water_resistance: Joi.string().allow('', null).max(255),
    strap_material: Joi.string().allow('', null).max(255),
    crystal: Joi.string().allow('', null).max(255),
    functions: Joi.string().allow('', null).max(1000),
    power_reserve: Joi.string().allow('', null).max(255),
    case_thickness: Joi.string().allow('', null).max(255),
    lug_width: Joi.string().allow('', null).max(255),
    warranty: Joi.string().allow('', null).max(255),
    key_highlights: Joi.string().allow('', null),
    whats_in_the_box: Joi.string().allow('', null),
    status: Joi.string().valid('active', 'inactive').default('active'),
    stock_quantity: Joi.number().integer().min(0).default(0),
    existingImages: Joi.string().allow('', null), // To handle the JSON stringified array
  }),

  coupons: Joi.object({
    code: Joi.string().uppercase().required().min(3).max(50),
    discount_type: Joi.string().valid('percentage', 'fixed').required(),
    discount_value: Joi.number().positive().required(),
    min_order_value: Joi.number().min(0).default(0),
    max_discount_limit: Joi.number().positive().allow(null),
    expiry_date: Joi.date().required(),
    usage_limit_total: Joi.number().integer().min(1).allow(null),
    usage_limit_per_user: Joi.number().integer().min(1).default(1),
    status: Joi.string().valid('active', 'inactive', 'disabled').default('active')
  })
};

const validateRequestPayload = (moduleName) => {
  return (req, res, next) => {
    const schema = schemas[moduleName];
    if (!schema) {
      // If no schema defined for a module, optionally pass through or deny
      return next(); 
    }
    
    // Ignore validation on bulk endpoints where data is { ids, action }
    if (req.route.path === '/bulk' || req.originalUrl.includes('/bulk')) {
       return next();
    }
    
    // For PATCH on status, simplify to minimal schema or bypass
    if (req.route.path === '/:id/status') {
      const statusSchema = Joi.object({ status: Joi.string().required() }).unknown(true);
      const { error } = statusSchema.validate(req.body);
      if (error) return res.status(422).json({ success: false, message: error.details[0].message });
      return next();
    }

    // Full or partial schema match
    let finalSchema = schema;
    if (req.method === 'PUT' || req.method === 'PATCH') {
       // Make all fields optional for updates if patching, unless we require whole object
       // Generic updates usually send the whole object, but Joi might reject undefined properties missing.
       finalSchema = schema; // Assume we send the whole form. We can change to schema.options({ presence: 'optional' }) if needed.
    }

    const { error, value } = finalSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return res.status(422).json({
        success: false,
        message: 'Validation failed: ' + errorMessages,
        errors: error.details
      });
    }
    
    // Assign mapped stripped value to req body (prevents SQL injection of non-defined properties)
    req.body = value;
    next();
  };
};

module.exports = { schemas, validateRequestPayload };
