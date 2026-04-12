
import React from 'react';
import { JobDescription } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Building2, Briefcase, CheckCircle2, ChevronRight } from 'lucide-react';

interface JDCardProps {
  jd: JobDescription;
}

export function JDCard({ jd }: JDCardProps) {
  return (
    <Card className="h-full flex flex-col rounded-3xl border-2 border-slate-200 bg-white hover:border-primary/40 transition-all duration-500 group overflow-hidden shadow-sm">
      <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-primary/70">
              <Building2 className="w-3 h-3 text-primary" />
              {jd.companyName}
            </div>
            <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors text-slate-900">
              {jd.role}
            </CardTitle>
          </div>
          <div className="px-2.5 py-1.5 bg-white rounded-xl text-[10px] font-mono font-bold text-slate-600 border-2 border-slate-100 shadow-sm">
            {jd.fileName.split('.').pop()?.toUpperCase()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-3">
            {jd.summary}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-primary" />
            Core Competencies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {jd.technicalSkills.slice(0, 6).map((skill, i) => (
              <Badge key={i} variant="secondary" className="bg-accent-gray/10 text-accent-gray hover:bg-accent-gray hover:text-white transition-colors border-none rounded-lg px-2 py-0.5 text-[10px] font-bold">
                {skill}
              </Badge>
            ))}
            {jd.technicalSkills.length > 6 && (
              <Badge variant="secondary" className="bg-transparent text-slate-300 border-none text-[10px] font-bold">
                +{jd.technicalSkills.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-accent-teal" />
            Key Requirements
          </h4>
          <ScrollArea className="h-32 rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4">
            <ul className="space-y-3">
              {jd.keyRequirements.map((req, i) => (
                <li key={i} className="text-xs font-medium text-slate-600 flex items-start gap-3 leading-relaxed">
                  <div className="w-2 h-2 rounded-full bg-accent-teal/20 mt-1.5 flex-shrink-0 border border-accent-teal/40" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
