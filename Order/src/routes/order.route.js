const express = require('express');
const createAuthMiddleware = require('../middleware/auth.middleware');
const validation = require('../middleware/validation.middleware');
const orderController = require('../controller/order.controller');

const router = express.Router();
//POST: Create a new order
router.post("/", createAuthMiddleware([ "user" ]), validation.createOrderValidation, orderController.createOrder)

//GET: Get all orders for the authenticated user
router.get("/me", createAuthMiddleware([ "user" ]), orderController.getMyOrders)

//POST: Cancel order
router.post("/:id/cancel",createAuthMiddleware(['user']),orderController.cancelOrderById)

//PATCH: Update order address
router.patch("/:id/address", createAuthMiddleware([ "user" ]), validation.updateAddressValidation, orderController.updateOrderAddress)

//GET: Get order by ID (accessible by both user and admin)
router.get("/:id", createAuthMiddleware([ "user", "admin" ]), orderController.getOrderById)
module.exports = router;