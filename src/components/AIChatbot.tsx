import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
 import mamaBiggyAvatar from "@/assets/mama-biggy-profile.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export const AIChatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    // Get user's session token - required for authenticated chat
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Please log in to use Mama Biggy chat");
    }

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`, // Use user's JWT token
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      const error = await resp.json();
      if (resp.status === 401) {
        setIsAuthenticated(false);
        throw new Error("Please log in to use Mama Biggy chat");
      }
      if (resp.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      if (resp.status === 402) {
        throw new Error("Service temporarily unavailable. Please try again later.");
      }
      throw new Error(error.error || "Failed to get response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Check authentication before sending
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please log in to chat with Mama Biggy",
      });
      return;
    }

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 animate-pulse hover:animate-none"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-background border rounded-lg shadow-xl z-50 flex flex-col animate-scale-in">
          {/* Header */}
          <div className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-foreground/40 to-primary-foreground/20 rounded-full animate-[spin_4s_linear_infinite] opacity-75"></div>
                <img 
                  src={mamaBiggyAvatar} 
                  alt="Mama Biggy" 
                  className="relative h-10 w-10 rounded-full object-cover border-2 border-primary-foreground/50 shadow-lg transition-transform duration-300 hover:scale-110" 
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-primary animate-pulse"></span>
              </div>
              <div>
                <span className="font-semibold block">Mama Biggy</span>
                <span className="text-xs text-primary-foreground/70">Online • Ready to help</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {/* Login prompt for unauthenticated users */}
            {isAuthenticated === false && (
              <div className="text-center py-8 animate-fade-in">
                <div className="relative inline-block mb-4">
                  <img 
                    src={mamaBiggyAvatar} 
                    alt="Mama Biggy" 
                    className="h-20 w-20 mx-auto rounded-full object-cover border-4 border-primary/50 shadow-xl opacity-60" 
                  />
                </div>
                <p className="font-medium text-foreground mb-2">Hello my dear!</p>
                <p className="text-sm text-muted-foreground mb-4">Please log in to chat with Mama Biggy</p>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => navigate('/member/login')}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Button>
              </div>
            )}
            {/* Welcome message for authenticated users */}
            {isAuthenticated && messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8 animate-fade-in">
                <div className="relative inline-block mb-4">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full animate-[spin_3s_linear_infinite] opacity-60 blur-sm"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                  <img 
                    src={mamaBiggyAvatar} 
                    alt="Mama Biggy" 
                    className="relative h-20 w-20 mx-auto rounded-full object-cover border-4 border-primary/50 shadow-xl animate-[bounce_2s_ease-in-out_infinite]" 
                  />
                  <div className="absolute -inset-3 rounded-full border-2 border-primary/30 animate-ping"></div>
                </div>
                <p className="font-medium text-foreground">Hello my dear!</p>
                <p className="text-sm">Mama Biggy is here to help you!</p>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <img 
                      src={mamaBiggyAvatar} 
                      alt="Mama Biggy" 
                      className="h-8 w-8 rounded-full object-cover shrink-0 border-2 border-primary/30 shadow-md" 
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2 animate-fade-in">
                  <img 
                    src={mamaBiggyAvatar} 
                    alt="Mama Biggy" 
                    className="h-8 w-8 rounded-full object-cover border-2 border-primary/30 shadow-md" 
                  />
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAuthenticated ? "Type a message..." : "Log in to chat..."}
                disabled={isLoading || !isAuthenticated}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim() || !isAuthenticated}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
