import styles from '../styles/AddButton.module.css';

const AddButton = ({ setClose }) => {
  return (
    <button className={styles.mainAddButton} onClick={() => setClose(false)}>
      Add New Product
    </button>
  );
};

export default AddButton;
