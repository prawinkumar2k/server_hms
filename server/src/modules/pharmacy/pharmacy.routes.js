const express = require('express');
const router = express.Router();
const pharmaController = require('./pharmacy.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');
const { cacheResponse, invalidateCache } = require('../../middlewares/cache.middleware');


// Stats
// Reports
router.get('/reports/daily', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), pharmaController.getDailyReport);

// Dashboard Stats
router.get('/stats', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), cacheResponse(60), pharmaController.getDashboardStats);

// Vendors
router.get('/vendors', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), cacheResponse(60), pharmaController.getVendors);
router.post('/vendors', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), invalidateCache('/api/pharmacy/vendors'), pharmaController.createVendor);
router.put('/vendors/:id', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), invalidateCache('/api/pharmacy/vendors'), pharmaController.updateVendor);
router.delete('/vendors/:id', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), invalidateCache('/api/pharmacy/vendors'), pharmaController.deleteVendor);

// Products (Stock)
router.get('/products', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), cacheResponse(30), pharmaController.getProducts);
router.post('/products', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), invalidateCache('/api/pharmacy/products'), pharmaController.createProduct);
router.put('/products/:id', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), invalidateCache('/api/pharmacy/products'), pharmaController.updateProduct);
router.delete('/products/:id', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), invalidateCache('/api/pharmacy/products'), pharmaController.deleteProduct);

// Purchase
router.get('/purchases', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), pharmaController.getPurchases);
router.post('/purchases', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), pharmaController.createPurchase);

// Enquiry
router.get('/enquiries', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), pharmaController.getEnquiries);
router.post('/enquiries', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), pharmaController.createEnquiry);

// Approval Workflow
router.post('/requests', protect, authorizeRoles('Doctor', 'Admin'), pharmaController.createRequest);
router.get('/requests/pending', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), pharmaController.getPendingRequests);
router.put('/requests/:id/status', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), pharmaController.updateRequestStatus);

const stockController = require('./stock.controller');

// ... (Existing imports)

// Stock Alerts (Pharma Master ONLY -> Extended to Pharmacist)
router.get('/alerts', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), cacheResponse(30), pharmaController.getAlerts);
router.put('/alerts/:id/acknowledge', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), invalidateCache('/api/pharmacy/alerts'), pharmaController.acknowledgeAlert);

// ================= STOCK ORDERING (PHARMA MASTER ONLY -> Extended to Pharmacist) =================
// Suppliers
router.get('/suppliers', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), cacheResponse(60), stockController.getSuppliers);
router.post('/suppliers', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), invalidateCache('/api/pharmacy/suppliers'), stockController.createSupplier);

// Orders
router.get('/orders', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), cacheResponse(30), stockController.getOrders);
router.get('/orders/:id', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), stockController.getOrderDetails);
router.post('/orders', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), invalidateCache('/api/pharmacy/orders'), stockController.createOrder); // Draft
router.put('/orders/:id/submit', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), invalidateCache('/api/pharmacy/orders'), stockController.submitOrder); // Submit
router.post('/orders/:id/receive', protect, authorizeRoles('PHARMA_MASTER', 'Admin', 'Pharmacist'), invalidateCache('/api/pharmacy/orders'), stockController.receiveOrder); // Receive Stock

module.exports = router;
