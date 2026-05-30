import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Play, ChevronRight } from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";

const chapterColors = [
  "from-rose-500/20 to-orange-500/20",
  "from-emerald-500/20 to-teal-500/20",
  "from-blue-500/20 to-indigo-500/20",
  "from-violet-500/20 to-purple-500/20",
  "from-amber-500/20 to-yellow-500/20",
];

export default function Learn() {
  const { courseCatalog, accessibility, loading } = useProgressContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">加载中...</div>
      </div>
    );
  }

  if (!courseCatalog) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">课程数据加载失败</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">学习路径</h1>
        <p className="text-text-muted">
          按顺序完成课程，逐步建立完整的乐理知识体系
        </p>
      </motion.div>

      <div className="space-y-6">
        {courseCatalog.chapters.map((chapter, chIdx) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: chIdx * 0.1 }}
          >
            <div
              className={`rounded-2xl bg-surface border border-surface-light overflow-hidden`}
            >
              <div
                className={`p-5 bg-gradient-to-r ${chapterColors[chIdx % chapterColors.length]} border-b border-surface-light`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold">
                    {chIdx + 1}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{chapter.title}</h2>
                    <p className="text-text-muted text-sm">{chapter.description}</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-surface-light">
                {chapter.lessons.map((lesson) => {
                  const acc = accessibility?.find((a) => a.lesson_id === lesson.id);
                  const completed = acc?.completed ?? false;
                  const accessible = acc?.accessible ?? false;

                  return accessible ? (
                    <Link
                      key={lesson.id}
                      to={`/lesson/${lesson.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-surface-light/50 transition-colors group"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          completed
                            ? "bg-success/20 text-success"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {lesson.title}
                        </div>
                        <div className="text-text-muted text-sm truncate">
                          {lesson.subtitle}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  ) : (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 p-4 opacity-50 cursor-not-allowed"
                    >
                      <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-text-muted text-sm truncate">
                          {lesson.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
