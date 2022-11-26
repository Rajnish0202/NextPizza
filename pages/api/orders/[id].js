import nc from 'next-connect';
import dbConnect from '../../../util/mongo';
import Order from '../../../models/Order';

const handler = nc();

handler.get(async (req, res) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  try {
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//   if (method === 'PUT') {
//     try {
//       const order = await Order.findByIdAndUpdate(id, req.body, {
//         new: true,
//       });
//       res.status(201).json(order);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }

//   if (method === 'DELETE') {
//   }
// });

export default handler;
