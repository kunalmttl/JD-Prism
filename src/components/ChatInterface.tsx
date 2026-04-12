
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, MessageSquare, Command } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { ChatMessage, JobDescription } from '../types';
import { chatWithGemini } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  jds: JobDescription[];
}

export function ChatInterface({ jds }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const jdContext = jds.map(jd => `Company: ${jd.companyName}, Role: ${jd.role}, Skills: ${jd.technicalSkills.join(', ')}`).join('\n\n');
      const response = await chatWithGemini([...messages, userMessage], jdContext);
      
      setMessages(prev => [...prev, { role: 'model', content: response || 'Sorry, I couldn\'t process that.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', content: 'There was an error connecting to the AI. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Card className="h-[700px] flex flex-col rounded-3xl border-2 border-slate-100 bg-white overflow-hidden">
      <CardHeader className="border-b-2 border-slate-100 py-6 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-purple text-white rounded-xl shadow-lg shadow-accent-purple/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold font-display text-slate-900">AI Career Coach</CardTitle>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Context-Aware Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-teal/10 rounded-full border border-accent-teal/20">
              <div className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-teal">System Ready</span>
            </div>
            <Button variant="ghost" size="icon" onClick={clearChat} disabled={messages.length === 0} className="rounded-xl hover:bg-accent-rose/10 transition-colors">
              <Trash2 className="w-4 h-4 text-slate-300 hover:text-accent-rose" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <ScrollArea className="flex-1 p-8" ref={scrollRef}>
          <div className="space-y-8 max-w-3xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
                >
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center border-2 border-slate-100">
                    <Bot className="w-8 h-8 text-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-800">Your AI Study Companion</p>
                    <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">Ask me about specific skills, preparation tips, or patterns across your JDs.</p>
                  </div>
                </motion.div>
              ) : (
                messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${
                        m.role === 'user' ? 'bg-primary text-white' : 'bg-white border-2 border-slate-100 text-slate-400'
                      }`}>
                        {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={`p-5 rounded-3xl space-y-2 ${
                        m.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                          : 'bg-slate-50 text-slate-700 rounded-tl-none border-2 border-slate-100'
                      }`}>
                        <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert' : 'prose-p:text-slate-600'}`}>
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-300 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="p-5 rounded-3xl bg-slate-50 text-slate-400 rounded-tl-none font-medium italic text-sm border-2 border-slate-100">
                    Synthesizing response...
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="p-8 border-t-2 border-slate-100 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="max-w-3xl mx-auto relative group"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your interview prep..."
              className="h-16 pl-6 pr-32 rounded-2xl border-2 border-slate-100 bg-white focus-visible:ring-primary/20 text-base font-medium transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-100">
                <Command className="w-3 h-3" />
                <span>ENTER</span>
              </div>
              <Button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
          <p className="text-center mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            Powered by Gemini 1.5 Pro • Context from {jds.length} Documents
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
