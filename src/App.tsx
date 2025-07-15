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
import MentorApplyPage from "./routes/mentor/apply/MentorApplyPage";
import NotificationsPage from "./routes/notification/NotificationPage";
import NotificationSettingsPage from "./routes/notification/NotificationSettingsPage";
import TopPage from "./routes/top/TopPage";
import Mypage from "./routes/mypage/Mypage";
import SkillCheckPage from "./routes/skillcheck/SkillCheckPage";
import QuestionsPage from "./routes/question/QuestionsPage";
import QuestionDetailPage from "./routes/question/id/QuestionDetailPage";
import NewQuestionPage from "./routes/question/newquestion/NewQuestionPage";
import ProblemDetailPage from "./routes/skillcheck/id/ProblemDetailPage";
import MentorApplicationsPage from "./routes/mentor/applications/MentorApplicationsPage";
import MentorSchedulePage from "./routes/mentor/schedule/MentorSchedulePage";
import NewSchedulePage from "./routes/mentor/schedule/new/NewSchedulePage";
import MeetingDetailPage from "./routes/mentor/schedule/id/MeetingDetailPage";
import MeetingRoomPage from "./routes/meeting/MeetingRoomPage";
import ProfilePage from "./routes/profile/ProfilePage";
import { Footer } from "./components/footer/Footer";
import { LineConnect } from "./routes/auth/line/Lineconnect";

function AppContent() {
  const location = useLocation();

  const hideNavigation =
    location.pathname.startsWith("/auth/signin") ||
    location.pathname.startsWith("/auth/signup");

  return (
    <>
      {!hideNavigation && <Header />}
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/article" element={<ArticlesListPage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/article/new" element={<MarkdownEditor />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/auth/signin" element={<SigninPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/mentor" element={<MentorsPage />} />
        <Route
          path="/mentor/applications"
          element={<MentorApplicationsPage />}
        />
        <Route path="/mentor/schedule" element={<MentorSchedulePage />} />
        <Route path="/mentor/schedule/new" element={<NewSchedulePage />} />
        <Route path="/mentor/schedule/:id" element={<MeetingDetailPage />} />
        <Route path="/meeting/:id" element={<MeetingRoomPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/chats/:id" element={<IndividualChatPage />} />
        <Route path="/group/:id" element={<GroupChatPage />} />
        <Route path="/partner/setup" element={<UchinoKoSetupPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/mentor/apply/:id" element={<MentorApplyPage />} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route
          path="/notifications/settings"
          element={<NotificationSettingsPage />}
        />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/question" element={<QuestionsPage />} />
        <Route path="/question/:id" element={<QuestionDetailPage />} />
        <Route path="/question/new" element={<NewQuestionPage />} />
        <Route path="/skillcheck" element={<SkillCheckPage />} />
        <Route path="/skillcheck/:id" element={<ProblemDetailPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/line/connect" element={<LineConnect />} />
      </Routes>
      {!hideNavigation && <Footer />}
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
