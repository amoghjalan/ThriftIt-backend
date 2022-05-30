const router = require("express").Router();
const {
  verifyToken,
  verifyAdminToken,
  verifyTokenAndAuthentication
} = require("./verifyToken");
const Cart = require("../modals/Cart");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAuthentication, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart Deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET USER CART

router.get("/find/:userId", verifyTokenAndAuthentication, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL

router.get("/", verifyAdminToken, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.send(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
