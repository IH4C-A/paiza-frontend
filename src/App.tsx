import { useEffect, useState } from "react";
import MarkdownEditor from "./routes/articles/create/ArticlesPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Header } from "./components/header/Header";
import ArticlesListPage from "./routes/articles/all/ArticlesListPage";
import ArticleDetailPage from "./routes/articles/details/ArticleDetailPage";
import { SigninPage } from "./routes/auth/signin/SigninPage";
import { SignupPage } from "./routes/auth/signup/SignupPage";

function AppContent() {
  const location = useLocation();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch("http://localhost:5000/hello");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
  }, []);

  const hideHeader =
    location.pathname.startsWith("/auth/signin") ||
    location.pathname.startsWith("/auth/signup");

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/article" element={<ArticlesListPage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/article/new" element={<MarkdownEditor />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/auth/signin" element={<SigninPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
      </Routes>
      <div>
        <h1>Paiza Project</h1>
        <p>{message}</p>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
