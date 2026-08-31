import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'

const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const CategoryPage = lazy(() =>
  import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })),
)
const QuestionPage = lazy(() =>
  import('./pages/QuestionPage').then((m) => ({ default: m.QuestionPage })),
)
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const FatedFivePage = lazy(() =>
  import('./pages/FatedFivePage').then((m) => ({ default: m.FatedFivePage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })),
)
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
)
const VerifyEmailPage = lazy(() =>
  import('./pages/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })),
)
const ResetPasswordPage = lazy(() =>
  import('./pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
const ContestListPage = lazy(() =>
  import('./pages/ContestListPage').then((m) => ({ default: m.ContestListPage })),
)
const ContestPage = lazy(() =>
  import('./pages/ContestPage').then((m) => ({ default: m.ContestPage })),
)
const CreateQuestPage = lazy(() =>
  import('./pages/CreateQuestPage').then((m) => ({ default: m.CreateQuestPage })),
)
const PublicProfilePage = lazy(() =>
  import('./pages/PublicProfilePage').then((m) => ({ default: m.PublicProfilePage })),
)
const UserQuestPage = lazy(() =>
  import('./pages/UserQuestPage').then((m) => ({ default: m.UserQuestPage })),
)
const LeaderboardPage = lazy(() =>
  import('./pages/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })),
)
const CommunityPage = lazy(() =>
  import('./pages/CommunityPage').then((m) => ({ default: m.CommunityPage })),
)
const QuestsPage = lazy(() =>
  import('./pages/QuestsPage').then((m) => ({ default: m.QuestsPage })),
)
const RivalPage = lazy(() =>
  import('./pages/RivalPage').then((m) => ({ default: m.RivalPage })),
)
const ChangelogPage = lazy(() =>
  import('./pages/ChangelogPage').then((m) => ({ default: m.ChangelogPage })),
)
const DeveloperPage = lazy(() =>
  import('./pages/DeveloperPage').then((m) => ({ default: m.DeveloperPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const DailyPage = lazy(() =>
  import('./pages/DailyPage').then((m) => ({ default: m.DailyPage })),
)
const TutorialPage = lazy(() =>
  import('./pages/TutorialPage').then((m) => ({ default: m.TutorialPage })),
)
const NotesListPage = lazy(() =>
  import('./pages/NotesListPage').then((m) => ({ default: m.NotesListPage })),
)
const NoteEditorPage = lazy(() =>
  import('./pages/NoteEditorPage').then((m) => ({ default: m.NoteEditorPage })),
)
const NoteViewerPage = lazy(() =>
  import('./pages/NoteViewerPage').then((m) => ({ default: m.NoteViewerPage })),
)
function PageFallback() {
  return <div className="py-12 text-center font-code text-lg text-ink-dim">Loading…</div>
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route
            path="/category/:categorySlug/question/:questionId"
            element={<QuestionPage />}
          />
          <Route path="/fated-five" element={<FatedFivePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/api" element={<Navigate to="/developer" replace />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<Navigate to="/contact" replace />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          {/* Legacy redirects */}
          <Route path="/enterprise" element={<Navigate to="/" replace />} />
          <Route path="/b2b" element={<Navigate to="/" replace />} />
          <Route path="/business" element={<Navigate to="/" replace />} />
          <Route path="/refund" element={<Navigate to="/quests" replace />} />
          <Route path="/realms" element={<Navigate to="/" replace />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/blog" element={<Navigate to="/" replace />} />
          <Route path="/blog/:slug" element={<Navigate to="/" replace />} />
          <Route path="/roadmap" element={<Navigate to="/" replace />} />
          <Route path="/advanced" element={<Navigate to="/" replace />} />
          <Route path="/advanced/:questionId" element={<Navigate to="/" replace />} />
          <Route path="/contest" element={<ContestListPage />} />
          <Route path="/contest-list" element={<Navigate to="/contest" replace />} />
          <Route path="/notes" element={<NotesListPage />} />
          <Route path="/notes/new" element={<NoteEditorPage />} />
          <Route path="/notes/:id/edit" element={<NoteEditorPage />} />
          <Route path="/notes/:id" element={<NoteViewerPage />} />
          <Route path="/note/:id" element={<NoteViewerPage />} />
          <Route path="/notebooks" element={<Navigate to="/notes" replace />} />
          <Route path="/notebook" element={<Navigate to="/notes" replace />} />
          <Route path="/create" element={<CreateQuestPage />} />
          <Route path="/create/:questId" element={<CreateQuestPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rival/:rivalId" element={<RivalPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Public profiles and user quests: after all static routes */}
          <Route path="/:username" element={<PublicProfilePage />} />
          <Route path="/:username/:questSlug" element={<UserQuestPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* Full-viewport workspace outside constrained Layout */}
        <Route path="/contest/:contestId" element={<ContestPage />} />
        <Route path="/learn" element={<TutorialPage />} />
        <Route path="/learn/:lessonId" element={<TutorialPage />} />
        <Route path="/tutorial" element={<Navigate to="/learn" replace />} />
        <Route path="/tutorial/:lessonId" element={<TutorialPage />} />
        <Route path="/docs" element={<Navigate to="/learn" replace />} />
        <Route path="/rust-tutorial" element={<Navigate to="/learn" replace />} />
      </Routes>
    </Suspense>
  )
}
