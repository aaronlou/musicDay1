import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2, ArrowLeft, ArrowRight, Lightbulb, HelpCircle,
  BookOpen, Volume2, VolumeX, Image as ImageIcon, Wand2,
} from "lucide-react";
import { getLessonDetail, getNavigation } from "@/api";
import type { LessonDetailDto, NavigationDto } from "@/api/types";
import { useProgressContext } from "@/context/ProgressContext";
import AIChatPanel from "@/components/AIChatPanel";
import StaffSVG from "@/components/music/StaffSVG";
import ChordVisualizer from "@/components/music/ChordVisualizer";
import WaveAnimation from "@/components/music/WaveAnimation";
import ChordBuildAnimation from "@/components/music/ChordBuildAnimation";
import { useTTS } from "@/hooks/useTTS";
import { useImageGen } from "@/hooks/useImageGen";

// 解析课程内容中的特殊标记，渲染为可视化组件
function RichContent({
  paragraph,
  onImageGenerated,
}: {
  paragraph: string;
  onImageGenerated?: (url: string) => void;
}) {
  // [staff:notes] 标记 → 五线谱
  const staffMatch = paragraph.match(/\[staff:([^\]]+)\]/);
  if (staffMatch) {
    const notes = staffMatch[1].split(",").map((n) => ({
      pitch: n.trim(),
      type: "quarter" as const,
    }));
    return (
      <div className="my-4 bg-surface-light/50 rounded-xl p-4 border border-surface-light">
        <StaffSVG notes={notes} clef="treble" width={360} height={120} />
      </div>
    );
  }

  // [chord:root:quality] 标记 → 和弦构成图
  const chordMatch = paragraph.match(/\[chord:([^:]+):([^\]]+)\]/);
  if (chordMatch) {
    return (
      <div className="my-4">
        <ChordVisualizer root={chordMatch[1]} quality={chordMatch[2]} />
      </div>
    );
  }

  // [wave:freq] 标记 → 声波动画
  const waveMatch = paragraph.match(/\[wave:([\d.]+)\]/);
  if (waveMatch) {
    return (
      <div className="my-4">
        <WaveAnimation freq={parseFloat(waveMatch[1])} harmonics={4} />
      </div>
    );
  }

  // [build:notes:roles] 标记 → 和弦构成动画
  const buildMatch = paragraph.match(/\[build:([^:]+):([^\]]+)\]/);
  if (buildMatch) {
    const notes = buildMatch[1].split(",").map((n) => n.trim());
    const roles = buildMatch[2].split(",").map((r) => r.trim());
    return (
      <div className="my-4">
        <ChordBuildAnimation notes={notes} roles={roles} />
      </div>
    );
  }

  // [image:prompt] 标记 → AI 图片生成占位
  const imgMatch = paragraph.match(/\[image:([^\]]+)\]/);
  if (imgMatch) {
    return <AIImageBlock prompt={imgMatch[1]} onGenerated={onImageGenerated} />;
  }

  return <div className="text-text leading-relaxed whitespace-pre-line">{paragraph}</div>;
}

