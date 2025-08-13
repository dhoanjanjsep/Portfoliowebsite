import { Navigation } from "@/components/navigation";
import { UnityPlayer } from "@/components/unity-player";
import { ProjectGallery } from "@/components/project-gallery";
import { BlogPostForm } from "@/components/blog-post-form";
import { ContactForm } from "@/components/contact-form";
import { useQuery } from "@tanstack/react-query";
import { DevLog } from "@/lib/supabase";
import { getAllDevLogs } from "@/lib/devLogApi";
import { Box, Lightbulb, Settings, Users, Play, Expand, Upload, Calendar, Code, Gamepad2, Eye, ArrowRight, Edit, Trash2, ChevronLeft, ChevronRight, Plus, Search, Mail, Linkedin, Github, Youtube, Twitter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체 카테고리");
  const [searchQuery, setSearchQuery] = useState("");

  // React Query를 사용하여 dev logs 데이터 가져오기
  const { data: blogPosts = [], isLoading: blogLoading, refetch } = useQuery<DevLog[]>({
    queryKey: ['dev-logs'],
    queryFn: async () => {
      const { data, error } = await getAllDevLogs();
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5분
  });

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "전체 카테고리" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // 블로그 포스트 작성 성공 후 데이터 새로고침
  const handleBlogSuccess = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-dark via-gaming-gray to-gaming-dark"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gaming-primary rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gaming-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-gaming-secondary rounded-full animate-pulse"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  안녕하세요,<br/>
                  <span className="gradient-text">게임 기획자</span><br/>
                  김개발입니다
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  창의적인 아이디어와 체계적인 설계로 플레이어들에게 특별한 경험을 선사하는 게임을 만듭니다.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <span className="px-4 py-2 bg-gaming-light border border-gaming-primary/30 rounded-lg text-sm font-mono">
                  <Gamepad2 className="inline-block w-4 h-4 mr-2" />Game Design
                </span>
                <span className="px-4 py-2 bg-gaming-light border border-gaming-accent/30 rounded-lg text-sm font-mono">
                  <Box className="inline-block w-4 h-4 mr-2" />Unity Engine
                </span>
                <span className="px-4 py-2 bg-gaming-light border border-gaming-secondary/30 rounded-lg text-sm font-mono">
                  <Code className="inline-block w-4 h-4 mr-2" />C# Scripting
                </span>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="gaming-button"
                  onClick={() => scrollToSection('projects')}
                >
                  프로젝트 보기
                </Button>
                <Button 
                  className="gaming-button-outline"
                  onClick={() => scrollToSection('contact')}
                >
                  연락하기
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gaming-light rounded-2xl border border-gaming-primary/20 flex items-center justify-center animate-float">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gaming-primary to-gaming-accent rounded-2xl flex items-center justify-center">
                    <Box className="text-3xl text-gaming-dark" size={32} />
                  </div>
                  <p className="text-sm text-gray-400 font-mono">3D Game Development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gaming-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="gradient-text">About Me</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              게임 기획과 개발에 대한 열정으로 새로운 세계를 만들어갑니다
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gaming-light p-6 rounded-xl border border-gaming-primary/10 hover:border-gaming-primary/30 transition-all">
              <div className="w-12 h-12 bg-gaming-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="text-gaming-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">창의적 기획</h3>
              <p className="text-gray-300">독창적인 게임 메커니즘과 스토리텔링으로 플레이어를 몰입시키는 게임을 설계합니다.</p>
            </div>
            
            <div className="bg-gaming-light p-6 rounded-xl border border-gaming-accent/10 hover:border-gaming-accent/30 transition-all">
              <div className="w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Settings className="text-gaming-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">시스템 설계</h3>
              <p className="text-gray-300">체계적이고 확장 가능한 게임 시스템을 설계하여 안정적인 플레이 경험을 제공합니다.</p>
            </div>
            
            <div className="bg-gaming-light p-6 rounded-xl border border-gaming-secondary/10 hover:border-gaming-secondary/30 transition-all">
              <div className="w-12 h-12 bg-gaming-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-gaming-secondary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">협업 중심</h3>
              <p className="text-gray-300">개발팀과의 원활한 소통으로 아이디어를 현실로 구현하는 브릿지 역할을 합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Unity Game Player Section */}
      <section id="games" className="py-20 bg-gaming-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="gradient-text">플레이 가능한 게임</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Unity WebGL로 빌드된 게임들을 직접 플레이해보세요
            </p>
          </div>
          
          <UnityPlayer />
        </div>
      </section>

      {/* Projects Gallery */}
      <section id="projects" className="py-20 bg-gaming-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="gradient-text">프로젝트 갤러리</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              지금까지 작업한 다양한 게임 프로젝트들을 확인해보세요
            </p>
          </div>
          
          <ProjectGallery />
        </div>
      </section>

      {/* Development Blog Section */}
      <section id="blog" className="py-20 bg-gaming-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="gradient-text">개발 로그</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              게임 개발 과정과 경험을 기록하고 공유합니다
            </p>
          </div>
          
          {/* Blog Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex gap-4">
              <Button 
                className="gaming-button"
                onClick={() => setShowBlogForm(true)}
              >
                <Plus className="mr-2" size={16} />
                새 글 작성
              </Button>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="px-4 py-2 bg-gaming-light border border-gaming-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gaming-light border border-gaming-primary/30">
                  <SelectItem value="전체 카테고리">전체 카테고리</SelectItem>
                  <SelectItem value="게임 기획">게임 기획</SelectItem>
                  <SelectItem value="Unity 개발">Unity 개발</SelectItem>
                  <SelectItem value="디버깅">디버깅</SelectItem>
                  <SelectItem value="최적화">최적화</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="개발 로그 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gaming-light border border-gaming-primary/30 text-gray-300 placeholder-gray-500"
              />
              <Search className="absolute left-3 top-3 text-gray-500" size={16} />
            </div>
          </div>
          
          {/* Blog Posts */}
          <div className="space-y-6">
            {blogLoading ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-gaming-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gaming-primary font-mono">로딩 중...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gaming-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gaming-primary" size={32} />
                </div>
                <p className="text-gray-400 text-lg">아직 작성된 개발 로그가 없습니다.</p>
                <p className="text-gray-500 text-sm mt-2">첫 번째 개발 로그를 작성해보세요!</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article key={post.id} className="bg-gaming-light rounded-xl p-6 border border-gaming-primary/10 hover:border-gaming-primary/30 transition-all">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {post.imageUrl && (
                      <div className="lg:w-1/4">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-40 object-cover rounded-lg" 
                        />
                      </div>
                    )}
                    <div className={`${post.imageUrl ? 'lg:w-3/4' : 'w-full'} space-y-4`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2 hover:text-gaming-primary cursor-pointer">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            <span><Calendar className="inline mr-1" size={14} />{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                            <span><Code className="inline mr-1" size={14} />{post.category}</span>
                            <span><Eye className="inline mr-1" size={14} />{post.views || 0} views</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-gaming-accent transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gaming-secondary transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags?.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gaming-primary/20 text-gaming-primary text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button className="text-gaming-primary hover:underline text-sm font-medium">
                          전체 글 읽기 <ArrowRight className="inline ml-1" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />

      {/* Footer */}
      <footer className="py-12 bg-gaming-dark border-t border-gaming-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-mono font-bold gradient-text">GameDev.Kim</span>
              <p className="text-gray-400 text-sm mt-1">게임으로 세상을 더 재미있게</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-secondary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gaming-light text-center text-gray-400 text-sm">
            <p>&copy; 2024 GameDev.Kim. All rights reserved. | 게임 개발자 포트폴리오</p>
          </div>
        </div>
      </footer>

      {/* Blog Post Form Modal */}
      {showBlogForm && (
        <BlogPostForm onClose={() => setShowBlogForm(false)} onSuccess={handleBlogSuccess} />
      )}
    </div>
  );
}
