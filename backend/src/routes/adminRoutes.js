const express = require('express');
const router = express.Router();
const { getMetrics, getCustomers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Lock all routes down to admin role only
router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getMetrics);
router.get('/customers', getCustomers);

module.exports = router;
