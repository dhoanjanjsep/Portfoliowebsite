import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Linkedin, Github, Youtube, Send, Loader2, Check } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; projectType: string; message: string }) => {
      return await apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      setName("");
      setEmail("");
      setProjectType("");
      setMessage("");
      toast({
        title: "메시지 전송 완료",
        description: "메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.",
      });
    },
    onError: () => {
      toast({
        title: "전송 실패",
        description: "메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "입력 오류",
        description: "이름, 이메일, 메시지는 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      projectType,
      message: message.trim()
    });
  };

  return (
    <section id="contact" className="py-20 bg-gaming-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="gradient-text">연락하기</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            게임 개발 프로젝트나 협업 제안이 있으시면 언제든 연락해주세요
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gaming-primary/20 rounded-lg flex items-center justify-center">
                  <Mail className="text-gaming-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">이메일</h3>
                  <p className="text-gray-300">gamedev.kim@email.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center">
                  <Linkedin className="text-gaming-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">LinkedIn</h3>
                  <p className="text-gray-300">linkedin.com/in/gamedev-kim</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gaming-secondary/20 rounded-lg flex items-center justify-center">
                  <Github className="text-gaming-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">GitHub</h3>
                  <p className="text-gray-300">github.com/gamedev-kim</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gaming-light p-6 rounded-xl border border-gaming-primary/10">
              <h3 className="text-lg font-semibold mb-4">협업 분야</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Check className="text-gaming-primary" size={16} />
                  <span className="text-sm">게임 기획</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-gaming-primary" size={16} />
                  <span className="text-sm">Unity 개발</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-gaming-primary" size={16} />
                  <span className="text-sm">프로토타이핑</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-gaming-primary" size={16} />
                  <span className="text-sm">컨설팅</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gaming-light p-8 rounded-xl border border-gaming-primary/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">이름 *</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gaming-dark border-gaming-primary/30 text-gray-300 placeholder-gray-500"
                  placeholder="홍길동"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">이메일 *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gaming-dark border-gaming-primary/30 text-gray-300 placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">프로젝트 유형</label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger className="bg-gaming-dark border-gaming-primary/30">
                    <SelectValue placeholder="프로젝트 유형 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gaming-light border-gaming-primary/30">
                    <SelectItem value="게임 기획">게임 기획</SelectItem>
                    <SelectItem value="Unity 개발">Unity 개발</SelectItem>
                    <SelectItem value="프로토타이핑">프로토타이핑</SelectItem>
                    <SelectItem value="컨설팅">컨설팅</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">메시지 *</label>
                <Textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gaming-dark border-gaming-primary/30 text-gray-300 placeholder-gray-500 resize-none"
                  placeholder="프로젝트에 대해 자세히 설명해주세요..."
                />
              </div>
              
              <Button 
                type="submit" 
                className="gaming-button w-full"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? (
                  <Loader2 className="mr-2 animate-spin" size={16} />
                ) : (
                  <Send className="mr-2" size={16} />
                )}
                메시지 보내기
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
