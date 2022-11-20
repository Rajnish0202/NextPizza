import styles from '../styles/PizzaList.module.css';
import PizzaCard from './PizzaCard';

const PizzaList = ({ pizzaList }) => {
  const { products } = pizzaList;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>The best pizza in city</h1>
      <p className={styles.desc}>
        My love is pizza shaped. Won&apos;t you have a slice? It&apos;s circular, so there&apos;s enough to go around.
      </p>
      <div className={styles.wrapper}>
        {products.map((pizza) => (
          <PizzaCard key={pizza._id} pizza={pizza} />
        ))}
      </div>
    </div>
  );
};

export default PizzaList;
