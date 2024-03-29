import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: [true, 'Please provide the customer name!'],
      maxlength: 60,
    },
    address: {
      type: String,
      required: [true, 'Please provide the address!'],
      maxlength: 200,
    },
    total: {
      type: Number,
      required: [true, 'Please provide the total!'],
    },
    status: {
      type: Number,
      default: 0,
    },
    method: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
