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
import ChatsPage from "./routes/chats/ChatsPage";
import IndividualChatPage from "./routes/chats/userChat/UserChatPage";
import GroupChatPage from "./routes/chats/groupChat/GroupChatPage";
import UchinoKoSetupPage from "./routes/partner/setup/PartnerSetupPage";
import PartnerPage from "./routes/partner/PartnerPage";

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
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/chats/:id" element={<IndividualChatPage />} />
        <Route path="/group/:id" element={<GroupChatPage />}/>
        <Route path="/partner/setup" element={<UchinoKoSetupPage />} />
        <Route path="/partner" element={<PartnerPage />} />
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
