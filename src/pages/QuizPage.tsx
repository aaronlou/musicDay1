import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, Trophy, BookOpen } from "lucide-react";
import { getQuiz, submitQuiz as apiSubmitQuiz } from "@/api";
import type { QuizDto, QuestionDto } from "@/api/types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

function isCorrect(question: QuestionDto, answer: string | string[] | null): boolean {
  if (answer === null) return false;
  if (Array.isArray(question.correct_answer)) {
    const given = Array.isArray(answer) ? answer : [answer];
    return question.correct_answer.length === given.length &&
      question.correct_answer.every((c) => given.includes(c));
  }
  return answer === question.correct_answer;
}

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [quiz, setQuiz] = useState<QuizDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | string[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    setLoading(true);
    setError(null);
    getQuiz(quizId, language)
      .then((data) => {
        setQuiz(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
  }, [quizId, language]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">{t("common.loading")}</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-10 text-center text-text-muted">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{error || t("quiz.quizNotFound")}</p>
        <Link to="/learn" className="text-primary hover:underline mt-2 inline-block">
          {t("quiz.backToCourses")}
        </Link>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const correctCount = quiz.questions.filter((q) => isCorrect(q, userAnswers[q.id])).length;

  const handleSubmit = () => {
    if (selected === null) return;
    const currentAnswer = Array.isArray(selected)
      ? selected
      : (selected as string);
    setUserAnswers((prev) => ({ ...prev, [question.id]: currentAnswer }));
    setSubmitted(true);
  };

  const handleNext = async () => {
    if (selected !== null) {
      const currentAnswer = Array.isArray(selected) ? selected : (selected as string);
      setUserAnswers((prev) => ({ ...prev, [question.id]: currentAnswer }));
    }

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      const nextQ = quiz.questions[currentIndex + 1];
      setSelected(userAnswers[nextQ.id] ?? null);
      setSubmitted(userAnswers[nextQ.id] !== undefined);
    } else {
      if (!quizId) return;
      const submission = {
        quiz_id: quizId,
        answers: Object.entries(userAnswers).map(([question_id, answer]) => ({
          question_id,
          answer,
        })),
      };
      try {
        await apiSubmitQuiz(submission, language);
      } catch {
        // Backend submission is best-effort for analytics; local state is primary
      }
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setSubmitted(false);
    setUserAnswers({});
    setFinished(false);
  };

  const toggleMulti = (id: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : prev ? [prev as string] : [];
      if (arr.includes(id)) {
        return arr.filter((x) => x !== id);
      }
      return [...arr, id];
    });
  };

  if (finished) {
    const score = Math.round((correctCount / total) * 100);
    const passed = score >= 60;
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface rounded-2xl p-8 md:p-10 border border-surface-light text-center"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className={`w-10 h-10 ${passed ? "text-primary" : "text-text-muted"}`} />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {passed ? t("quiz.quizComplete") : t("quiz.keepGoing")}
          </h1>
          <p className="text-text-muted mb-6">
            {t("quiz.scoreSummary", { correct: correctCount, total })}
          </p>
          <div className="text-5xl font-bold text-primary mb-8">{score}%</div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 bg-surface-light hover:bg-surface-light/80 text-text px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t("quiz.retake")}
            </button>
            <button
              onClick={() => navigate("/learn")}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              {t("quiz.backToCourses")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("quiz.backToLesson")}
      </button>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">
            {t("quiz.questionProgress", { current: currentIndex + 1, total })}
          </span>
          <span className="text-sm text-text-muted">
            {t("quiz.correctCount", { count: correctCount })}
          </span>
        </div>
        <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-surface rounded-2xl p-6 md:p-8 border border-surface-light mb-6">
            <h2 className="text-xl font-bold mb-6">{question.question}</h2>

            {question.type === "truefalse" ? (
              <div className="grid grid-cols-2 gap-3">
                {["true", "false"].map((val) => {
                  const isSel = selected === val;
                  const showCorrect = submitted && val === question.correct_answer;
                  const showWrong = submitted && isSel && val !== question.correct_answer;
                  return (
                    <button
                      key={val}
                      onClick={() => !submitted && setSelected(val)}
                      disabled={submitted}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        showCorrect
                          ? "border-success bg-success/20 text-success"
                          : showWrong
                          ? "border-danger bg-danger/20 text-danger"
                          : isSel
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-surface-light bg-surface-light/50 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {showCorrect && <CheckCircle2 className="w-5 h-5" />}
                        {showWrong && <XCircle className="w-5 h-5" />}
                        {val === "true" ? t("quiz.true") : t("quiz.false")}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : question.type === "fillblank" ? (
              <div>
                <input
                  type="text"
                  value={(selected as string) ?? ""}
                  onChange={(e) => !submitted && setSelected(e.target.value)}
                  disabled={submitted}
                  placeholder={t("quiz.enterAnswer")}
                  className={`w-full p-4 rounded-xl border-2 bg-transparent outline-none transition-all ${
                    submitted
                      ? isCorrect(question, selected)
                        ? "border-success bg-success/10"
                        : "border-danger bg-danger/10"
                      : "border-surface-light focus:border-primary"
                  }`}
                />
                {submitted && (
                  <div
                    className={`mt-2 text-sm font-medium ${
                      isCorrect(question, selected) ? "text-success" : "text-danger"
                    }`}
                  >
                    {isCorrect(question, selected)
                      ? t("quiz.correct")
                      : t("quiz.correctAnswer", { answer: String(question.correct_answer) })}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {question.choices?.map((choice) => {
                  const isSel =
                    question.type === "multi"
                      ? Array.isArray(selected) && selected.includes(choice.id)
                      : selected === choice.id;
                  const isCorrectChoice =
                    question.type === "multi"
                      ? Array.isArray(question.correct_answer) &&
                        question.correct_answer.includes(choice.id)
                      : question.correct_answer === choice.id;
                  const showCorrect = submitted && isCorrectChoice;
                  const showWrong = submitted && isSel && !isCorrectChoice;

                  return (
                    <button
                      key={choice.id}
                      onClick={() =>
                        question.type === "multi"
                          ? toggleMulti(choice.id)
                          : !submitted && setSelected(choice.id)
                      }
                      disabled={submitted && question.type === "single"}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        showCorrect
                          ? "border-success bg-success/20"
                          : showWrong
                          ? "border-danger bg-danger/20"
                          : isSel
                          ? "border-primary bg-primary/20"
                          : "border-surface-light bg-surface-light/30 hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          showCorrect
                            ? "border-success"
                            : showWrong
                            ? "border-danger"
                            : isSel
                            ? "border-primary"
                            : "border-text-muted"
                        }`}
                      >
                        {isSel && question.type === "single" && (
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        )}
                        {isSel && question.type === "multi" && (
                          <div className="w-3 h-3 rounded-sm bg-primary" />
                        )}
                      </div>
                      <span className="flex-1">
                        {showCorrect && <CheckCircle2 className="w-4 h-4 inline text-success mr-2" />}
                        {showWrong && <XCircle className="w-4 h-4 inline text-danger mr-2" />}
                        {choice.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Explanation */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20"
              >
                <div className="font-bold text-primary mb-1">{t("quiz.explanation")}</div>
                <div className="text-sm text-text">{question.explanation}</div>
              </motion.div>
            )}
          </div>

          <div className="flex justify-end">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null || (Array.isArray(selected) && selected.length === 0)}
                className="bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                {t("common.submit")}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                {currentIndex < total - 1 ? t("common.next") : t("common.viewResults")}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
