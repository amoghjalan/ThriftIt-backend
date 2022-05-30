const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthentication,
  verifyAdminToken
} = require("./verifyToken");
const Order = require("../modals/Order");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/:id", verifyAdminToken, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyAdminToken, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order Deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET USER ORDERS

router.get("/find/:id", verifyTokenAndAuthentication, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL ORDERS

router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const order = query
      ? await Order.find().sort({ _id: -1 }).limit(5)
      : await Order.find();
    res.send(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyAdminToken, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount"
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" }
        }
      }
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
