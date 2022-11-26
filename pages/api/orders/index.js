import nc from 'next-connect';
import dbConnect from '../../../util/mongo';
import Order from '../../../models/Order';

const handler = nc();

handler.get(async (req, res) => {
  await dbConnect();

  try {
    const orders = await Order.find();
    res.status(200).json({
      status: 'success',
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

handler.post(async (req, res) => {
  await dbConnect();

  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      status: 'success',
      order,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default handler;
