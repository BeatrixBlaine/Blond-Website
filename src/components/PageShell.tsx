import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BRAND = "#9E8465";
const BG = "#FFF9F1";

function r(opacity: number) {
  return `rgba(158,132,101,${opacity})`;
}

interface PageShellProps {
  title: string;
  backTo: string;
  backLabel: string;
  children: ReactNode;
}

// header and page frame in the same look as the pre-order page
export default function PageShell({ title, backTo, backLabel, children }: PageShellProps) {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: BG, color: BRAND, minHeight: "100vh" }}>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: `rgba(255,249,241,0.96)`,
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${r(0.12)}`,
          boxShadow: `0 1px 12px ${r(0.06)}`,
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between" style={{ height: 68 }}>
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <ArrowLeft size={20} style={{ color: BRAND }} />
            <span className="text-sm tracking-[0.12em] uppercase" style={{ color: r(0.55) }}>
              {backLabel}
            </span>
          </button>
          <span className="text-sm tracking-[0.12em] uppercase" style={{ color: r(0.55) }}>
            {title}
          </span>
        </nav>
      </header>

      <div className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">{children}</div>
      </div>
    </div>
  );
}
