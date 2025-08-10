import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar, Code, Gamepad2, Smartphone, Headset } from "lucide-react";

export function ProjectGallery() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  // Mock data for display since no projects exist yet
  const mockProjects = [
    {
      id: "1",
      title: "Cyber Runner 3D",
      description: "사이버펑크 세계관의 러닝 게임으로, 플레이어는 네온 도시를 달리며 장애물을 피하고 아이템을 수집합니다.",
      category: "3D",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["Unity", "C#", "3D"],
      platform: "PC",
      date: "2024.01",
      createdAt: new Date()
    },
    {
      id: "2",
      title: "Fantasy Quest",
      description: "중세 판타지 배경의 RPG 게임으로, 퀘스트 시스템과 캐릭터 성장 요소를 포함한 본격적인 롤플레잉 게임입니다.",
      category: "RPG",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["Unity", "C#", "RPG"],
      platform: "PC",
      date: "2023.11",
      createdAt: new Date()
    },
    {
      id: "3",
      title: "Space Puzzle",
      description: "우주를 배경으로 한 퍼즐 게임으로, 직관적인 터치 조작과 점진적 난이도 증가로 몰입감을 제공합니다.",
      category: "2D",
      imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["Unity", "2D", "Mobile"],
      platform: "Mobile",
      date: "2023.09",
      createdAt: new Date()
    }
  ];

  const categories = ["전체", "2D 게임", "3D 게임", "모바일", "VR/AR"];
  
  const filteredProjects = selectedCategory === "전체" 
    ? mockProjects 
    : mockProjects.filter(project => {
        switch (selectedCategory) {
          case "2D 게임": return project.category === "2D";
          case "3D 게임": return project.category === "3D";
          case "모바일": return project.platform === "Mobile";
          case "VR/AR": return project.category === "VR" || project.category === "AR";
          default: return true;
        }
      });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "2D": return "2D";
      case "3D": return "3D";
      case "RPG": return "RPG";
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "2D": return "bg-gaming-primary/20 text-gaming-primary";
      case "3D": return "bg-gaming-accent/20 text-gaming-accent";
      case "RPG": return "bg-gaming-secondary/20 text-gaming-secondary";
      default: return "bg-gaming-primary/20 text-gaming-primary";
    }
  };

  return (
    <>
      {/* Project Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category 
              ? "gaming-button" 
              : "gaming-button-outline"
            }
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="w-16 h-16 border-4 border-gaming-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gaming-primary font-mono">로딩 중...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 bg-gaming-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="text-gaming-primary" size={32} />
            </div>
            <p className="text-gray-400 text-lg">선택한 카테고리에 프로젝트가 없습니다.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-gaming-light rounded-xl overflow-hidden border border-gaming-primary/10 hover:border-gaming-primary/30 transition-all transform hover:scale-105"
            >
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(project.category)}`}>
                    {getCategoryIcon(project.category)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span><Calendar className="inline mr-1" size={14} />{project.date}</span>
                  <span><Code className="inline mr-1" size={14} />{project.technologies?.[0] || 'Unity'}</span>
                  <span>
                    {project.platform === "Mobile" ? (
                      <><Smartphone className="inline mr-1" size={14} />Mobile</>
                    ) : (
                      <><Gamepad2 className="inline mr-1" size={14} />PC</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