function AIImageBlock({
  prompt,
  onGenerated,
}: {
  prompt: string;
  onGenerated?: (url: string) => void;
}) {
  const { settings, generateImage, loading } = useImageGen();
  const [url, setUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    const result = await generateImage(
      `A clean, educational music theory illustration: ${prompt}. Minimalist style, white background, no text, suitable for a music learning app.`
    );
    if (result) {
      setUrl(result);
      onGenerated?.(result);
    }
  };

  if (url) {
    return (
      <div className="my-4 rounded-xl overflow-hidden border border-surface-light">
        <img src={url} alt={prompt} className="w-full object-cover" />
        <div className="text-xs text-text-muted px-3 py-1.5 bg-surface-light">AI 生成：{prompt}</div>
      </div>
    );
  }

  if (!settings.enabled || !settings.apiKey) {
    return (
      <div className="my-4 bg-surface-light/50 rounded-xl p-6 border border-surface-light text-center">
        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-text-muted" />
        <p className="text-sm text-text-muted mb-1">此处可生成 AI 配图：{prompt}</p>
        <Link to="/settings" className="text-primary text-xs hover:underline">
          在设置中启用 AI 图片生成 →
        </Link>
      </div>
    );
  }

  return (
    <div className="my-4 bg-surface-light/50 rounded-xl p-6 border border-surface-light text-center">
      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-text-muted" />
      <p className="text-sm text-text-muted mb-2">AI 配图：{prompt}</p>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
      >
        <Wand2 className="w-4 h-4" />
        {loading ? "生成中..." : "生成配图"}
      </button>
    </div>
  );
}

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { markLessonComplete, isLessonComplete } = useProgressContext();
  const { speak, stop, speaking, supported: ttsSupported } = useTTS();

  const [lesson, setLesson] = useState<LessonDetailDto | null>(null);
  const [navigation, setNavigation] = useState<NavigationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    setError(null);
    Promise.all([getLessonDetail(lessonId), getNavigation(lessonId)])
      .then(([lessonData, navData]) => {
        setLesson(lessonData);
        setNavigation(navData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
  }, [lessonId]);

  const completed = lessonId ? isLessonComplete(lessonId) : false;

  const handleComplete = async () => {
    if (!lessonId) return;
    await markLessonComplete(lessonId);
  };

  const handleSpeak = () => {
    if (speaking) {
      stop();
    } else if (lesson) {
      const text = [lesson.title, lesson.subtitle, ...lesson.content].join("。");
      speak(text, 1.1, 1.0);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">加载中...</div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="p-10 text-center text-text-muted">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{error || "课程不存在"}</p>
        <Link to="/learn" className="text-primary hover:underline mt-2 inline-block">
          返回课程列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link to="/learn" className="hover:text-primary transition-colors">
          课程
        </Link>
        <span>/</span>
        <span>{lesson.chapter_title}</span>
        <span>/</span>
        <span className="text-text">{lesson.title}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <div className="text-primary text-sm font-medium mb-2">
            {lesson.chapter_title} · 第 {lesson.order} 课
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-text-muted">{lesson.subtitle}</p>
            </div>
            {ttsSupported && (
              <button
                onClick={handleSpeak}
                className={`flex-shrink-0 p-2.5 rounded-lg transition-colors ${
                  speaking
                    ? "bg-primary/20 text-primary"
                    : "bg-surface-light text-text-muted hover:text-primary"
                }`}
                title={speaking ? "停止朗读" : "朗读课程内容"}
              >
                {speaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-surface rounded-2xl p-6 md:p-8 border border-surface-light mb-6">
          <div className="prose-content space-y-4">
            {lesson.content.map((paragraph, i) => (
              <RichContent key={i} paragraph={paragraph} />
            ))}
          </div>
        </div>

        {/* Tips */}
        {lesson.tips.length > 0 && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-secondary">学习小贴士</h3>
            </div>
            <ul className="space-y-2">
              {lesson.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text">
                  <span className="text-secondary mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quiz CTA */}
        {lesson.has_quiz && lesson.quiz_id && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-primary">本节测验</h3>
            </div>
            <p className="text-text-muted text-sm mb-4">
              通过 {lesson.quiz_question_count} 道题目检验你对本节内容的掌握程度
            </p>
            <Link
              to={`/quiz/${lesson.quiz_id}`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              开始测验
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-light">
          {navigation?.prev_lesson_id ? (
            <button
              onClick={() => navigate(`/lesson/${navigation.prev_lesson_id}`)}
              className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <div className="text-left hidden sm:block">
                <div className="text-xs">上一课</div>
                <div className="text-sm font-medium">{navigation.prev_lesson_title}</div>
              </div>
            </button>
          ) : (
            <div />
          )}

          {!completed ? (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 bg-success hover:bg-success/80 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              标记为已完成
            </button>
          ) : (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">已完成</span>
            </div>
          )}

          {navigation?.next_lesson_id ? (
            <button
              onClick={() => navigate(`/lesson/${navigation.next_lesson_id}`)}
              className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs">下一课</div>
                <div className="text-sm font-medium">{navigation.next_lesson_title}</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </motion.div>

      {/* AI Chat Panel */}
      {lessonId && (
        <AIChatPanel
          lessonId={lessonId}
          lessonTitle={lesson.title}
          chapterTitle={lesson.chapter_title}
          isOpen={chatOpen}
          onToggle={() => setChatOpen((v) => !v)}
        />
      )}
    </div>
  );
}
