/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import styles from '../styles/Cart.module.css';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
import { reset } from '../redux/cartSlice';
import OrderDetails from '../components/OrderDetails';

const Cart = () => {
  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // This values are the props in the UI
  const amount = cart.total;
  const currency = 'USD';
  const style = { layout: 'vertical' };
  const router = useRouter();

  const createOrder = async (data) => {
    try {
      const res = await axios.post('http://localhost:3000/api/orders', data);
      res.status === 201 && router.push('/orders/' + res.data.order._id);
      dispatch(reset());
    } catch (error) {
      console.log(error);
    }
  };

  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: 'resetOptions',
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className='spinner' />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              // Your code here after capture the order
              // console.log(details);
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1,
              });
            });
          }}
        />
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.trTitle}>
              <th>Product</th>
              <th>Name</th>
              <th>Extras</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.products.map((product) => (
              <tr className={styles.tr} key={product._id}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image src={product.img} alt={product.title} layout='fill' objectFit='cover' />
                  </div>
                </td>
                <td>
                  <span className={styles.name}>{product.title}</span>
                </td>
                <td>
                  {product.extras.map((extra) => (
                    <span className={styles.extras} key={extra._id}>
                      {' '}
                      {extra.text}
                    </span>
                  ))}
                </td>
                <td>
                  <span className={styles.price}>₹{product.price}</span>
                </td>
                <td>
                  <span className={styles.quantity}>{product.quantity}</span>
                </td>
                <td>
                  <span className={styles.total}>₹{product.quantity * product.price}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>₹{cart.total.toFixed(2)}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>₹0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>₹{cart.total.toFixed(2)}
          </div>
          {open ? (
            <div className={styles.paymentMethods}>
              <button className={styles.cod} onClick={() => setCash(true)}>
                Cash On Delivery
              </button>
              <PayPalScriptProvider
                options={{
                  'client-id': 'AUATQTY6SX5YAj8zokveF3XD5lEbtGvBBeUYW6pZQv72g_y2mupl356AUfVyHSOVgapwwcJYC-_fZjrq',
                  components: 'buttons',
                  currency: 'USD',
                  'disable-funding': 'credit,card,p24',
                }}
              >
                <ButtonWrapper currency={currency} showSpinner={false} />
              </PayPalScriptProvider>
            </div>
          ) : (
            <button className={styles.button} onClick={() => setOpen(true)}>
              Checkout now!
            </button>
          )}
        </div>
      </div>
      {cash && <OrderDetails total={cart.total} createOrder={createOrder} />}
    </div>
  );
};

export default Cart;
