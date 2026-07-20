import heroFigure from "@/assets/hero-figure.png";
import { ArrowRight, Download, ArrowUpRight } from "lucide-react";

const specRows = [
  { key: "ROLE", val: "Applied AI Engineer @ Healthflex" },
  { key: "FOCUS", val: "AI · IoT · Full Stack" },
  { key: "LOCATION", val: "Bangalore, India" },
  { key: "STATUS", val: "Open to Opportunities" },
];

const skillCols = [
  {
    label: "AI & Agents",
    speed: 28,
    items: [
      "LangChain / LangGraph",
      "Anthropic Claude API",
      "MCP SDK",
      "Gemini 2.0 Flash",
      "OpenAI SDK",
      "RAG Pipelines",
      "pgvector / Pinecone",
      "Agent Orchestration",
      "Tool Use & Function Calling",
      "Semantic Search",
      "Browserbase / Stagehand",
      "Trigger.dev Workflows",
      "Prompt Engineering",
      "Multimodal Models",
      "Embedding Models",
    ],
  },
  {
    label: "Full Stack",
    speed: 34,
    items: [
      "Next.js 15 App Router",
      "React 19",
      "TypeScript 5",
      "tRPC",
      "Drizzle ORM",
      "Prisma",
      "GraphQL / REST",
      "WebSockets",
      "Zod Validation",
      "TanStack Query",
      "Tailwind CSS",
      "Vite / Turborepo",
      "FastAPI",
      "Node.js / Hono",
      "PostgreSQL / Neon",
    ],
  },
  {
    label: "CV & IoT",
    speed: 22,
    items: [
      "OpenCV",
      "SAM 2 (Segment Anything)",
      "YOLOv8 / YOLOv11",
      "MediaPipe",
      "TensorFlow Lite",
      "Edge Impulse",
      "MQTT Protocol",
      "Raspberry Pi 5",
      "Arduino / ESP32",
      "I2C / SPI Protocols",
      "WebRTC Streams",
      "FFmpeg",
      "PIL / Pillow",
      "CUDA Inference",
      "Depth Estimation",
    ],
  },
  {
    label: "Cloud & DevOps",
    speed: 30,
    items: [
      "AWS (EC2, S3, Lambda)",
      "Vercel / Edge",
      "Docker Compose",
      "Kubernetes (k8s)",
      "GitHub Actions CI/CD",
      "Terraform IaC",
      "NGINX Reverse Proxy",
      "Redis Pub/Sub",
      "MongoDB Atlas",
      "Cloudflare Workers",
      "Prometheus / Grafana",
      "Supabase",
      "Clerk Auth",
      "Liveblocks",
      "Serverless Queues",
    ],
  },
];

