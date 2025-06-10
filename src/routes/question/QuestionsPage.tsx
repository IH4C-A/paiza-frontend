import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionsPage.module.css';

// --- インターフェース定義 ---
interface Question {
  id: string;
  title: string;
  tags: string[];
  authorRank: 'A' | 'B';
  snippet: string;
  authorName: string;
  timestamp: string;
  answerCount: number;
  viewCount: number;
  category: 'algorithm' | 'web' | 'design' | 'exam' | 'general';
}

// --- サンプルデータ ---
const allQuestions: Question[] = [
  {
    id: '1',
    title: 'ReactのuseEffectで無限ループが発生する原因について',
    tags: ['React', 'JavaScript', 'useEffect'],
    authorRank: 'B',
    snippet: 'ReactでuseEffectを使っているのですが、無限ループが発生してしまいます。依存配列には空の配列を指定しているのですが、それでも無限ループが発生します。どのような原因が考えられるでしょうか？',
    authorName: '田中太郎',
    timestamp: '2時間前',
    answerCount: 3,
    viewCount: 42,
    category: 'web',
  },
  {
    id: '2',
    title: '二分探索木の実装で削除操作がうまくいきません',
    tags: ['アルゴリズム', '二分探索木', 'Python'],
    authorRank: 'B',
    snippet: '二分探索木の実装で、ノードの削除操作がうまくいきません。特に、子ノードが2つある場合の処理で問題が発生しています。以下のコードを見ていただけますか？',
    authorName: '佐藤花子',
    timestamp: '5時間前',
    answerCount: 1,
    viewCount: 28,
    category: 'algorithm',
  },
  {
    id: '3',
    title: 'レスポンシブデザインでのフレックスボックスとグリッドの使い分け',
    tags: ['CSS', 'レスポンシブ', 'UI/UX'],
    authorRank: 'A',
    snippet: 'レスポンシブデザインを実装する際に、フレックスボックスとCSSグリッドをどのように使い分けるべきでしょうか？それぞれの利点と欠点、適切な使用シーンについて教えてください。',
    authorName: '鈴木一郎',
    timestamp: '1日前',
    answerCount: 5,
    viewCount: 112,
    category: 'design',
  },
  {
    id: '4',
    title: '情報処理試験の午前問題の効率的な学習方法',
    tags: ['情報処理試験', '学習法', '資格'],
    authorRank: 'A',
    snippet: '応用情報技術者試験の午前問題がなかなか安定しません。皆さんはどのように対策されていますか？おすすめの参考書や学習サイトがあれば教えていただきたいです。',
    authorName: '高橋 優子',
    timestamp: '3日前',
    answerCount: 0,
    viewCount: 98,
    category: 'exam',
  },
];

const TABS = [
    { value: 'all', label: 'すべて' },
    { value: 'algorithm', label: 'アルゴリズム' },
    { value: 'web', label: 'Webフレームワーク' },
    { value: 'design', label: 'UI/UX' },
    { value: 'exam', label: '情報処理試験' },
];

// --- メインコンポーネント ---
export default function QuestionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');

  // フィルタリングとソーティングロジック
  const displayedQuestions = useMemo(() => {
    let processedQuestions = [...allQuestions];

    if (activeTab !== 'all') {
      processedQuestions = processedQuestions.filter(q => q.category === activeTab);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      processedQuestions = processedQuestions.filter(q => 
        q.title.toLowerCase().includes(lowercasedTerm) || 
        q.snippet.toLowerCase().includes(lowercasedTerm) ||
        q.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
      );
    }

    switch (sortOrder) {
      case 'popular':
        processedQuestions.sort((a, b) => (b.answerCount + b.viewCount) - (a.answerCount + a.viewCount));
        break;
      case 'unanswered':
        processedQuestions = processedQuestions.filter(q => q.answerCount === 0);
        break;
      case 'latest':
      default:
        break;
    }
    
    return processedQuestions;
  }, [activeTab, sortOrder, searchTerm]);

  const handleAskQuestionClick = () => {
    navigate('/question/new');
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.topSection}>
            <div>
              <h1 className={styles.titleTextH1}>質問掲示板</h1>
              <p className={styles.titleTextP}>
                プログラミングに関する質問を投稿したり、他のユーザーの質問に回答したりできます
              </p>
            </div>
            <div className={styles.actionsContainer}>
              <div className={styles.searchInputContainer}>
                <img src="/icons/search.svg" alt="" className={styles.searchInputIcon} />
                <input 
                  type="search" 
                  placeholder="質問を検索..." 
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className={styles.iconButton} aria-label="フィルター">
                <img src="/icons/filter.svg" alt="Filter" />
                <span className={styles.srOnly}>フィルター</span>
              </button>
              <button onClick={handleAskQuestionClick} className={styles.askQuestionButton}>
                <img src="/icons/plus.svg" alt="" /> 質問する
              </button>
            </div>
          </div>
          
          <div className={styles.filtersContainer}>
            <div className={styles.tabsContainer}>
              <div className={styles.tabsList}>
                {TABS.map(tab => (
                    <button
                        key={tab.value}
                        className={`${styles.tabTrigger} ${activeTab === tab.value ? styles.tabTriggerActive : ''}`}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
              </div>
            </div>
            <div className={styles.sortContainer}>
              <select 
                className={styles.selectControl}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="latest">新着順</option>
                <option value="popular">人気順</option>
                <option value="unanswered">未回答</option>
              </select>
            </div>
          </div>

          <div className={styles.questionsGrid}>
            {displayedQuestions.length > 0 ? (
              displayedQuestions.map(q => (
                <div key={q.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderTop}>
                      <div>
                        <h2 className={styles.cardTitle}>
                          <a href={`/question/${q.id}`}>{q.title}</a>
                        </h2>
                        <div className={styles.cardTags}>
                          {q.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className={`${styles.rankBadge} ${q.authorRank === 'A' ? styles.rankBadgeA : styles.rankBadgeB}`}>
                        {q.authorRank}
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardSnippet}>{q.snippet}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardFooterInfo}>
                      <span>{q.authorName}</span>
                      <span>{q.timestamp}</span>
                    </div>
                    <div className={styles.cardFooterStats}>
                      <span>回答 {q.answerCount}件</span>
                      <span>閲覧 {q.viewCount}回</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>該当する質問はありません。</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}