import { useState, useEffect } from "react";
import { Save, LogOut, Plus, Trash2, ChevronDown, ChevronUp, Github, CheckCircle, AlertCircle, Loader2, Eye, EyeOff, RefreshCw } from "lucide-react";
import projectsData from "@/data/projects.json";
import experiencesData from "@/data/experiences.json";
import blogsData from "@/data/blogs.json";
import { commitFile, validateToken } from "@/lib/github-cms";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "thechris241103@gmail.com";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "";
const SESSION_KEY = "lab_admin_session";

// GitHub config â€” baked in at build time via .env.local
const ENV_GH_TOKEN = import.meta.env.VITE_GH_TOKEN || "";
const ENV_GH_OWNER = import.meta.env.VITE_GH_OWNER || "";
const ENV_GH_REPO  = import.meta.env.VITE_GH_REPO  || "";

const ghToken = () => ENV_GH_TOKEN || localStorage.getItem("cms_gh_token") || "";
const ghOwner = () => ENV_GH_OWNER || localStorage.getItem("cms_gh_owner") || "";
const ghRepo  = () => ENV_GH_REPO  || localStorage.getItem("cms_gh_repo")  || "";
const ghConfigured = () => !!ghToken() && !!ghOwner() && !!ghRepo();

type Project = {
  id: number;
  title: string;
  role: string;
  year: string;
  status?: string;
  startedAt?: string;
  stack: string[];
  category: string;
  description: string;
  longDescription?: string;
  features?: string[];
  url?: string;
  github?: string;
};

// â”€â”€â”€ Data Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Experience = {
  year: string;
  title: string;
  company: string;
  description?: string;
  technologies?: string[];
  highlight?: boolean;
};
type BlogPost = {
  id: number;
  title: string;
  date: string;
  readTime: string;
  tags?: string[];
  summary?: string;
  url?: string;
};

// â”€â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setError("Wrong email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div style={{ width: "100%", maxWidth: "360px" }}>
        {/* Header */}
        <div className="mb-8" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Portfolio CMS
          </span>
          <h1 className="text-3xl font-bold lowercase mt-1 mb-3">
            admin<span className="text-primary">.</span>
          </h1>
        </div>

        <form onSubmit={submit} className="space-y-0">
          <div style={{ border: "2px solid hsl(var(--foreground))" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-background font-mono text-sm focus:outline-none"
              style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
              autoComplete="email"
            />
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-background font-mono text-sm focus:outline-none pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="font-mono text-xs text-red-500 pt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 lab-button-primary justify-center"
          >
            Sign In
          </button>
        </form>

        <p className="font-mono text-[10px] text-muted-foreground mt-6 text-center uppercase tracking-widest">
          Only {ADMIN_EMAIL} can access this panel
        </p>
      </div>
    </div>
  );
}

