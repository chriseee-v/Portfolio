import { useEffect, useState } from "react";
import { portfolioApi, type Experience } from "@/lib/api";

const TimelinePage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await portfolioApi.getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        // Fallback to empty array if API fails
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);
  return (
    <div>
      {/* Header */}
      <div className="mb-16 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="lab-label">Career Path</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">{experiences.length} NODES</span>
        </div>
        <h1 className="lab-title mb-4">timeline.</h1>
        <p className="text-muted-foreground max-w-2xl">
          A visual history of experiments, roles, and continuous evolution in tech.
        </p>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading experiences...</div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No experiences found.</div>
      ) : (
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
            <div
              key={index}
              className={`relative flex flex-col md:flex-row items-start gap-8 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Node */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 -translate-y-0">
                <div className={`w-4 h-4 rounded-full border-4 border-card ${
                  exp.highlight ? "bg-primary" : "bg-muted"
                }`}>
                  {exp.highlight && (
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                  )}
                </div>
              </div>

              {/* Year Label */}
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"} pl-12 md:pl-0`}>
                <div className="inline-block">
                  <span className="font-mono text-2xl font-bold text-primary">{exp.year}</span>
                </div>
              </div>

              {/* Content Card */}
              <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                <div className="p-6 rounded-xl border border-border hover:border-primary/30 transition-colors bg-card/50">
                  <h3 className="text-lg font-semibold mb-1">{exp.title}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tech-tag text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <section className="mt-20 pt-12 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "3+", label: "Years Experience" },
            { value: "15+", label: "Projects Delivered" },
            { value: "30+", label: "Technologies" },
            { value: "∞", label: "Innovation" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TimelinePage;
