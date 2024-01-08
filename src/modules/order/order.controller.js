import { Card } from "../../../db/models/cards.model.js";
import { Coupon } from "../../../db/models/coupon.model.js";
import { Order } from "../../../db/models/order.model.js";
import { Product } from "../../../db/models/product.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { createInvoice } from "../../utils/templetInvoice.js";
import { fileURLToPath } from "url";
import path from "path";
import cloudinary from "../../utils/cloud.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { clearCard, updateStock } from "./order.service.js";

export const createOreder = asyncHandler(async (req, res, next) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  let user = req.user;

  // data
  const { address, phone, coupon, payment } = req.body;
  // check coupon
  let checkCoupon;

  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });
    if (!checkCoupon) return next(new Error("Invalid Coupon"));
  }
  // check card
  const card = await Card.findOne({ user: req.user._id });
  const products = card.products;
  if (products.length < 1) return next(new Error("Empty Card"));

  let orderPrice = 0;
  let orderProduct = [];
  for (let i = 0; i < products.length; i++) {
    // get products from card

    const product = await Product.findById(products[i].productId);

    if (!product) return next(new Error("Product Not Found "));
    // check stock
    if (product.availableItems < products[i].quantity)
      return next(
        new Error(
          `${product.name} out of stock , only ${product.availableItems} items are left !`
        )
      );

    orderProduct.push({
      productId: product._id,
      quantity: products[i].quantity,
      name: product.name,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
    });
    orderPrice += product.finalPrice * products[i].quantity;
  }

  // create order
  const order = await Order.create({
    user: req.user._id,
    products: orderProduct,
    address,
    phone,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
    payment,
    price: orderPrice,
  });

  // generate invoice
  const invoice = {
    shipping: {
      name: user.name,
      address,
      city: "Eygpt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };

  const pdfPath = path.join(__dirname, `../../../invoceTemp/${order._id}.pdf`);

  createInvoice(invoice, pdfPath);
  // upload cloudinary

  const { public_id, secure_url } = await cloudinary.uploader.upload(pdfPath, {
    folder: `Ecommerce/order/invoice/${user._id}`,
  });

  // add invoice in order
  order.invoice = { url: secure_url, id: public_id };
  await order.save();

  // send Email
  const isSend = await sendEmail({
    to: user.email,
    subject: "Order Invoice",
    html: `<h3>${secure_url}</h3>`,
  });

  clearCard(user._id);
  updateStock(order.products, true);
  return res.json({
    success: true,
    message: "Please Reviwe Your Account ",
  });

  //responce
});

// cnacal Order

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new Error("Order Not Found "));

  if (order.status === "shipped" || order.status === "delivered")
    return next(new Error("can't cancel Order"));

  order.status = "cancelled";
  order.save();

  updateStock(order.products, false);

  return res.json({ success: true, message: "Order Cancelled Successfully" });
});
