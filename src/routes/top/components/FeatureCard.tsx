import { Link } from "react-router-dom";
import styles from "./FeatureCard.module.css";

type FeatureCardProps = {
  image: string;
  title: string;
  description: string;
  link: string;
};

function FeatureCard({ image, title, description, link }: FeatureCardProps) {
  return (
    <div className={styles.container}>
      <figure>
        <img
          className={styles.cardImage}
          src={image}
          alt=""
          width={200}
          height={200}
        />
      </figure>
      <div className={styles.featureDescription}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardText}>{description}</p>
        <Link className={styles.buttonLink} to={link}>
          <button className={styles.cardButton}>使ってみる</button>
        </Link>
      </div>
    </div>
  );
}

export default FeatureCard;
