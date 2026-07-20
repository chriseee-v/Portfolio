import { useState } from "react";
import { Send, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/Chris-healthflex" },
  { icon: XIcon, label: "X", href: "https://x.com/chris___xo" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/itsmechris" },
  { icon: Mail, label: "Email", href: "mailto:thechris241103@gmail.com" },
];

const inputClass =
  "w-full px-4 py-3 bg-background font-mono text-sm focus:outline-none transition-all duration-150";
const inputStyle = { border: "2px solid hsl(var(--foreground))" };
const inputFocusStyle = { border: "2px solid hsl(var(--primary))", boxShadow: "3px 3px 0px hsl(var(--primary))" };

const ConnectPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.3, triggerOnce: true });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
      }

      if (!response.ok) throw new Error(data.error || "Failed to send message");

      setIsSuccess(true);
      toast.success("Message sent! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
      setErrors({ submit: error.message || "Failed to send message" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        ref={headerRef}
        className="pt-10"
        style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div
          className="flex items-stretch"
          style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
        >
          <span className="lab-label px-0 py-3 self-center">Get in Touch</span>
          <div className="flex-1" />
          <span
            className="font-mono text-xs text-primary font-bold px-4 py-3 self-center"
            style={{ borderLeft: "2px solid hsl(var(--foreground))" }}
          >
            OPEN FOR WORK
          </span>
        </div>
        <h1 className="lab-title py-4">connect<span className="text-primary">.</span></h1>
        <p className="text-muted-foreground max-w-2xl pb-6 text-sm">
          Interested in AI, IoT, or full-stack development? Let's collaborate and build innovative solutions together.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-0 mt-0" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
        {/* Contact Form */}
        <div
          className="p-8"
          style={{ borderRight: "2px solid hsl(var(--foreground))" }}
        >
          <div
            className="font-mono text-xs uppercase tracking-widest font-bold pb-3 mb-6"
            style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
          >
            Send a Message
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <motion.div
              animate={errors.name ? { x: [0, -8, 8, -8, 0] } : {}}
              transition={{ duration: 0.35 }}
            >
              <label className="lab-label block mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: "" }); }}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                className={inputClass}
                style={focused === "name" ? inputFocusStyle : errors.name ? { border: "2px solid hsl(var(--destructive))" } : inputStyle}
                placeholder="Your name"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-destructive text-xs mt-1 font-mono"
                  >
                    ✕ {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div
              animate={errors.email ? { x: [0, -8, 8, -8, 0] } : {}}
              transition={{ duration: 0.35 }}
            >
              <label className="lab-label block mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className={inputClass}
                style={focused === "email" ? inputFocusStyle : errors.email ? { border: "2px solid hsl(var(--destructive))" } : inputStyle}
                placeholder="your@email.com"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-destructive text-xs mt-1 font-mono"
                  >
                    ✕ {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Message */}
            <motion.div
              animate={errors.message ? { x: [0, -8, 8, -8, 0] } : {}}
              transition={{ duration: 0.35 }}
            >
              <label className="lab-label block mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => { setFormData({ ...formData, message: e.target.value }); if (errors.message) setErrors({ ...errors, message: "" }); }}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                className={`${inputClass} resize-none`}
                style={focused === "message" ? inputFocusStyle : errors.message ? { border: "2px solid hsl(var(--destructive))" } : inputStyle}
                placeholder="Tell me about your project..."
              />
              <AnimatePresence>
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-destructive text-xs mt-1 font-mono"
                  >
                    ✕ {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <button
              type="submit"
              className="lab-button-primary w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 font-mono text-sm text-center"
                  style={{ border: "2px solid hsl(var(--primary))", boxShadow: "3px 3px 0px hsl(var(--primary))" }}
                >
                  ✓ Message sent! I'll get back to you soon.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Info Side */}
        <div className="p-8 space-y-8">
          <div
            className="font-mono text-xs uppercase tracking-widest font-bold pb-3 mb-6"
            style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
          >
            Contact Info
          </div>

          {/* Quick Info */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-4 py-4 px-0"
              style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.2)" }}
            >
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span className="font-mono text-sm">Bangalore, Karnataka</span>
            </div>
            <div
              className="flex items-center gap-4 py-4 px-0"
              style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.2)" }}
            >
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <a
                href="mailto:thechris241103@gmail.com"
                className="font-mono text-sm hover:text-primary transition-colors"
              >
                thechris241103@gmail.com
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="lab-label mb-4">Find me online</h3>
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
                    style={{ border: "2px solid hsl(var(--foreground))", boxShadow: "2px 2px 0px hsl(var(--foreground))" }}
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div
            className="p-5"
            style={{ border: "2px solid hsl(var(--primary))", boxShadow: "4px 4px 0px hsl(var(--primary))" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 animate-pulse" style={{ border: "1px solid hsl(var(--foreground))" }} />
              <span className="font-bold uppercase text-sm tracking-wider">Currently Employed</span>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              SDE @ Healthflex. Open to interesting opportunities and collaborations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
