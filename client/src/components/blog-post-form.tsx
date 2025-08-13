import { useState } from "react";
import { createDevLog } from "@/lib/devLogApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2, Plus, Minus } from "lucide-react";

interface BlogPostFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function BlogPostForm({ onClose, onSuccess }: BlogPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "입력 오류",
        description: "제목, 내용, 카테고리는 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await createDevLog({
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags.length > 0 ? tags : null,
        imageUrl: imageUrl.trim() || null
      });

      if (error) {
        throw error;
      }

      toast({
        title: "게시글 작성 완료",
        description: "새로운 개발 로그가 성공적으로 작성되었습니다.",
      });

      // 성공 콜백 호출
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating dev log:', error);
      toast({
        title: "작성 실패",
        description: "게시글 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gaming-light rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">새 개발 로그 작성</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gaming-secondary"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">제목 *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="개발 로그 제목을 입력하세요"
              className="bg-gaming-dark border-gaming-primary/30"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">카테고리 *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-gaming-dark border-gaming-primary/30">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent className="bg-gaming-light border-gaming-primary/30">
                <SelectItem value="게임 기획">게임 기획</SelectItem>
                <SelectItem value="Unity 개발">Unity 개발</SelectItem>
                <SelectItem value="디버깅">디버깅</SelectItem>
                <SelectItem value="최적화">최적화</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">태그</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="태그를 입력하세요"
                className="bg-gaming-dark border-gaming-primary/30 flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button
                onClick={addTag}
                size="sm"
                className="gaming-button-outline"
              >
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gaming-primary/20 text-gaming-primary text-sm rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-gaming-secondary"
                  >
                    <Minus size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">이미지 URL (선택사항)</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-gaming-dark border-gaming-primary/30"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">내용 *</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="개발 과정, 경험, 팁 등을 자세히 작성해주세요..."
              className="bg-gaming-dark border-gaming-primary/30 min-h-[200px]"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              className="gaming-button flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 animate-spin" size={16} />}
              작성 완료
            </Button>
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
