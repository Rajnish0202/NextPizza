import nc from 'next-connect';
import dbConnect from '../../../util/mongo';
import Product from '../../../models/Product';

const handler = nc();

handler.get(async (req, res) => {
  const { cookies } = req;

  const token = cookies.token;

  await dbConnect();

  try {
    const products = await Product.find({});
    res.status(200).json({
      status: 'success',
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

handler.post(async (req, res) => {
  await dbConnect();
  if (!token || token !== process.env.TOKEN) {
    return res.status(401).json('Not authenticated!');
  }
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      status: 'success',
      product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default handler;
