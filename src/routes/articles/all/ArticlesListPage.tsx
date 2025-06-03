import React, { useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import { useArticlesWithCategories } from '../../../hooks/useArticle';
import type { Article } from '../../../types/articleType';

const dummyArticles = [
  {
    id: '1',
    title: 'ReactでMarkdownエディターを作る方法',
    summary: 'Reactとmarkedライブラリを使ってMarkdownエディターを簡単に作る方法を紹介します。',
    tags: ['React', 'Markdown', 'フロントエンド'],
    date: '2025-05-25',
  },
  {
    id: '2',
    title: 'FlaskでAPIを作成してみよう',
    summary: 'Flaskを使って簡単なREST APIを構築し、Reactフロントエンドと連携させる方法を学びます。',
    tags: ['Flask', 'API', 'バックエンド'],
    date: '2025-05-20',
  },
];

const uniqueTags = [...new Set(dummyArticles.flatMap((a) => a.tags))];

const ArticlesListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [page, setPage] = useState(1);
  const articlesPerPage = 5;
  const { articles } = useArticlesWithCategories();

  const filteredArticles = articles
    .filter((article:Article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.categories.some((tag) => tag.category_name.toLowerCase().includes(search.toLowerCase()))
    )
  .filter((article: Article) =>
      filterTag ? article.categories.some((tag) => tag.category_name === filterTag) : true
  )

  const paginatedArticles = filteredArticles.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <h1>技術記事一覧</h1>

      <input
        type="text"
        placeholder="記事検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '16px' }}
      />

      <div style={{ marginBottom: '16px' }}>
        <strong>タグフィルター:</strong>
        {uniqueTags.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => setFilterTag(tag === filterTag ? '' : tag)}
            style={{
              marginLeft: '8px',
              padding: '4px 8px',
              background: tag === filterTag ? '#2c963f' : '#eee',
              color: tag === filterTag ? '#fff' : '#333',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            #{tag}
          </button>
        ))}
      </div>

      {paginatedArticles.map((article) => (
        <ArticleCard
          key={article.article_id}
          {...article}
        />
      ))}

      <div style={{ marginTop: '16px' }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{ marginRight: '8px' }}
        >
          前へ
        </button>
        <button
          onClick={() =>
            setPage((p) =>
              p * articlesPerPage < filteredArticles.length ? p + 1 : p
            )
          }
          disabled={page * articlesPerPage >= filteredArticles.length}
        >
          次へ
        </button>
        <span style={{ marginLeft: '16px' }}>ページ: {page}</span>
      </div>
    </div>
  );
};

export default ArticlesListPage;