// â”€â”€â”€ GitHub Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function GitHubSettings({ onClose }: { onClose: () => void }) {
  const [token, setToken] = useState(() => ghToken());
  const [owner, setOwner] = useState(() => ghOwner());
  const [repo, setRepo] = useState(() => ghRepo());
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem("cms_gh_token", token);
    localStorage.setItem("cms_gh_owner", owner);
    localStorage.setItem("cms_gh_repo", repo);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4">
      <div
        className="bg-background w-full max-w-md"
        style={{ border: "2px solid hsl(var(--foreground))", boxShadow: "6px 6px 0 hsl(var(--foreground))" }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            <span className="font-mono text-sm font-bold uppercase tracking-widest">GitHub Settings</span>
          </div>
          <button onClick={onClose} className="font-mono text-xs text-muted-foreground hover:text-foreground">âœ•</button>
        </div>

        <div className="p-5 space-y-0" style={{ border: "none" }}>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-4">
            Changes commit directly to your repo â†’ Vercel auto-redeploys.
            Use a fine-grained PAT with Contents write on this repo only.
          </p>

          {[
            { label: "GitHub Token (ghp_... or github_pat_...)", key: "token", value: token, set: setToken, type: "password" },
            { label: "GitHub Owner (username or org)", key: "owner", value: owner, set: setOwner, type: "text" },
            { label: "Repo Name", key: "repo", value: repo, set: setRepo, type: "text" },
          ].map((f) => (
            <div key={f.key} style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-4 pt-3 pb-1">
                {f.label}
              </label>
              <input
                type={f.type}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="w-full px-4 pb-3 bg-background font-mono text-sm focus:outline-none"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button onClick={save} className="lab-button-primary flex-1 justify-center text-sm">
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save"}
            </button>
            <button onClick={onClose} className="lab-button-outline px-4 text-sm">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Project Editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProjectEditor({
  project,
  onChange,
  onDelete,
}: {
  project: Project;
  onChange: (p: Project) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  const update = (key: keyof Project, value: unknown) =>
    onChange({ ...project, [key]: value });

  return (
    <div
      className="mb-4"
      style={{
        border: `2px solid ${project.status === "in-progress" ? "hsl(var(--primary))" : "hsl(var(--foreground))"}`,
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        style={{ borderBottom: open ? "2px solid hsl(var(--foreground))" : "none" }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 min-w-0">
          {project.status === "in-progress" && (
            <span className="font-mono text-[8px] bg-primary text-white px-2 py-0.5 uppercase tracking-widest shrink-0">
              â— LIVE
            </span>
          )}
          <span className="font-bold uppercase text-sm truncate">{project.title || "Untitled"}</span>
          <span className="font-mono text-[10px] text-muted-foreground shrink-0">{project.year}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          {/* Basic fields */}
          <div className="grid grid-cols-2 gap-3">
            {(["title", "role", "year", "category"] as const).map((key) => (
              <div key={key}>
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">{key}</label>
                <input
                  type="text"
                  value={(project[key] as string) || ""}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none"
                  style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
                />
              </div>
            ))}
          </div>

          {/* Status toggle */}
          <div className="flex items-center gap-3">
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Status</label>
            <button
              onClick={() => update("status", project.status === "in-progress" ? undefined : "in-progress")}
              className={`font-mono text-xs px-3 py-1 uppercase tracking-widest transition-colors ${
                project.status === "in-progress"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            >
              {project.status === "in-progress" ? "â— In Progress" : "Completed"}
            </button>
            {project.status === "in-progress" && (
              <input
                type="date"
                value={project.startedAt ? project.startedAt.slice(0, 10) : ""}
                onChange={(e) => update("startedAt", e.target.value ? `${e.target.value}T00:00:00Z` : undefined)}
                className="px-2 py-1 bg-background font-mono text-xs focus:outline-none"
                style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Description</label>
            <textarea
              value={project.description || ""}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none resize-y"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            />
          </div>

          {/* Long description */}
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Long Description</label>
            <textarea
              value={project.longDescription || ""}
              onChange={(e) => update("longDescription", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none resize-y"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            />
          </div>

          {/* Stack */}
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              value={project.stack?.join(", ") || ""}
              onChange={(e) => update("stack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-3">
            {(["url", "github"] as const).map((key) => (
              <div key={key}>
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">{key} URL</label>
                <input
                  type="url"
                  value={project[key] || ""}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none"
                  style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Experience Editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ExperienceEditor({
  experience,
  onChange,
  onDelete,
}: {
  experience: Experience;
  onChange: (e: Experience) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const update = (key: keyof Experience, value: unknown) =>
    onChange({ ...experience, [key]: value });

  return (
    <div
      className="mb-4"
      style={{
        border: `2px solid ${experience.highlight ? "hsl(var(--primary))" : "hsl(var(--foreground))"}`,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        style={{ borderBottom: open ? "2px solid hsl(var(--foreground))" : "none" }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 min-w-0">
          {experience.highlight && (
            <span className="font-mono text-[8px] bg-primary text-white px-2 py-0.5 uppercase tracking-widest shrink-0">
              â— LIVE
            </span>
          )}
          <span className="font-bold uppercase text-sm truncate">{experience.title || "Untitled"}</span>
          <span className="font-mono text-[10px] text-muted-foreground shrink-0">{experience.year}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(["year", "title", "company"] as const).map((key) => (
              <div key={key}>
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">{key}</label>
                <input
                  type="text"
                  value={(experience[key] as string) || ""}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none"
                  style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Highlight</label>
            <button
              onClick={() => update("highlight", !experience.highlight)}
              className={`font-mono text-xs px-3 py-1 uppercase tracking-widest transition-colors ${
                experience.highlight ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            >
              {experience.highlight ? "Yes" : "No"}
            </button>
          </div>

          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Description</label>
            <textarea
              value={experience.description || ""}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none resize-y"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            />
          </div>

          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              value={experience.technologies?.join(", ") || ""}
              onChange={(e) =>
                update("technologies", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
              }
              className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Blog Editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BlogEditor({
  post,
  onChange,
  onDelete,
}: {
  post: BlogPost;
  onChange: (p: BlogPost) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const update = (key: keyof BlogPost, value: unknown) =>
    onChange({ ...post, [key]: value });

  return (
    <div
      className="mb-4"
      style={{ border: "2px solid hsl(var(--foreground))" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        style={{ borderBottom: open ? "2px solid hsl(var(--foreground))" : "none" }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-bold uppercase text-sm truncate">{post.title || "Untitled"}</span>
          <span className="font-mono text-[10px] text-muted-foreground shrink-0">{post.id}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(["id", "title", "date", "readTime"] as const).map((key) => (
              <div key={key}>
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">{key}</label>
                <input
                  type={key === "id" ? "number" : "text"}
                  value={(post[key] as string | number | undefined) ?? ""}
                  onChange={(e) =>
                    update(key, key === "id" ? Number(e.target.value) : e.target.value)
                  }
                  className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none"
                  style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={post.tags?.join(", ") || ""}
              onChange={(e) =>
                update("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
              }
              className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            />
          </div>

          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Summary</label>
            <textarea
              value={post.summary || ""}
              onChange={(e) => update("summary", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none resize-y"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            />
          </div>

          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">URL</label>
            <input
              type="url"
              value={post.url || ""}
              onChange={(e) => update("url", e.target.value)}
              className="w-full px-3 py-2 bg-background font-mono text-sm focus:outline-none"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.4)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Main Admin Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<"projects" | "timeline" | "blog">("projects");
  const [projects, setProjects] = useState<Project[]>(() => projectsData as Project[]);
  const [experiences, setExperiences] = useState<Experience[]>(() => experiencesData as Experience[]);
  const [blogs, setBlogs] = useState<BlogPost[]>(() => blogsData as BlogPost[]);
  const [showGHSettings, setShowGHSettings] = useState(false);
  const [pushStatus, setPushStatus] = useState<"idle" | "pushing" | "success" | "error">("idle");
  const [pushMsg, setPushMsg] = useState("");


  const addProject = () => {
    const newId = Math.max(0, ...projects.map((p) => p.id)) + 1;
    setProjects([
      {
        id: newId,
        title: "New Project",
        role: "",
        year: new Date().getFullYear().toString(),
        stack: [],
        category: "AI",
        description: "",
      },
      ...projects,
    ]);
  };

  const pushProjects = async () => {
    if (!ghConfigured()) {
      setShowGHSettings(true);
      return;
    }

    setPushStatus("pushing");
    setPushMsg("Committing to GitHubâ€¦");

    const content = JSON.stringify(projects, null, 2) + "\n";
    const result = await commitFile(
      ghToken(),
      ghOwner(),
      ghRepo(),
      "src/data/projects.json",
      content,
      "cms: update projects"
    );

    if (result.ok) {
      setPushStatus("success");
      setPushMsg("Pushed! Vercel is rebuildingâ€¦");
    } else {
      setPushStatus("error");
      setPushMsg(result.error || "Push failed");
    }

    setTimeout(() => { setPushStatus("idle"); setPushMsg(""); }, 5000);
  };

  const pushExperiences = async () => {
    if (!ghConfigured()) {
      setShowGHSettings(true);
      return;
    }

    setPushStatus("pushing");
    setPushMsg("Committing to GitHubâ€¦");

    const content = JSON.stringify(experiences, null, 2) + "\n";
    const result = await commitFile(
      ghToken(),
      ghOwner(),
      ghRepo(),
      "src/data/experiences.json",
      content,
      "cms: update experiences / timeline"
    );

    if (result.ok) {
      setPushStatus("success");
      setPushMsg("Pushed! Vercel is rebuildingâ€¦");
    } else {
      setPushStatus("error");
      setPushMsg(result.error || "Push failed");
    }

    setTimeout(() => { setPushStatus("idle"); setPushMsg(""); }, 5000);
  };

  const pushBlogs = async () => {
    if (!ghConfigured()) {
      setShowGHSettings(true);
      return;
    }

    setPushStatus("pushing");
    setPushMsg("Committing to GitHubâ€¦");

    const content = JSON.stringify(blogs, null, 2) + "\n";
    const result = await commitFile(
      ghToken(),
      ghOwner(),
      ghRepo(),
      "src/data/blogs.json",
      content,
      "cms: update blog posts"
    );

    if (result.ok) {
      setPushStatus("success");
      setPushMsg("Pushed! Vercel is rebuildingâ€¦");
    } else {
      setPushStatus("error");
      setPushMsg(result.error || "Push failed");
    }

    setTimeout(() => { setPushStatus("idle"); setPushMsg(""); }, 5000);
  };

  const addExperience = () => {
    setExperiences([
      {
        year: new Date().getFullYear().toString(),
        title: "New Experience",
        company: "",
        description: "",
        technologies: [],
        highlight: false,
      },
      ...experiences,
    ]);
  };

  const addBlog = () => {
    const newId = Math.max(0, ...blogs.map((b) => b.id)) + 1;
    setBlogs([
      {
        id: newId,
        title: "New Blog Post",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        readTime: "5 min",
        tags: [],
        summary: "",
        url: "",
      },
      ...blogs,
    ]);
  };

  const activePush =
    section === "projects"
      ? pushProjects
      : section === "timeline"
      ? pushExperiences
      : pushBlogs;

  return (
    <div className="min-h-screen bg-background">
      {showGHSettings && <GitHubSettings onClose={() => setShowGHSettings(false)} />}

      {/* Top bar */}
      <div
        className="flex items-stretch"
        style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
      >
        <div className="px-6 py-3 flex items-center gap-3" style={{ borderRight: "2px solid hsl(var(--foreground))" }}>
          <span className="font-bold text-lg lowercase">lab<span className="text-primary">.</span></span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">cms</span>
        </div>

        <div className="flex-1 flex items-center px-6 gap-2">
          {pushStatus === "idle" && (
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {section === "projects"
                ? `${projects.length} projects`
                : section === "timeline"
                ? `${experiences.length} experiences`
                : `${blogs.length} posts`}{" "}
              Â· {ghConfigured() ? `${ghOwner()}/${ghRepo()}` : "GitHub not configured"}
            </span>
          )}
          {pushStatus === "pushing" && (
            <span className="font-mono text-[10px] text-primary flex items-center gap-1.5 uppercase tracking-widest">
              <Loader2 className="w-3 h-3 animate-spin" /> {pushMsg}
            </span>
          )}
          {pushStatus === "success" && (
            <span className="font-mono text-[10px] text-green-600 flex items-center gap-1.5 uppercase tracking-widest">
              <CheckCircle className="w-3 h-3" /> {pushMsg}
            </span>
          )}
          {pushStatus === "error" && (
            <span className="font-mono text-[10px] text-red-500 flex items-center gap-1.5 uppercase tracking-widest">
              <AlertCircle className="w-3 h-3" /> {pushMsg}
            </span>
          )}
        </div>

        <div className="flex">
          <button
            onClick={() => setShowGHSettings(true)}
            className="px-4 flex items-center gap-2 font-mono text-xs hover:bg-foreground hover:text-background transition-colors"
            style={{ borderLeft: "2px solid hsl(var(--foreground))" }}
            title="GitHub Settings"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </button>
          <button
            onClick={activePush}
            disabled={pushStatus === "pushing"}
            className="px-4 flex items-center gap-2 font-mono text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ borderLeft: "2px solid hsl(var(--foreground))" }}
          >
            {pushStatus === "pushing" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : pushStatus === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Push Live</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ borderLeft: "2px solid hsl(var(--foreground))" }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

       {/* Section tabs */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex gap-0 mb-0" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
          {[
            { key: "projects", label: "Projects" },
            { key: "timeline", label: "Timeline" },
            { key: "blog", label: "Blog" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setSection(t.key as "projects" | "timeline" | "blog")}
              className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
                section === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-foreground hover:text-background"
              }`}
              style={{ borderRight: "2px solid hsl(var(--foreground))" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

       {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold uppercase tracking-tight text-xl">
            {section === "projects" ? "Projects" : section === "timeline" ? "Timeline / Experiences" : "Blog Posts"}
          </h2>
          <button
            onClick={() => {
              if (section === "projects") addProject();
              else if (section === "timeline") addExperience();
              else addBlog();
            }}
            className="lab-button-primary text-sm"
          >
            <Plus className="w-4 h-4" />
            {section === "projects" ? "Add Project" : section === "timeline" ? "Add Experience" : "Add Blog Post"}
          </button>
        </div>

        {section === "projects" &&
          projects.map((p) => (
            <ProjectEditor
              key={p.id}
              project={p}
              onChange={(updated) =>
                setProjects(projects.map((x) => (x.id === updated.id ? updated : x)))
              }
              onDelete={() => setProjects(projects.filter((x) => x.id !== p.id))}
            />
          ))}

        {section === "timeline" &&
          experiences.map((exp, index) => (
            <ExperienceEditor
              key={index}
              experience={exp}
              onChange={(updated) =>
                setExperiences(experiences.map((x, i) => (i === index ? updated : x)))
              }
              onDelete={() => setExperiences(experiences.filter((_, i) => i !== index))}
            />
          ))}

        {section === "blog" &&
          blogs.map((post) => (
            <BlogEditor
              key={post.id}
              post={post}
              onChange={(updated) =>
                setBlogs(blogs.map((x) => (x.id === updated.id ? updated : x)))
              }
              onDelete={() => setBlogs(blogs.filter((x) => x.id !== post.id))}
            />
          ))}

        {/* Push CTA at bottom */}
        <div className="pt-6 flex gap-4 items-center" style={{ borderTop: "2px solid hsl(var(--foreground))" }}>
          <button
            onClick={activePush}
            disabled={pushStatus === "pushing"}
            className="lab-button-primary disabled:opacity-50"
          >
            {pushStatus === "pushing" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Push to Live Portfolio
          </button>
          {!ghConfigured() && (
            <span className="font-mono text-xs text-muted-foreground">
              Configure GitHub first
            </span>
          )}
        </div>
      </div>
    </div>

  );
}

// â”€â”€â”€ Entry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const AdminPage = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminPanel onLogout={logout} />;
};

export default AdminPage;
