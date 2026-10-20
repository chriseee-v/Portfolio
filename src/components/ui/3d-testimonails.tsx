import * as React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:34s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export interface ProjectMarqueeItem {
  id: number;
  title: string;
  role: string;
  year: string;
  category: string;
  description: string;
  stack: string[];
}

function ProjectMarqueeCard({ project, onClick }: { project: ProjectMarqueeItem; onClick: (project: ProjectMarqueeItem) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(project)}
      className="group block w-full rounded-sm border border-foreground/25 bg-card/55 p-4 text-card-foreground shadow-[5px_5px_0_hsl(var(--foreground)/0.35),inset_0_1px_0_hsl(0_0%_100%/0.24)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:bg-card/70 md:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-foreground/20 pb-3">
        <span className="font-mono text-[10px] text-muted-foreground">{project.year}</span>
        <span className="bg-primary px-2 py-1 font-mono text-[9px] font-bold uppercase text-primary-foreground">{project.category}</span>
      </div>
      <h3 className="text-base font-bold uppercase leading-tight md:text-lg">{project.title}</h3>
      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{project.description}</p>
      <div className="mt-3 border-t border-foreground/15 pt-3 font-mono text-[9px] font-bold uppercase tracking-wide text-foreground/60">{project.role}</div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 6).map((tech) => (
          <span key={tech} className="border border-foreground/40 bg-muted px-1.5 py-1 font-mono text-[8px] uppercase tracking-wide">{tech}</span>
        ))}
      </div>
      <div className="mt-3 border-t border-foreground/15 pt-3 text-right font-mono text-[9px] text-muted-foreground">→ VIEW</div>
    </button>
  );
}

function VerticalProjectColumn({ projects, onProjectClick, reverse = false }: { projects: ProjectMarqueeItem[]; onProjectClick: (project: ProjectMarqueeItem) => void; reverse?: boolean }) {
  const shouldAutoScroll = projects.length >= 3;
  const cards = shouldAutoScroll ? [...projects, ...projects] : projects;

  return (
    <div className="h-full min-h-0 overflow-hidden">
      <div
        className={cn(
          "flex flex-col gap-4 p-2",
          shouldAutoScroll && "animate-marquee-vertical-seamless",
          reverse && shouldAutoScroll && "[animation-direction:reverse]",
        )}
      >
        {cards.map((project, index) => (
          <ProjectMarqueeCard key={`${project.id}-${index}`} project={project} onClick={onProjectClick} />
        ))}
      </div>
    </div>
  );
}

export function ProjectsMarquee({ projects, onProjectClick }: { projects: ProjectMarqueeItem[]; onProjectClick: (project: ProjectMarqueeItem) => void }) {
  const uniqueProjects = Array.from(new Map(projects.map((project) => [project.id, project])).values());
  const columns = [0, 1, 2, 3].map((column) => uniqueProjects.filter((_, index) => index % 4 === column));

  return (
    <div className="relative h-[min(78vh,760px)] min-h-[34rem] w-full overflow-hidden bg-background [perspective:1000px]">
      <div className="absolute inset-0 grid grid-cols-1 gap-2 p-2 md:grid-cols-4 md:gap-3 md:p-3" style={{ transform: "translateZ(-40px) rotateX(5deg) rotateY(-4deg) rotateZ(1deg)", transformStyle: "preserve-3d" }}>
        <div className="h-full md:hidden">
          <VerticalProjectColumn projects={uniqueProjects} onProjectClick={onProjectClick} />
        </div>
        {columns.map((column, index) => (
          <div key={index} className="hidden h-full md:block">
            <VerticalProjectColumn projects={column} onProjectClick={onProjectClick} reverse={index % 2 === 1} />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/6 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/6 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export default Marquee;
