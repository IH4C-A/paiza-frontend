import FeatureCard from "./components/FeatureCard";
import styles from "./TopPage.module.css";

function TopPage() {
  const featureList = [
    {
      id: 1,
      image: "/top_image1.png",
      title: "メンター制度",
      description:
        "S・Aランクの学生がB・C・Dランクの学生の学習をサポート。学生の「分からない」を無くし、より学習しやすく。",
      route: "/mentor",
    },

    {
      id: 2,
      image: "/top_image2.png",
      title: "うちのコ",
      description:
        "あなたのパートナー、「うちのコ」がモチベーションを管理。パートナーを育てると共に自分も育っていくような体験をすることができる。",
      route: "/partner",
    },
    {
      id: 3,
      image: "/top_image3.png",
      title: "技術記事",
      description:
        "自分の学んだ技術や、ランクアップに役立つノウハウを気軽に投稿。記事を読んで気になった相手にメンターの申請を出すことも可能。",
      route: "/article",
    },
  ];

  return (
    <div>
      <div className={styles.heroSection}>
        <div className={styles.serviceDescription}>
          <h2 className={styles.catchcopy}>育てて育つ</h2>
          <figure>
            <img src="/logo.png" alt="ロゴ" />
          </figure>
          <p className={styles.descriptionText}>3つの新機能で、</p>
          <p className={styles.descriptionText}>より学習しやすく。</p>
        </div>
        <figure className={styles.pcImage}>
          <img src="/paiza_pc.png" alt="paiza-pc-image" />
        </figure>
      </div>

      <div className={styles.featureSection}>
        {featureList.map((item) => (
          <FeatureCard
            key={item.id}
            image={item.image}
            title={item.title}
            description={item.description}
            link={item.route}
          />
        ))}
      </div>
    </div>
  );
}

export default TopPage;
