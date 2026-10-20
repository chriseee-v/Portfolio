import * as React from "react";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  title: string;
  image: string;
  href?: string;
}

interface WorksWheelProps extends React.ComponentPropsWithoutRef<"section"> {
  items: WorksWheelItem[];
  label?: string;
  action?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function WorksWheel({ items, label = "Works '26", action = "View", className, ...props }: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const target = React.useRef(0);
  const turn = React.useRef(0);
  const drag = React.useRef<number | null>(null);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const draw = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const compact = width < 640;
      const cardWidth = Math.min(width * (compact ? 0.48 : 0.34), height * (compact ? 0.46 : 0.38) * 1.45);
      const cardHeight = cardWidth / 1.45;
      const progress = clamp(turn.current, 0, 1);
      const position = Math.max(0, turn.current - 1);
      const radius = cardHeight * 2.22;
      const count = Math.max(items.length, 1);
      turn.current += (target.current - turn.current) * 0.12;
      if (Math.abs(target.current - turn.current) < 0.0005) turn.current = target.current;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const distance = index - position;
        const drumDegrees = distance * 40;
        const ringDegrees = distance * (360 / count);
        const ring = 1 - progress;
        const bow = -cardHeight * 1.82 * (1 - Math.cos((drumDegrees * Math.PI) / 180));
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.style.marginLeft = `${-cardWidth / 2}px`;
        card.style.marginTop = `${-cardHeight / 2}px`;
        card.style.transform = `translateX(${progress * bow}px) rotateZ(${ring * ringDegrees}deg) translateY(${-ring * cardHeight * 1.14}px) rotateX(${progress * drumDegrees}deg) translateZ(${progress * radius}px)`;
        card.style.opacity = progress > 0.5 && Math.abs(distance) > 1.6 ? "0" : "1";
        card.style.zIndex = String(Math.round(100 - Math.abs(distance) * 2));
      });
      setActive((current) => {
        const next = clamp(Math.round(position), 0, Math.max(items.length - 1, 0));
        return current === next ? current : next;
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [items.length]);

  const move = React.useCallback((next: number) => {
    target.current = clamp(next, 0, items.length);
  }, [items.length]);

  return (
    <section aria-label={label} className={cn("relative h-[min(78vh,680px)] min-h-[32rem] w-full overflow-hidden bg-background text-foreground select-none", className)} {...props}>
      <div
        ref={stageRef}
        tabIndex={0}
        className="absolute inset-0 cursor-grab touch-pan-x outline-none active:cursor-grabbing"
        style={{ perspective: "1200px" }}
        onWheel={(event) => { event.preventDefault(); move(target.current + event.deltaY / 900); }}
        onPointerDown={(event) => { drag.current = event.clientY; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={(event) => { if (drag.current === null) return; move(target.current + (drag.current - event.clientY) / 420); drag.current = event.clientY; }}
        onPointerUp={() => { drag.current = null; move(Math.round(target.current)); }}
        onKeyDown={(event) => { if (event.key === "ArrowDown") move(Math.round(target.current) + 1); if (event.key === "ArrowUp") move(Math.round(target.current) - 1); }}
      >
        <div className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
          {items.map((item, index) => (
            <a
              key={item.title}
              ref={(node) => { cardsRef.current[index] = node; }}
              href={item.href}
              aria-label={item.title}
              className="group absolute left-0 top-0 block [backface-visibility:hidden]"
            >
              <span className="relative block size-full overflow-hidden bg-card shadow-[0_18px_40px_-18px_hsl(var(--foreground)/0.5)]">
                <img src={item.image} alt={item.title} draggable={false} className="size-full object-cover" />
                <span className="pointer-events-none absolute inset-x-2 bottom-2 bg-background/80 px-2 py-1 text-[9px] font-mono uppercase text-foreground opacity-0 backdrop-blur-sm transition group-hover:opacity-100">{action} →</span>
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center text-[clamp(1.25rem,4vw,3rem)] font-bold uppercase tracking-tight">{label}<span className="text-primary">.</span></div>
      <div className="pointer-events-none absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:left-8">Scroll / drag to explore</div>
      <ol className="absolute right-4 top-5 hidden text-right font-mono text-[9px] uppercase leading-6 text-muted-foreground md:right-8 md:top-8 md:block">
        {items.map((item, index) => <li key={item.title} className={index === active ? "text-foreground" : undefined}>{item.title}</li>)}
      </ol>
    </section>
  );
}

export default WorksWheel;
