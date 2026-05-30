import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2, Circle, Trophy, TrendingUp, Calendar } from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";

export default function ProgressPage() {
  const { progress, courseCatalog, resetProgress, loading } = useProgressContext();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">加载中...</div>
      </div>
    );
  }

  if (!progress || !courseCatalog) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">数据加载失败</div>
      </div>
    );
  }

  const completedLessons = progress.completed_lessons.length;
  const completedQuizzes = progress.completed_quizzes.length;
  const totalLessons = progress.total_lessons;
  const totalQuizzes = progress.total_quizzes;
  const lessonPercent = progress.lesson_completion_rate;
  const quizPercent = progress.quiz_completion_rate;
  const avgScore = progress.average_score;

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">学习进度</h1>
        <p className="text-text-muted">追踪你的学习轨迹，见证每一步成长</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "已完成课程",
            value: `${completedLessons}/${totalLessons}`,
            sub: `${lessonPercent}%`,
            icon: CheckCircle2,
            color: "text-success",
            bg: "bg-success/20",
          },
          {
            label: "已完成测验",
            value: `${completedQuizzes}/${totalQuizzes}`,
            sub: `${quizPercent}%`,
            icon: Trophy,
            color: "text-secondary",
            bg: "bg-secondary/20",
          },
          {
            label: "平均得分",
            value: `${avgScore}`,
            sub: "分",
            icon: TrendingUp,
            color: "text-primary",
            bg: "bg-primary/20",
          },
          {
            label: "连续学习",
            value: `${progress.streak_days}`,
            sub: "天",
            icon: Calendar,
            color: "text-rose-400",
            bg: "bg-rose-500/20",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface rounded-2xl p-4 border border-surface-light"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-text-muted text-xs">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold">
              {stat.value}
              <span className="text-sm text-text-muted ml-1 font-normal">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chapter Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold mb-4">章节进度</h2>
        <div className="space-y-3">
          {courseCatalog.chapters.map((ch, i) => {
            const chCompleted = ch.lessons.filter((l) =>
              progress.completed_lessons.includes(l.id)
            ).length;
            const chPercent = ch.lessons.length > 0
              ? Math.round((chCompleted / ch.lessons.length) * 100)
              : 0;
            return (
              <div
                key={ch.id}
                className="bg-surface rounded-xl p-4 border border-surface-light"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-light rounded-lg flex items-center justify-center text-sm font-bold text-text-muted">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium">{ch.title}</div>
                      <div className="text-text-muted text-xs">
                        {chCompleted} / {ch.lessons.length} 课
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-primary">{chPercent}%</div>
                </div>
                <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${chPercent}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quiz Scores */}
      {completedQuizzes > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">测验成绩</h2>
          <div className="space-y-2">
            {courseCatalog.chapters.flatMap((ch) =>
              ch.lessons
                .filter((l) => l.quiz_id && progress.completed_quizzes.includes(l.quiz_id))
                .map((l) => {
                  const score = l.quiz_id ? progress.quiz_scores[l.quiz_id] ?? 0 : 0;
                  return (
                    <div
                      key={l.id}
                      className="flex items-center justify-between bg-surface rounded-xl p-4 border border-surface-light"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            score >= 80
                              ? "bg-success/20 text-success"
                              : score >= 60
                              ? "bg-secondary/20 text-secondary"
                              : "bg-danger/20 text-danger"
                          }`}
                        >
                          {score >= 60 ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{l.title}</div>
                          <div className="text-text-muted text-xs">{l.quiz_title || "测验"}</div>
                        </div>
                      </div>
                      <div
                        className={`font-bold ${
                          score >= 80
                            ? "text-success"
                            : score >= 60
                            ? "text-secondary"
                            : "text-danger"
                        }`}
                      >
                        {score}分
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </motion.div>
      )}

      {/* Reset */}
      <div className="border-t border-surface-light pt-6">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 text-text-muted hover:text-danger transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重置所有进度
          </button>
        ) : (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
            <p className="text-danger text-sm mb-3">
              确定要重置所有学习进度吗？此操作不可撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="bg-danger hover:bg-danger/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                确认重置
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-surface-light hover:bg-surface-light/80 text-text px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
