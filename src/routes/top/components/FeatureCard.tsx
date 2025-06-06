import { Link } from 'react-router-dom';
import React from 'react';
import styles from '../TopPage.module.css'; 

type FeatureCardProps = {
  image: React.ReactNode;
  title: string;
  description: string;
  link: string;
};

function FeatureCard({ image, title, description, link }: FeatureCardProps) {
  return (
    <div className={styles.card}>
      <figure>{image}</figure>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={link}>
        <button className={styles.button}>使ってみる</button>
      </Link>
    </div>
  );
}

export default FeatureCard;