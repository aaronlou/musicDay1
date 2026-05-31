import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Piano, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { courseCatalog, progress, loading } = useProgressContext();
  const { t } = useTranslation();

  const totalLessons = progress?.total_lessons ?? 0;
  const completedCount = progress?.completed_lessons.length ?? 0;
  const percent = progress?.lesson_completion_rate ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-secondary" />
          <span className="text-secondary text-sm font-medium">{t("home.tagline")}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          {t("home.titleStart")}
          <span className="text-primary">{t("home.titleHighlight")}</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          {courseCatalog?.description}
        </p>
      </motion.div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-surface rounded-2xl p-6 mb-8 border border-surface-light"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{t("home.progressTitle")}</h2>
            <p className="text-text-muted text-sm mt-1">
              {t("home.progressSubtitle", { count: completedCount, total: totalLessons })}
              {progress && progress.streak_days > 0 && t("home.streak", { days: progress.streak_days })}
            </p>
          </div>
          <div className="text-3xl font-bold text-primary">{percent}%</div>
        </div>
        <div className="w-full h-3 bg-surface-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            {completedCount === 0 ? t("home.startLearning") : t("home.continueLearning")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/progress"
            className="inline-flex items-center gap-2 bg-surface-light hover:bg-surface-light/80 text-text px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            {t("home.viewDetails")}
          </Link>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link
          to="/learn"
          className="group bg-surface rounded-2xl p-6 border border-surface-light hover:border-primary/50 transition-all"
        >
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">{t("home.featureCourses")}</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {t("home.featureCoursesDesc", {
              chapters: courseCatalog?.chapters.length ?? 0,
              lessons: totalLessons,
            })}
          </p>
        </Link>

        <Link
          to="/piano"
          className="group bg-surface rounded-2xl p-6 border border-surface-light hover:border-primary/50 transition-all"
        >
          <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
            <Piano className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="font-bold text-lg mb-2">{t("home.featurePiano")}</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {t("home.featurePianoDesc")}
          </p>
        </Link>

        <Link
          to="/progress"
          className="group bg-surface rounded-2xl p-6 border border-surface-light hover:border-primary/50 transition-all"
        >
          <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-success/30 transition-colors">
            <BarChart3 className="w-6 h-6 text-success" />
          </div>
          <h3 className="font-bold text-lg mb-2">{t("home.featureQuiz")}</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {t("home.featureQuizDesc")}
          </p>
        </Link>
      </motion.div>

      {/* Course Overview */}
      {courseCatalog && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10"
        >
          <h2 className="text-xl font-bold mb-4">{t("home.overviewTitle")}</h2>
          <div className="space-y-3">
            {courseCatalog.chapters.map((ch, i) => (
              <div
                key={ch.id}
                className="flex items-center gap-4 bg-surface rounded-xl p-4 border border-surface-light"
              >
                <div className="w-10 h-10 bg-surface-light rounded-lg flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{ch.title}</h3>
                  <p className="text-text-muted text-sm truncate">{ch.description}</p>
                </div>
                <div className="text-text-muted text-sm flex-shrink-0">
                  {ch.lesson_count} {t("common.lesson")}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
