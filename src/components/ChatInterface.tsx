import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Key, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    // Use sessionStorage for better security - clears when browser tab closes
    const savedKey = sessionStorage.getItem('DEEPSEEK_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    // Use sessionStorage instead of localStorage for security
    sessionStorage.setItem('DEEPSEEK_API_KEY', apiKey);
    toast.success("API key saved for this session");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!apiKey) {
      toast.error("Please set your API key first");
      return;
    }
    const newMessage = {
      role: 'user' as const,
      content: message
    };
    try {
      setIsLoading(true);
      // Add the new message to chat history immediately for UI feedback
      setChatHistory(prev => [...prev, newMessage]);
      const response = await fetch('https://api.hyperbolic.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-V3',
          messages: [...chatHistory, newMessage],
          // Include full chat history
          max_tokens: 512,
          temperature: 0.1,
          top_p: 0.9,
          stream: false
        })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.choices[0].message.content
      };
      setChatHistory(prev => [...prev, assistantMessage]);
      setMessage("");
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to get response", {
        description: error instanceof Error ? error.message : "Please check your API key and try again"
      });
      // Remove the user message from chat history if the API call failed
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };
  return <Dialog>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[600px] p-0 gap-0">
        <Card className="h-full bg-black/80 backdrop-blur-lg border-accent/20">
          <div className="flex flex-col h-full p-4">
            {!sessionStorage.getItem('DEEPSEEK_API_KEY') && <form onSubmit={handleApiKeySubmit} className="flex gap-2 mb-4">
                <Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter your DeepSeek API key..." className="flex-1 bg-black/50 border-accent/20 text-white" />
                <Button type="submit" variant="outline" className="border-accent/20 text-white hover:bg-accent/20">
                  <Key className="h-4 w-4 mr-2" />
                  Save Key
                </Button>
              </form>}

            <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-black/50">
              {chatHistory.map((msg, index) => <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-white/10 text-white'}`}>
                    {msg.content}
                  </div>
                </div>)}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
              <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." disabled={isLoading || !apiKey} className="flex-1 bg-black/50 border-accent/20 text-white placeholder:text-white/50" />
              <Button type="submit" disabled={isLoading || !message.trim() || !apiKey} variant="outline" className="border-accent/20 text-white hover:bg-accent/20">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>
      </DialogContent>
    </Dialog>;
};
export default ChatInterface;