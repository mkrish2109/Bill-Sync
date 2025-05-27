const express = require('express');
const {
  getFabrics,
  getFabric,
  createFabric,
  updateFabric,
  deleteFabric,
  getFabricStats
} = require('../controllers/fabricController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
  .get(getFabrics)
  .post(authorize('worker', 'admin'), createFabric);

router.route('/:id')
  .get(getFabric)
  .put(authorize('worker', 'admin'), updateFabric)
  .delete(authorize('worker', 'admin'), deleteFabric);


module.exports = router; 