const RoughUnderline = ({ color = "hsl(14 100% 55%)" }: { color?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 300 10"
    preserveAspectRatio="none"
    style={{ position: "absolute", bottom: "-8px", left: 0, width: "100%", height: "10px", overflow: "visible" }}
  >
    <path
      d="M2,6 C18,2 38,9 58,5 C78,1 98,8 120,4 C142,0 162,8 185,5 C208,2 228,8 252,5 C268,2 285,7 298,5"
      stroke={color}
      strokeWidth="2.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MePage = () => {
  return (
    <div className="-mx-6 md:-mx-10 lg:-mx-14 text-foreground">

      {/* ── Top Metadata Bar ── */}
      <div
        className="flex items-stretch font-mono text-xs"
        style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
      >
        <span
          className="hidden md:block px-4 py-2 text-muted-foreground"
          style={{ borderRight: "1px solid hsl(var(--foreground) / 0.25)" }}
        >
          APPLIED AI ENGINEER
        </span>
        <span
          className="hidden md:block px-4 py-2 text-muted-foreground"
          style={{ borderRight: "1px solid hsl(var(--foreground) / 0.25)" }}
        >
          BANGALORE, INDIA
        </span>
        <div className="ml-auto flex">
          <span
            className="px-4 py-2 text-primary font-bold"
            style={{ borderLeft: "1px solid hsl(var(--foreground) / 0.25)" }}
          >
            ■ AVAILABLE
          </span>
          <span
            className="px-4 py-2 text-muted-foreground"
            style={{ borderLeft: "1px solid hsl(var(--foreground) / 0.25)" }}
          >
            v2.0.25
          </span>
        </div>
      </div>

      {/* ── Main Hero Row ── */}
      <div className="flex" style={{ minHeight: "82vh" }}>

        {/* Orange Sidebar */}
        <div
          className="hidden lg:flex flex-col items-center justify-between py-8 px-0 bg-primary w-14 shrink-0"
          style={{ borderRight: "2px solid hsl(var(--foreground))" }}
        >
          <ArrowUpRight className="w-5 h-5 text-white" />
          <div className="flex-1 flex items-center justify-center">
            <span
              className="text-white font-bold text-[9px] uppercase tracking-[0.3em] whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              CHRIS THOMAS VARGHESE — APPLIED AI ENGINEER
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold text-white">001</span>
        </div>

        {/* ── Text Column ── */}
        <div
          className="flex-1 flex flex-col justify-between p-8 lg:p-12"
          style={{ borderRight: "2px solid hsl(var(--foreground))" }}
        >
          {/* Headline */}
          <div>
            <div className="relative inline-block mb-8">
              <h1
                className="font-bold lowercase leading-none text-foreground"
                style={{ fontSize: "clamp(5rem, 12vw, 9rem)", letterSpacing: "-0.04em" }}
              >
                lab<span className="text-primary">.</span>
              </h1>
              {/* Hand-drawn circle around the dot */}
              <svg
                aria-hidden="true"
                viewBox="0 0 60 60"
                style={{
                  position: "absolute",
                  right: "-8px",
                  bottom: "8px",
                  width: "52px",
                  height: "52px",
                  pointerEvents: "none",
                  opacity: 0.5,
                }}
              >
                <ellipse
                  cx="30" cy="30" rx="24" ry="20"
                  stroke="hsl(14 100% 55%)"
                  strokeWidth="1.8"
                  fill="none"
                  strokeDasharray="4 2"
                  transform="rotate(-8 30 30)"
                />
              </svg>
              {/* Sticky note above */}
              <div
                style={{
                  position: "absolute",
                  top: "-28px",
                  right: "-8px",
                  fontFamily: "var(--font-hand)",
                  fontSize: "0.7rem",
                  color: "hsl(var(--muted-foreground))",
                  transform: "rotate(2deg)",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                v2.0.25
              </div>
            </div>

            <div className="max-w-xs space-y-3 mb-10">
              <h2 className="text-lg font-bold uppercase tracking-tight text-foreground">
                Chris Thomas Varghese
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Software Development Engineer specializing in AI, IoT, and full-stack development.
                Building intelligent systems that bridge algorithms, embedded systems, and cloud infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="/projects" className="lab-button-primary">
                View Projects
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/Chris_Resume.pdf" download className="lab-button-outline">
                Download CV
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Spec Table */}
          <div className="mt-12 pt-0" style={{ borderTop: "2px solid hsl(var(--foreground))" }}>
            <div
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-0 py-2"
              style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.2)" }}
            >
              SPECIFICATION
            </div>
            {specRows.map((row) => (
              <div
                key={row.key}
                className="flex items-center py-2 gap-4"
                style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.15)" }}
              >
                <span className="font-mono text-[10px] text-muted-foreground uppercase w-24 shrink-0">
                  {row.key}
                </span>
                <div className="w-px h-3 bg-foreground opacity-20 shrink-0" />
                <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wide">
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Image Panel ── */}
        <div
          className="hidden lg:flex relative overflow-hidden shrink-0"
          style={{
            width: "440px",
            /* Match the photo's studio gray so edges dissolve cleanly */
            background: "hsl(0 0% 86%)",
            borderLeft: "4px solid hsl(var(--primary))",
          }}
        >
          {/* Hero image — fills panel, studio bg blends with panel color */}
          <img
            src={heroFigure}
            alt="Chris Thomas Varghese"
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "top center",
              filter: "contrast(1.08) saturate(1.1)",
            }}
          />

          {/* Corner registration marks */}
          {([
            { pos: "top-3 left-3", b: "border-l-2 border-t-2" },
            { pos: "top-3 right-3", b: "border-r-2 border-t-2" },
            { pos: "bottom-20 left-3", b: "border-l-2 border-b-2" },
            { pos: "bottom-20 right-3", b: "border-r-2 border-b-2" },
          ]).map(({ pos, b }, i) => (
            <div key={i} className={`absolute w-5 h-5 z-10 border-foreground/40 ${pos} ${b}`} />
          ))}

          {/* Serial stamp top center */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="font-mono text-[8px] text-foreground/35 uppercase tracking-[0.3em]">
              SERIAL — 001
            </span>
          </div>

          {/* Thin horizontal rule at ~30% */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{ top: "30%", left: "12px", right: "12px", height: "1px", background: "hsl(var(--foreground) / 0.12)" }}
          />

          {/* Callout: AI & ML — right side */}
          <div className="absolute z-10 flex items-center gap-2" style={{ top: "18%", right: "16px" }}>
            <span className="font-mono text-[7px] text-foreground/55 uppercase tracking-widest text-right leading-snug">
              AI &amp;<br />ML
            </span>
            <div style={{ width: "28px", height: "1px", background: "hsl(var(--foreground) / 0.35)" }} />
            <div className="w-[5px] h-[5px] bg-primary" />
          </div>

          {/* Callout: Cloud & DevOps — right side */}
          <div className="absolute z-10 flex items-center gap-2" style={{ top: "44%", right: "16px" }}>
            <span className="font-mono text-[7px] text-foreground/55 uppercase tracking-widest text-right leading-snug">
              Cloud &amp;<br />DevOps
            </span>
            <div style={{ width: "24px", height: "1px", background: "hsl(var(--foreground) / 0.35)" }} />
            <div className="w-[5px] h-[5px] bg-primary" />
          </div>

          {/* Callout: IoT & CV — left side */}
          <div className="absolute z-10 flex items-center gap-2" style={{ top: "58%", left: "16px" }}>
            <div className="w-[5px] h-[5px] bg-primary" />
            <div style={{ width: "24px", height: "1px", background: "hsl(var(--foreground) / 0.35)" }} />
            <span className="font-mono text-[7px] text-foreground/55 uppercase tracking-widest leading-snug">
              IoT &amp;<br />CV
            </span>
          </div>

          {/* Callout: Full Stack — left side */}
          <div className="absolute z-10 flex items-center gap-2" style={{ top: "74%", left: "16px" }}>
            <div className="w-[5px] h-[5px] bg-primary" />
            <div style={{ width: "24px", height: "1px", background: "hsl(var(--foreground) / 0.35)" }} />
            <span className="font-mono text-[7px] text-foreground/55 uppercase tracking-widest leading-snug">
              Full<br />Stack
            </span>
          </div>

          {/* Handwritten annotation — "that's me btw" */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{ bottom: "60px", left: "-90px", transform: "rotate(-4deg)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: "0.95rem",
                color: "hsl(var(--foreground) / 0.55)",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              that&apos;s me btw →
            </span>
          </div>

          {/* Orange bottom bar */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 bg-primary flex items-center justify-between px-4"
            style={{ height: "44px", borderTop: "2px solid hsl(var(--foreground))" }}
          >
            <span className="font-mono text-[9px] font-bold text-white uppercase tracking-[0.25em]">ENGINEER</span>
            <span className="font-mono text-[9px] font-bold text-white uppercase tracking-[0.25em]">2025</span>
          </div>
        </div>
      </div>

      {/* ── Marquee Strip ── */}
      <div
        className="overflow-hidden py-3 bg-primary"
        style={{
          borderTop: "2px solid hsl(var(--foreground))",
          borderBottom: "2px solid hsl(var(--foreground))",
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="font-mono text-sm font-bold uppercase tracking-widest text-white mx-8">
              AI — Full Stack — IoT — Cloud — Computer Vision — Open Source —
            </span>
          ))}
        </div>
      </div>

      {/* ── Skills / Capabilities — Scrolling Columns ── */}
      <div>
        {/* Column headers */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {skillCols.map((col, i) => (
            <div
              key={col.label}
              className="px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider bg-foreground text-background"
              style={{
                borderRight: i < skillCols.length - 1 ? "2px solid hsl(var(--background))" : "none",
              }}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Scrolling ticker columns */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 overflow-hidden"
          style={{ height: "220px", borderBottom: "2px solid hsl(var(--foreground))" }}
        >
          {skillCols.map((col, colIdx) => (
            <div
              key={col.label}
              className="overflow-hidden relative"
              style={{
                borderRight: colIdx < skillCols.length - 1 ? "1px solid hsl(var(--foreground) / 0.15)" : "none",
              }}
            >
              {/* Fade masks top/bottom */}
              <div
                className="absolute inset-x-0 top-0 z-10 pointer-events-none"
                style={{ height: "36px", background: "linear-gradient(to bottom, hsl(var(--background)), transparent)" }}
              />
              <div
                className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
                style={{ height: "36px", background: "linear-gradient(to top, hsl(var(--background)), transparent)" }}
              />

              {/* Scrolling content — duplicated for seamless loop */}
              <div
                style={{
                  animation: `scroll-col-${colIdx} ${col.speed}s linear infinite`,
                  willChange: "transform",
                }}
              >
                {[...col.items, ...col.items].map((item, i) => (
                  <div
                    key={i}
                    className="px-6 py-[10px] group cursor-default transition-colors duration-150 hover:bg-primary"
                    style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.1)" }}
                  >
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mission Statement ── */}
      <div
        className="grid lg:grid-cols-[3.5rem_1fr]"
        style={{ borderTop: "2px solid hsl(var(--foreground))" }}
      >
        {/* Black sidebar label */}
        <div
          className="hidden lg:flex items-center justify-center py-8 bg-foreground"
          style={{ borderRight: "2px solid hsl(var(--foreground))" }}
        >
          <span
            className="font-bold text-[9px] uppercase tracking-[0.25em] text-background whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            MISSION STATEMENT
          </span>
        </div>

        {/* Statement */}
        <div className="px-8 md:px-14 py-14">
          <p
            className="font-bold uppercase leading-tight text-foreground"
            style={{ fontSize: "clamp(1.6rem, 4vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            Building{" "}
            <span className="rough-underline text-primary">
              intelligent systems
              <RoughUnderline />
            </span>{" "}
            that combine AI, IoT, and cloud to solve real-world problems.
          </p>
          <p
            className="mt-6 text-muted-foreground"
            style={{
              fontFamily: "var(--font-hand)",
              fontSize: "1.1rem",
              transform: "rotate(-0.8deg)",
              display: "inline-block",
              marginLeft: "2px",
            }}
          >
            — yeah, i actually built all of this ↑
          </p>
        </div>
      </div>

    </div>
  );
};

export default MePage;
