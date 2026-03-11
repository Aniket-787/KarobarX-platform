const express = require('express');
const createAuthMiddleware = require("../middleware/auth.middleware")
const cartController = require("../controllers/cart.controller")
const validation = require("../middleware/validation.middleware")


const router = express.Router()

//GET : Get cart details
router.get('/',
    createAuthMiddleware([ 'user' ]),
    cartController.getCart
);

//POST : Add product to cart
router.post("/items",
    validation.validateAddItemToCart,
    createAuthMiddleware([ "user" ]),
    cartController.addItemToCart
)

//PATCH : Update item quantity in cart
router.patch(
    '/items/:productId',
    validation.validateUpdateCartItem,
    createAuthMiddleware([ 'user' ]),
    cartController.updateItemQuantity
);




module.exports = router;