import FeatureCard from './components/FeatureCard';
import styles from './TopPage.module.css';



function TopPage() {
  return (
    <div>

        <div className={styles['top-banner']}>
            <p>ココに載せるもの要相談</p>
        </div>

        <div className={styles['card-list']}>
        <FeatureCard
            image={<img src="/sampleA.png" alt="feature1" width={300} />}
            title="機能A"
            description="説明文aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            link="/feature-a"
        />
        <FeatureCard
            image={<img src="/sampleA.png" alt="feature1" width={300} />}
            title="機能B"
            description="説明文aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaあ"
            link="/feature-b"
        />
        <FeatureCard
            image={<img src="/sampleA.png" alt="feature1" width={300} />}
            title="機能C"
            description="説明文"
            link="/feature-c"
        />
        </div>
    </div>
  );
}

export default TopPage;