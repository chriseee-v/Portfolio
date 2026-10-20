"use client";

import * as React from "react";
import { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface GalleryProject {
  id?: number;
  title: string;
  category: string;
  year: string;
  role?: string;
  description?: string;
  stack?: string[];
}

const ProjectCard = ({ project, onClick }: { project: GalleryProject; onClick?: (project: GalleryProject) => void }) => (
  <article onClick={() => onClick?.(project)} className="group flex h-[250px] w-full shrink-0 cursor-pointer flex-col justify-between overflow-hidden bg-card p-3 text-card-foreground transition-transform duration-300 hover:translate-x-1 hover:translate-y-1 sm:h-[320px] sm:p-4 md:h-[360px] md:p-5">
    <div>
      <div className="mb-3 flex items-center justify-between gap-2 pb-2 md:mb-4 md:pb-3">
        <span className="font-mono text-[10px] text-muted-foreground">{project.year}</span>
        <span className="bg-primary px-2 py-1 font-mono text-[10px] font-bold uppercase text-primary-foreground">{project.category}</span>
      </div>
      <h3 className="text-base font-bold uppercase leading-tight md:text-xl">{project.title}</h3>
      {project.description && <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground md:mt-3 md:line-clamp-3 md:text-sm">{project.description}</p>}
      {project.role && <div className="mt-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-foreground/60 md:mt-3 md:py-2 md:text-[10px]">{project.role}</div>}
    </div>
    <div>
      {project.stack && <div className="mb-2 flex flex-wrap gap-1">{project.stack.slice(0, 6).map((tech) => <span key={tech} className="border border-foreground/50 bg-muted px-1 py-0.5 font-mono text-[7px] uppercase tracking-wide md:px-1.5 md:py-1 md:text-[8px]">{tech}</span>)}</div>}
      <div className="pt-1 text-right font-mono text-[9px] text-muted-foreground md:pt-3 md:text-[10px]">→ VIEW</div>
    </div>
  </article>
);

export default function ParallaxProjectGallery({ projects = [], onProjectClick }: { projects?: GalleryProject[]; onProjectClick?: (project: GalleryProject) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, { stiffness: 100, damping: 20, mass: 0.5 });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const read = () => setIsMobile(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  const width = useTransform(progress, [0, 0.15], ["92%", "100%"]);
  const borderRadius = useTransform(progress, [0, 0.15], ["24px", "0px"]);
    const settleAt = isMobile ? 0.5 : 1;
    const rotateY = useTransform(progress, [0.15, settleAt], [-10, isMobile ? 0 : -2]);
    const rotateX = useTransform(progress, [0.15, settleAt], [6, isMobile ? 0 : 1]);
    const rotateZ = useTransform(progress, [0.15, settleAt], [3, 0]);
    const translateZ = useTransform(progress, [0.15, settleAt], [-100, 0]);
  const columns = useMemo(() => [0, 1, 2, 3].map((column) => {
    const base = projects.filter((_, index) => index % 4 === column);
      return base;
  }), [projects]);
  const visibleColumns = useMemo(() => columns.filter((column) => column.length > 0), [columns]);
  const isCompact = projects.length <= 2;
  const renderedColumns = isCompact ? visibleColumns : columns;
  const parallax = [
    useTransform(progress, [0.15, isMobile ? 0.5 : 1], ["0%", isMobile ? "0%" : "-15%"]),
    useTransform(progress, [0.15, isMobile ? 0.5 : 1], ["-15%", isMobile ? "0%" : "5%"]),
    useTransform(progress, [0.15, isMobile ? 0.5 : 1], ["0%", isMobile ? "0%" : "-15%"]),
    useTransform(progress, [0.15, isMobile ? 0.5 : 1], ["-10%", isMobile ? "0%" : "8%"]),
  ];

  const advanceFromInput = (delta: number) => {
    const next = Math.max(0, Math.min(1, rawProgress.get() + delta / 1400));
    rawProgress.set(next);
  };

  return (
    <section
      ref={containerRef}
      onWheel={(event) => advanceFromInput(event.deltaY)}
      onTouchStart={(event) => { touchStartRef.current = event.touches[0]?.clientY ?? null; }}
      onTouchMove={(event) => {
        const current = event.touches[0]?.clientY;
        if (current == null || touchStartRef.current == null) return;
        advanceFromInput(touchStartRef.current - current);
        touchStartRef.current = current;
      }}
      onTouchEnd={() => { touchStartRef.current = null; }}
      className="relative overflow-hidden bg-background text-foreground"
    >
      <div className={`flex w-full items-start justify-center overflow-hidden ${isCompact ? "" : "min-h-screen"}`}>
        <motion.div style={{ width, borderRadius }} className={`relative flex max-w-[1920px] flex-col items-stretch overflow-hidden bg-background ${isCompact ? "" : "min-h-screen"}`}>
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-background/30 via-transparent to-background/40" />
          <motion.div style={{ rotateX, rotateY, rotateZ, z: translateZ, transformStyle: "preserve-3d" }} className={`flex h-auto w-full flex-wrap content-start origin-center justify-start gap-2 pl-4 ${isCompact ? "pt-6" : "min-h-screen pt-32 md:w-max md:gap-5 md:pl-8 md:pt-40"}`}>
            {renderedColumns.map((column, columnIndex) => (
              <motion.div key={columnIndex} style={{ y: parallax[columnIndex] }} className={`flex h-auto min-w-0 flex-col justify-start gap-2 ${isCompact ? "w-full pr-4" : "w-[calc(50%_-_4px)] sm:w-[calc(50%_-_8px)] md:min-h-screen md:w-[19vw] md:min-w-[220px] md:gap-4"}`}>
                {column.map((project, index) => <ProjectCard key={`${columnIndex}-${index}-${project.id ?? project.title}`} project={project} onClick={onProjectClick} />)}
              </motion.div>
            ))}
          </motion.div>
          <div className="relative z-30 shrink-0 bg-background px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:px-8 md:py-4">Scroll to unfold</div>
        </motion.div>
      </div>
    </section>
  );
}
