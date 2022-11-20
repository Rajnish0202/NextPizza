import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the title!'],
      maxlength: 60,
    },
    desc: {
      type: String,
      required: [true, 'Please provide the description!'],
      maxlength: 200,
    },
    img: {
      type: String,
      required: [true, 'Please provide the image!'],
    },
    prices: {
      type: [Number],
      required: [true, 'Please provide the price!'],
    },
    extraOptions: {
      type: [
        {
          text: { type: String, required: [true, 'Please provide the text!'] },
          price: { type: Number, required: [true, 'Please provide the price!'] },
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
