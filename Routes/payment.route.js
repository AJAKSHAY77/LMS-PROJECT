import { Router } from "express";
import { RazorpayApiKey, allpayments, buysubscription, cancelsubscription, verifysubscription } from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.route("/razorpay_key")
    .get(RazorpayApiKey);

paymentRouter.route("/suscribe")
    .post(buysubscription);

paymentRouter.route("/verify")
    .post(verifysubscription);

paymentRouter.route("/unsuscribe")
    .post(cancelsubscription);

//for admin
paymentRouter.route("/")
    .get(allpayments);


export default paymentRouter;
