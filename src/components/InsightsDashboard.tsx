
import React from 'react';
import { AggregatedInsights } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Brain, Target, Star, ListOrdered, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';

interface InsightsDashboardProps {
  insights: AggregatedInsights;
}

export function InsightsDashboard({ insights }: InsightsDashboardProps) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent-amber text-white rounded-xl shadow-lg shadow-accent-amber/20">
            <Brain className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">Executive Summary</h2>
        </div>
        <Card className="rounded-3xl border-2 border-slate-100 bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32 text-accent-amber" />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="prose prose-sm max-w-none prose-p:text-slate-500 prose-p:font-medium prose-p:leading-relaxed prose-headings:font-display prose-headings:text-slate-900">
              <ReactMarkdown>{insights.overallSummary}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-secondary/10 rounded-xl">
              <Target className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">Technical Landscape</h2>
          </div>
          <Card className="rounded-3xl border-2 border-slate-100 bg-white p-6">
            <div className="space-y-6">
              {insights.commonTechnicalSkills.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-2 p-3 rounded-2xl hover:bg-slate-50 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{item.skill}</span>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Found in {item.count} roles</p>
                    </div>
                    <span className={`text-sm font-mono font-bold ${
                      item.percentage >= 80 ? 'text-accent-teal' : 
                      item.percentage >= 50 ? 'text-primary' : 'text-accent-amber'
                    }`}>{item.percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1.2, delay: 0.5 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.05)] ${
                        item.percentage >= 80 ? 'bg-accent-teal' : 
                        item.percentage >= 50 ? 'bg-primary' : 'bg-accent-amber'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-purple/10 rounded-xl">
              <Star className="w-5 h-5 text-accent-purple" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">Behavioral Anchors</h2>
          </div>
          <Card className="rounded-3xl border-2 border-slate-100 bg-white p-6">
            <div className="space-y-6">
              {insights.commonSoftSkills.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-2 p-3 rounded-2xl hover:bg-slate-50 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-accent-purple transition-colors">{item.skill}</span>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Critical for {item.count} companies</p>
                    </div>
                    <span className={`text-sm font-mono font-bold ${
                      item.percentage >= 80 ? 'text-accent-teal' : 
                      item.percentage >= 50 ? 'text-accent-purple' : 'text-accent-rose'
                    }`}>{item.percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1.2, delay: 0.5 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.05)] ${
                        item.percentage >= 80 ? 'bg-accent-teal' : 
                        item.percentage >= 50 ? 'bg-accent-purple' : 'bg-accent-rose'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent-teal/10 rounded-xl">
            <ListOrdered className="w-5 h-5 text-accent-teal" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">Strategic Study Roadmap</h2>
        </div>
        <Card className="rounded-3xl border-2 border-slate-100 bg-white overflow-hidden">
          <ScrollArea className="h-[500px]">
            <div className="p-8 space-y-6">
              {insights.studyPriority.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative pl-10 border-l-2 border-slate-100 pb-8 last:pb-0"
                >
                  <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full transition-transform duration-500 group-hover:scale-125 border-2 border-white shadow-sm ${
                    item.priority === 'High' ? 'bg-accent-rose' : 
                    item.priority === 'Medium' ? 'bg-accent-amber' : 'bg-accent-teal'
                  }`} />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold group-hover:text-primary transition-colors text-slate-800">{item.topic}</h4>
                      <Badge variant="secondary" className={`rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none ${
                        item.priority === 'High' ? 'bg-accent-rose/10 text-accent-rose' : 
                        item.priority === 'Medium' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-accent-teal/10 text-accent-teal'
                      }`}>
                        {item.priority} Priority
                      </Badge>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <TrendingUp className="w-4 h-4 text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.reason}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </section>
    </div>
  );
}
