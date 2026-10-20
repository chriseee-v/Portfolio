import * as React from "react";
import { cn } from "@/lib/utils";

export type FolderFile = { name: string; meta?: string; art?: string };

export interface GlassFolderProps {
  label: string;
  meta?: string;
  tone?: "light" | "dark";
  files?: FolderFile[];
  className?: string;
  onFileSelect?: (file: FolderFile, index: number) => void;
}

export default function GlassFolder({
  label,
  meta,
  tone = "light",
  files = [],
  className,
  onFileSelect,
}: GlassFolderProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const dark = tone === "dark";

  React.useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative h-[285px] w-full max-w-[340px] [perspective:1200px]", className)}>
      <div className={cn("absolute inset-0 overflow-hidden rounded-[22px] transition-transform duration-700 [transform-style:preserve-3d]", dark ? "bg-[#080808]" : "bg-[#f7f7f5]", open ? "-rotate-x-6" : "group-hover:-rotate-x-3")}>
        <div className={cn("absolute inset-0 opacity-90", dark ? "bg-[radial-gradient(circle_at_20%_20%,#ff4d1f55,transparent_42%),linear-gradient(135deg,#080808,#242424)]" : "bg-[radial-gradient(circle_at_75%_20%,#ffffff,transparent_42%),linear-gradient(135deg,#f7f7f5,#ff4d1f22)]")} />
        <div className={cn("absolute inset-x-4 top-4 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] opacity-70", dark ? "text-white" : "text-black")}>
          <span>{label}</span><span>{meta ?? `${files.length} files`}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[190px] bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      <div className={cn("group absolute inset-0", open ? "z-30" : "z-10")} onMouseLeave={() => !open && setOpen(false)}>
        {files.slice(0, 4).map((file, index) => {
          const offset = index - (Math.min(files.length, 4) - 1) / 2;
          return (
            <button
              key={`${file.name}-${index}`}
              type="button"
              onClick={(event) => { event.stopPropagation(); if (open) onFileSelect?.(file, index); else setOpen(true); }}
              className={cn("absolute left-1/2 top-[52px] h-[145px] w-[72%] -translate-x-1/2 rounded-xl p-3 text-left shadow-[0_16px_28px_-16px_rgba(0,0,0,0.65)] transition-all duration-700", dark ? "bg-[#161616] text-white" : "bg-white text-black", "opacity-100")}
              style={{ transform: `translateX(calc(-50% + ${open ? offset * 42 : offset * 10}px)) translateY(${open ? -60 + offset * -48 : index * 7}px) rotate(${open ? offset * 5 : offset * 1.5}deg)`, zIndex: index + 1 }}
            >
              <span className={cn("block border-b pb-2 font-mono text-[10px] font-bold uppercase", dark ? "border-white/20 text-white" : "border-black/15 text-black")}>{file.name}</span>
              <span className={cn("mt-3 block text-[10px] leading-relaxed", dark ? "text-white/70" : "text-black/65")}>{file.meta ?? "Explore topic"}</span>
              <span className="absolute bottom-3 right-3 font-mono text-[8px] uppercase text-[#ff4d1f]">{open ? "Open →" : ""}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn("absolute inset-x-0 bottom-0 z-20 h-[150px] rounded-b-[22px] border p-5 text-left shadow-[0_-12px_30px_-18px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform duration-700", dark ? "border-white/40 bg-black/55 text-white" : "border-black/20 bg-white/60 text-black", open ? "-translate-y-5" : "group-hover:-translate-y-2")}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-60">{open ? "Open folder" : "Folder"}</span>
        <span className="mt-2 block text-xl font-semibold uppercase tracking-tight">{label}<span className="text-[#ff4d1f]">.</span></span>
        <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.18em] opacity-60">{open ? "Select a file" : "Click to open · Hover to lift"}</span>
      </button>
    </div>
  );
}
