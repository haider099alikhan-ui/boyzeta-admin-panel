const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

describe('BoyZeta API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/boyzeta-test');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear products collection before each test
    await mongoose.connection.collection('products').deleteMany({});
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

  describe('Products API', () => {
    const sampleProduct = {
      name: 'Test Product',
      boycott: true,
      reason: 'Test reason for boycott',
      alternatives: ['Alternative 1', 'Alternative 2'],
      barcodes: ['1234567890123'],
      proofUrls: ['https://example.com/proof']
    };

    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send(sampleProduct)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(sampleProduct.name);
      expect(res.body.data.boycott).toBe(sampleProduct.boycott);
    });

    it('should get all products', async () => {
      // Create a product first
      await request(app).post('/api/products').send(sampleProduct);

      const res = await request(app)
        .get('/api/products')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination.totalItems).toBe(1);
    });

    it('should get product by ID', async () => {
      // Create a product first
      const createRes = await request(app)
        .post('/api/products')
        .send(sampleProduct);

      const productId = createRes.body.data._id;

      const res = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(productId);
    });

    it('should update a product', async () => {
      // Create a product first
      const createRes = await request(app)
        .post('/api/products')
        .send(sampleProduct);

      const productId = createRes.body.data._id;

      const updateData = {
        name: 'Updated Product Name',
        boycott: false
      };

      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updateData.name);
      expect(res.body.data.boycott).toBe(updateData.boycott);
    });

    it('should delete a product', async () => {
      // Create a product first
      const createRes = await request(app)
        .post('/api/products')
        .send(sampleProduct);

      const productId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify product is deleted
      await request(app)
        .get(`/api/products/${productId}`)
        .expect(404);
    });

    it('should search by barcode', async () => {
      // Create a product first
      await request(app).post('/api/products').send(sampleProduct);

      const res = await request(app)
        .get(`/api/products/search/barcode/${sampleProduct.barcodes[0]}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.barcodes).toContain(sampleProduct.barcodes[0]);
    });

    it('should get statistics', async () => {
      // Create some products
      await request(app).post('/api/products').send(sampleProduct);
      await request(app).post('/api/products').send({
        ...sampleProduct,
        name: 'Non-boycotted Product',
        boycott: false
      });

      const res = await request(app)
        .get('/api/products/stats')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(2);
      expect(res.body.data.boycotted).toBe(1);
      expect(res.body.data.nonBoycotted).toBe(1);
    });
  });

  describe('Validation', () => {
    it('should validate required fields', async () => {
      const invalidProduct = {
        // Missing required fields
        reason: 'Test reason'
      };

      const res = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    it('should validate barcode format', async () => {
      const invalidProduct = {
        name: 'Test Product',
        boycott: true,
        barcodes: ['invalid-barcode']
      };

      const res = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should validate URL format', async () => {
      const invalidProduct = {
        name: 'Test Product',
        boycott: true,
        proofUrls: ['invalid-url']
      };

      const res = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });
});
