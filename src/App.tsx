import { useEffect, useState } from 'react';
import MarkdownEditor from './routes/articles/create/ArticlesPage';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ArticlesListPage from './routes/articles/all/ArticlesListPage';
import ArticleDetailPage from './routes/articles/details/ArticleDetailPage';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:5000/hello');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <>
    <Router>
      <Routes>
        <Route path="/article" element={<ArticlesListPage />}/>
        <Route path="/article/:id" element={<ArticleDetailPage />}/>
        <Route path="/article/new" element={<MarkdownEditor />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
      <div>
          <h1>Paiza Project</h1>
          <p>{message}</p>
      </div>
    </>
  )
}

export default App
