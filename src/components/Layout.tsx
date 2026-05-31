import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, BarChart3, Piano, Music, Guitar, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/learn", label: t("nav.courses"), icon: BookOpen },
    { path: "/piano", label: t("nav.piano"), icon: Piano },
    { path: "/guitar", label: t("nav.guitar"), icon: Guitar },
    { path: "/progress", label: t("nav.progress"), icon: BarChart3 },
    { path: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 md:w-56 flex-shrink-0 bg-surface border-r border-surface-light flex flex-col">
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-surface-light">
          <Music className="w-6 h-6 text-primary" />
          <span className="hidden md:block ml-2 font-bold text-lg">MusicDay1</span>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center md:justify-start md:px-4 mx-2 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-primary/20 text-primary"
                    : "text-text-muted hover:bg-surface-light hover:text-text"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:block ml-3 text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-surface-light text-center text-xs text-text-muted hidden md:block">
          MusicDay1 v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
