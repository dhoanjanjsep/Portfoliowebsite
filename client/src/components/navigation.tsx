import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gaming-dark/90 backdrop-blur-md border-b border-gaming-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-mono font-bold gradient-text">GameDev.Kim</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="hover:text-gaming-primary transition-colors"
            >
              소개
            </button>
            <button 
              onClick={() => scrollToSection('games')}
              className="hover:text-gaming-primary transition-colors"
            >
              게임
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="hover:text-gaming-primary transition-colors"
            >
              프로젝트
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="hover:text-gaming-primary transition-colors"
            >
              개발 로그
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="hover:text-gaming-primary transition-colors"
            >
              연락처
            </button>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-gaming-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gaming-dark/95 backdrop-blur-md border-b border-gaming-light">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-2 hover:text-gaming-primary hover:bg-gaming-light/20 rounded transition-colors"
            >
              소개
            </button>
            <button 
              onClick={() => scrollToSection('games')}
              className="block w-full text-left px-4 py-2 hover:text-gaming-primary hover:bg-gaming-light/20 rounded transition-colors"
            >
              게임
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left px-4 py-2 hover:text-gaming-primary hover:bg-gaming-light/20 rounded transition-colors"
            >
              프로젝트
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="block w-full text-left px-4 py-2 hover:text-gaming-primary hover:bg-gaming-light/20 rounded transition-colors"
            >
              개발 로그
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 hover:text-gaming-primary hover:bg-gaming-light/20 rounded transition-colors"
            >
              연락처
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
