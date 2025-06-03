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
import MentorsPage from "./routes/mentor/MentorPage";

function AppContent() {
  const location = useLocation();

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
        <Route path="/mentor" element={<MentorsPage />} />
      </Routes>
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
