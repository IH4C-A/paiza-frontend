import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.siteMap}>
        {/* logo */}
        <div className={styles.siteMapContents}>
          <figure className={styles.footerLogo}>
            <img className={styles.footerLogoImage} src="/logo.png" alt="" />
          </figure>
          <p className={styles.footerDescription}>
            3つの新機能でより学習しやすく
          </p>
        </div>
        {/* contents */}
        <div className={styles.siteMapContents}>
          <h2 className={styles.siteMapCaption}>コンテンツ</h2>
          <p className={styles.siteMapItem}>
            <a href="/partner" className={styles.siteMapLink}>
              うちのコ
            </a>
          </p>
          <p className={styles.siteMapItem}>
            <a href="/skillcheck" className={styles.siteMapLink}>
              スキルチェック
            </a>
          </p>
        </div>
        {/* メンター */}
        <div className={styles.siteMapContents}>
          <h2 className={styles.siteMapCaption}>学習サポート</h2>
          <p className={styles.siteMapItem}>
            <a href="/mentor" className={styles.siteMapLink}>
              メンター
            </a>
          </p>
          <p className={styles.siteMapItem}>
            <a href="/chat" className={styles.siteMapLink}>
              チャット
            </a>
          </p>
          <p className={styles.siteMapItem}>
            <a href="/article" className={styles.siteMapLink}>
              技術記事
            </a>
          </p>
        </div>
        {/* paizaについて */}
        <div className={styles.siteMapContents}>
          <h2 className={styles.siteMapCaption}>paizaについて</h2>
          <p className={styles.siteMapItem}>
            <a href="https://paiza.jp/works" className={styles.siteMapLink}>
              paizaラーニング
            </a>
          </p>
          <p className={styles.siteMapItem}>
            <a href="https://www.paiza.co.jp/" className={styles.siteMapLink}>
              運営会社
            </a>
          </p>
        </div>
      </div>
      <div className={styles.copyright}>
        <p className={styles.copyrightText}>
          &copy; 2025 paiza nurture. All rights reserved.
        </p>
      </div>
    </div>
  );
};
