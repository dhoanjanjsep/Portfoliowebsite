import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play, Expand, Pause, RotateCcw, ChevronsUp, Upload, Loader2 } from "lucide-react";

export function UnityPlayer() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameFile, setGameFile] = useState<File | null>(null);
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameCategory, setGameCategory] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games']
  });

  const uploadGameMutation = useMutation({
    mutationFn: async ({ title, description, category, file }: { title: string; description: string; category: string; file: File }) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('buildFile', file);
      
      const response = await fetch('/api/games', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload game');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      setShowUploadForm(false);
      setGameFile(null);
      setGameTitle("");
      setGameDescription("");
      setGameCategory("");
      toast({
        title: "게임 업로드 완료",
        description: "Unity WebGL 게임이 성공적으로 업로드되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "업로드 실패",
        description: "게임 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = (file: File) => {
    setGameFile(file);
  };

  const handleUpload = () => {
    if (!gameFile || !gameTitle || !gameDescription || !gameCategory) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    uploadGameMutation.mutate({
      title: gameTitle,
      description: gameDescription,
      category: gameCategory,
      file: gameFile
    });
  };

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setIsPlaying(true);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="order-2 lg:order-1">
        <div className="space-y-6">
          {selectedGame ? (
            <>
              <h3 className="text-2xl font-bold">{selectedGame.title}</h3>
              <p className="text-gray-300 leading-relaxed">
                {selectedGame.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gaming-primary rounded-full"></div>
                  <span className="text-sm">Unity WebGL 빌드</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gaming-primary rounded-full"></div>
                  <span className="text-sm">카테고리: {selectedGame.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gaming-primary rounded-full"></div>
                  <span className="text-sm">웹 브라우저 지원</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold">게임을 선택해주세요</h3>
              <p className="text-gray-300 leading-relaxed">
                Unity WebGL로 빌드된 게임들을 직접 플레이해보세요. 
                아래에서 게임을 선택하거나 새로운 게임을 업로드할 수 있습니다.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gaming-primary rounded-full"></div>
                  <span className="text-sm">실시간 웹 플레이</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gaming-primary rounded-full"></div>
                  <span className="text-sm">Unity WebGL 지원</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gaming-primary rounded-full"></div>
                  <span className="text-sm">파일 업로드 기능</span>
                </div>
              </div>
            </>
          )}
          
          <div className="flex gap-4">
            {selectedGame ? (
              <>
                <Button 
                  className="gaming-button"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="mr-2" size={16} /> : <Play className="mr-2" size={16} />}
                  {isPlaying ? '일시정지' : '게임 시작'}
                </Button>
                <Button 
                  className="gaming-button-outline"
                  onClick={() => {/* Toggle fullscreen */}}
                >
                  <Expand className="mr-2" size={16} />
                  전체화면
                </Button>
              </>
            ) : (
              <Button 
                className="gaming-button"
                onClick={() => setShowUploadForm(true)}
              >
                <Upload className="mr-2" size={16} />
                게임 업로드
              </Button>
            )}
          </div>

          {/* Game Selection */}
          {games.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">업로드된 게임들:</h4>
              <div className="space-y-2">
                {games.map(game => (
                  <Button
                    key={game.id}
                    variant="outline"
                    className="w-full justify-start bg-gaming-light border-gaming-primary/30 hover:bg-gaming-primary hover:text-gaming-dark"
                    onClick={() => handlePlayGame(game)}
                  >
                    <Play className="mr-2" size={16} />
                    {game.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="order-1 lg:order-2">
        {/* Unity WebGL Player Container */}
        <div className="bg-gaming-light rounded-xl p-4 neon-border">
          <div className="aspect-video bg-gaming-dark rounded-lg relative overflow-hidden">
            {selectedGame && isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-gaming-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gaming-primary font-mono">Loading {selectedGame.title}...</p>
                  <div className="w-64 h-2 bg-gaming-gray rounded-full">
                    <div className="w-3/4 h-full bg-gaming-primary rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-gray-400">Unity WebGL Player</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gaming-primary/20 rounded-lg flex items-center justify-center">
                    <Play className="text-gaming-primary" size={32} />
                  </div>
                  <p className="text-gray-400">
                    {selectedGame ? '게임 시작을 눌러주세요' : '게임을 선택해주세요'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Game Controls Overlay */}
            {isPlaying && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gaming-dark/80 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-gaming-primary/20 hover:bg-gaming-primary/40 text-gaming-primary">
                      <Pause size={12} />
                    </Button>
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-gaming-primary/20 hover:bg-gaming-primary/40 text-gaming-primary">
                      <RotateCcw size={12} />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-400">
                    <ChevronsUp className="inline mr-2" size={14} />
                    <span>WASD to move, Space to jump</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Game Upload Area */}
          {!showUploadForm && games.length === 0 && (
            <div className="mt-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".zip,.unity3d"
                maxSize={50 * 1024 * 1024}
              >
                <Upload className="text-2xl text-gaming-primary mb-2 mx-auto" size={32} />
                <p className="text-sm text-gray-400 mb-2">Unity WebGL 빌드 파일 업로드</p>
                <Button className="gaming-button-outline">
                  파일 선택
                </Button>
              </FileUpload>
            </div>
          )}
        </div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gaming-light rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">새 게임 업로드</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">게임 제목</label>
                <Input
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="게임 제목을 입력하세요"
                  className="bg-gaming-dark border-gaming-primary/30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">게임 설명</label>
                <Textarea
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                  placeholder="게임에 대한 설명을 입력하세요"
                  className="bg-gaming-dark border-gaming-primary/30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">카테고리</label>
                <Select value={gameCategory} onValueChange={setGameCategory}>
                  <SelectTrigger className="bg-gaming-dark border-gaming-primary/30">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gaming-light border-gaming-primary/30">
                    <SelectItem value="2D">2D 게임</SelectItem>
                    <SelectItem value="3D">3D 게임</SelectItem>
                    <SelectItem value="Puzzle">퍼즐</SelectItem>
                    <SelectItem value="Action">액션</SelectItem>
                    <SelectItem value="RPG">RPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">WebGL 빌드 파일</label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  accept=".zip"
                  maxSize={50 * 1024 * 1024}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  className="gaming-button flex-1"
                  onClick={handleUpload}
                  disabled={uploadGameMutation.isPending}
                >
                  {uploadGameMutation.isPending && <Loader2 className="mr-2 animate-spin" size={16} />}
                  업로드
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
