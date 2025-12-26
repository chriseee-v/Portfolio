import { useState } from "react";
import { Send, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { sectionVariants, buttonHoverVariants } from "@/lib/motion";

// X (formerly Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/Chris-healthflex" },
  { icon: XIcon, label: "X", href: "https://x.com/chris___xo" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/itsmechris" },
  { icon: Mail, label: "Email", href: "mailto:thechris241103@gmail.com" },
];

const ConnectPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.3, triggerOnce: true });
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
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
      // Send email via API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      setIsSuccess(true);
      toast.success("Message sent! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
      
    } catch (error: any) {
      console.error('Error sending message:', error);
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
        className="mb-12 pt-8"
        variants={sectionVariants}
        initial="initial"
        animate={headerInView ? "animate" : "initial"}
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="lab-label">Get in Touch</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">OPEN FOR WORK</span>
        </div>
        <h1 className="lab-title mb-4">connect.</h1>
        <p className="text-muted-foreground max-w-2xl">
          Interested in AI, IoT, or full-stack development? Let's collaborate and build innovative solutions together.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              animate={errors.name ? { x: [0, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <label className="lab-label block mb-2">Name</label>
              <motion.input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                className={`w-full px-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-border focus:ring-primary/50"
                }`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                placeholder="Your name"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div
              animate={errors.email ? { x: [0, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <label className="lab-label block mb-2">Email</label>
              <motion.input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full px-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-border focus:ring-primary/50"
                }`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                placeholder="your@email.com"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div
              animate={errors.message ? { x: [0, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <label className="lab-label block mb-2">Message</label>
              <motion.textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: "" });
                }}
                className={`w-full px-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.message
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-border focus:ring-primary/50"
                }`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                placeholder="Tell me about your project..."
              />
              <AnimatePresence>
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button 
              type="submit" 
              className="lab-button-primary w-full flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="w-4 h-4" />
            </motion.button>
            
            {/* Success animation */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)"
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-600 dark:text-green-400 text-center"
                >
                  Message sent! I'll get back to you soon.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Info Side */}
        <div className="space-y-12">
          {/* Quick Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Bangalore, Karnataka</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <a href="mailto:thechris241103@gmail.com" className="text-foreground hover:text-primary transition-colors">
                thechris241103@gmail.com
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="lab-label mb-4">Find me online</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Mesh Visual */}
          <div className="relative h-48 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 p-6">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-primary/30"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    opacity: Math.random() * 0.5 + 0.2,
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs text-primary/60">CONNECTION_MESH</span>
            </div>
          </div>

          {/* Availability */}
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold">Currently Employed</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Software Development Engineer at Healthflex. Open to interesting opportunities and collaborations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
