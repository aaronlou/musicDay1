import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Learn from "@/pages/Learn";
import LessonPage from "@/pages/LessonPage";
import QuizPage from "@/pages/QuizPage";
import ProgressPage from "@/pages/ProgressPage";
import PianoTool from "@/pages/PianoTool";
import GuitarTool from "@/pages/GuitarTool";
import Settings from "@/pages/Settings";
import { ProgressProvider } from "@/context/ProgressContext";

function App() {
  return (
    <ProgressProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/piano" element={<PianoTool />} />
          <Route path="/guitar" element={<GuitarTool />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </ProgressProvider>
  );
}

export default App;
