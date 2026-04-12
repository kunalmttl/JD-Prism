
import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { JDCard } from './components/JDCard';
import { InsightsDashboard } from './components/InsightsDashboard';
import { ChatInterface } from './components/ChatInterface';
import { JobDescription, AggregatedInsights } from './types';
import { getAggregatedInsights } from './lib/gemini';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { LayoutDashboard, FileText, MessageSquare, GraduationCap, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

const STORAGE_KEY_JDS = 'jd_prism_jds';
const STORAGE_KEY_INSIGHTS = 'jd_prism_insights';

export default function App() {
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [insights, setInsights] = useState<AggregatedInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load from localStorage on mount
  useEffect(() => {
    const savedJds = localStorage.getItem(STORAGE_KEY_JDS);
    const savedInsights = localStorage.getItem(STORAGE_KEY_INSIGHTS);
    
    if (savedJds) {
      try {
        const parsedJds = JSON.parse(savedJds);
        setJds(parsedJds);
        if (parsedJds.length > 0) {
          setActiveTab('dashboard');
        }
      } catch (e) {
        console.error('Failed to parse saved JDs', e);
      }
    }
    
    if (savedInsights) {
      try {
        setInsights(JSON.parse(savedInsights));
      } catch (e) {
        console.error('Failed to parse saved insights', e);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (jds.length > 0) {
      localStorage.setItem(STORAGE_KEY_JDS, JSON.stringify(jds));
    } else {
      localStorage.removeItem(STORAGE_KEY_JDS);
    }
  }, [jds]);

  useEffect(() => {
    if (insights) {
      localStorage.setItem(STORAGE_KEY_INSIGHTS, JSON.stringify(insights));
    } else {
      localStorage.removeItem(STORAGE_KEY_INSIGHTS);
    }
  }, [insights]);

  const handleJDsAnalyzed = async (newJds: JobDescription[]) => {
    const updatedJds = [...jds, ...newJds];
    setJds(updatedJds);
    setActiveTab('dashboard');
    
    if (updatedJds.length > 0) {
      setIsAnalyzing(true);
      try {
        const aggregated = await getAggregatedInsights(updatedJds);
        setInsights(aggregated);
        toast.success('Insights generated successfully!');
      } catch (error) {
        console.error('Error generating insights:', error);
        toast.error('Failed to generate aggregated insights.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const resetAll = () => {
    setJds([]);
    setInsights(null);
    localStorage.removeItem(STORAGE_KEY_JDS);
    localStorage.removeItem(STORAGE_KEY_INSIGHTS);
    setActiveTab('upload');
    toast.info('Workspace cleared');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#1E293B] font-sans selection:bg-primary/20 subtle-grid">
      <header className="border-b-2 border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-accent-amber p-2 rounded-xl shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-display">JD <span className="text-accent-amber">Prism</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Career Intelligence</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {jds.length > 0 && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={resetAll}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-accent-rose transition-colors group"
              >
                <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                Clear Workspace
              </motion.button>
            )}
            <div className="h-8 w-[2px] bg-slate-100" />
            <div className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">v1.1.0</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <AnimatePresence mode="wait">
          {jds.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-amber/10 text-[11px] font-bold uppercase tracking-widest text-accent-amber border-2 border-accent-amber/20"
                >
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Analysis
                </motion.div>
                <h2 className="text-6xl font-bold tracking-tighter lg:text-7xl font-display leading-[1.1] text-slate-900">
                  Refract your <br />
                  <span className="text-accent-amber">career potential.</span>
                </h2>
                <p className="text-xl text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
                  Upload your target job descriptions and let JD Prism distill the common patterns into a colorful, prioritized study roadmap.
                </p>
              </div>

              <div className="flat-card rounded-3xl p-2 bg-slate-50">
                <FileUpload onJDsAnalyzed={handleJDsAnalyzed} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                {[
                  { icon: FileText, title: "Deep Extraction", desc: "Advanced LLM analysis of technical requirements and hidden soft skills.", color: "bg-accent-amber/10 text-accent-amber" },
                  { icon: Sparkles, title: "Pattern Recognition", desc: "Identify the 'Golden Skills' requested by multiple top-tier companies.", color: "bg-accent-amber/10 text-accent-amber" },
                  { icon: LayoutDashboard, title: "Priority Roadmap", desc: "A data-driven study plan that maximizes your interview success rate.", color: "bg-accent-amber/10 text-accent-amber" }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="p-8 rounded-2xl border-2 border-slate-100 bg-white hover:border-primary/20 transition-all duration-300 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-10 flex-wrap gap-6 border-b-2 border-slate-100 pb-6">
                  <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14">
                    <TabsTrigger value="dashboard" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:text-accent-amber data-[state=active]:shadow-md font-bold text-sm transition-all">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Intelligence
                    </TabsTrigger>
                    <TabsTrigger value="jds" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:text-secondary data-[state=active]:shadow-md font-bold text-sm transition-all">
                      <FileText className="w-4 h-4 mr-2" />
                      Source JDs
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:text-accent-purple data-[state=active]:shadow-md font-bold text-sm transition-all">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      AI Coach
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Active Workspace</p>
                      <p className="text-sm font-bold text-slate-900">{jds.length} Documents Analyzed</p>
                    </div>
                    <FileUpload onJDsAnalyzed={handleJDsAnalyzed} />
                  </div>
                </div>

                <TabsContent value="dashboard" className="mt-0 focus-visible:outline-none">
                  {isAnalyzing ? (
                    <div className="h-[500px] flex flex-col items-center justify-center space-y-6">
                      <div className="relative">
                        <Loader2 className="w-16 h-16 animate-spin text-slate-200" />
                        <Sparkles className="w-6 h-6 text-accent-amber absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold font-display text-slate-900">Refracting Insights...</h3>
                        <p className="text-slate-400 font-medium">Synthesizing common requirements across your documents.</p>
                      </div>
                    </div>
                  ) : insights ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <InsightsDashboard insights={insights} />
                    </motion.div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium">No intelligence data available.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="jds" className="mt-0 focus-visible:outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jds.map((jd, idx) => (
                      <motion.div
                        key={jd.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <JDCard jd={jd} />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="mt-0 focus-visible:outline-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <ChatInterface jds={jds} />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

