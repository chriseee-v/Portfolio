import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface PageLayoutProps {
  children: ReactNode;
  showAccentBand?: boolean;
  accentPosition?: "left" | "right" | "center";
}

export const PageLayout = ({ 
  children, 
  showAccentBand = false,
  accentPosition = "right" 
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Accent Band */}
      {showAccentBand && (
        <div 
          className={`absolute top-0 bottom-0 w-1/3 bg-primary z-0 ${
            accentPosition === "left" ? "left-0" : 
            accentPosition === "right" ? "right-0" : 
            "left-1/3"
          }`}
        />
      )}
      
      {/* Main Content Card */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-8 py-4 md:py-6">
          <div className="flex-1 lab-card flex flex-col">
            <Navigation />
            <main className="flex-1 px-6 md:px-8 lg:px-12 pb-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
