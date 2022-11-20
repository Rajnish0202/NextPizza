import styles from '../../styles/Product.module.css';
import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../redux/cartSlice';

const Product = ({ pizza }) => {
  const [price, setPrice] = useState(pizza.product.prices[0]);
  const [size, setSize] = useState(0);
  const [extras, setExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const { product } = pizza;

  const changePrice = (number) => {
    setPrice(price + number);
  };

  const handleSize = (index) => {
    const difference = product.prices[index] - product.prices[size];
    setSize(index);
    changePrice(difference);
  };

  const handleChange = (e, extra) => {
    const checked = e.target.checked;

    if (checked) {
      changePrice(extra.price);
      setExtras((prev) => [...prev, extra]);
    } else {
      changePrice(-extra.price);
      setExtras(extras.filter((el) => el._id !== extra._id));
    }
  };

  const handleCart = () => {
    dispatch(addProduct({ ...product, extras, price, quantity }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={product.img} alt={product.title} layout='fill' objectFit='contain' />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{product.title}</h1>
        <span className={styles.price}>₹{price}</span>
        <p className={styles.desc}>{product.desc[0].toUpperCase() + product.desc.slice(1)}</p>
        <h3 className={styles.choose}>Choose the size</h3>
        <div className={styles.sizes}>
          <div className={styles.size} onClick={() => handleSize(0)}>
            <Image src='/img/size.png' alt='' layout='fill' />
            <span className={styles.number}>Small</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(1)}>
            <Image src='/img/size.png' alt='' layout='fill' />
            <span className={styles.number}>Medium</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(2)}>
            <Image src='/img/size.png' alt='' layout='fill' />
            <span className={styles.number}>Large</span>
          </div>
        </div>
        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          {product.extraOptions.map((extra) => (
            <div className={styles.option} key={extra._id}>
              <input
                type='checkbox'
                id={extra.text}
                name={extra.text}
                className={styles.checkbox}
                onChange={(e) => handleChange(e, extra)}
              />
              <label htmlFor='double'>{extra.text}</label>
            </div>
          ))}
        </div>
        <div className={styles.add}>
          <input
            type='number'
            defaultValue={1}
            className={styles.quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button className={styles.button} onClick={handleCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(`http://localhost:3000/api/products/${params.id}`);
  return {
    props: {
      pizza: res.data,
    },
  };
};

export default Product;
