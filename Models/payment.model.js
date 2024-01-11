import { model, Schema } from "mongoose";

const PaymentSchema = new Schema({
  razorpay_payment_id: {
    type: String,
    required: true,
  },

  razorpay_subscription: {
      type: String,
      required:true
    },
  
    razorpay_singature: {
        type: String,
        required:true
  }
},

    {
    timestamps:true
}

);

export const payment = model("payment", PaymentSchema);

export default payment;
