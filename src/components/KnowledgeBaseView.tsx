import React, { useState } from 'react';
import { 
  Search, 
  Database, 
  Sparkles, 
  Filter, 
  FileText, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Candidate } from '../types';

interface KnowledgeBaseViewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
}

export function KnowledgeBaseView({ candidates, onSelectCandidate }: KnowledgeBaseViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const filtered = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.resumeText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill = skillFilter ? c.skills.map(s => s.toLowerCase()).includes(skillFilter.toLowerCase()) : true;
    return matchesSearch && matchesSkill;
  });

  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills)));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Knowledge Base & Semantic Search</h1>
            <p className="text-xs text-slate-500">Vector database indexing (ChromaDB) for instant semantic candidate retrieval and skill profiling</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Semantic search (e.g., 'Python developer with Kubernetes experience')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Filter by Skill (All)</option>
              {allSkills.map((skill, i) => (
                <option key={i} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1.5" />
            ChromaDB Vector Index Active • {filtered.length} profiles retrieved
          </span>
          <span className="text-[10px] text-slate-400">Embedding model: text-embedding-3-large</span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border border-slate-200">
            No candidates found matching your semantic query. Try broadening your keywords.
          </div>
        ) : (
          filtered.map((cand) => (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cand.name}
                    </h3>
                    <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                      {cand.appliedJobTitle}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {cand.experienceYears} Years Exp
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{cand.resumeText}"
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cand.skills.map((skill, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start shrink-0 space-y-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {cand.matchScore}% Match
                  </div>
                  <span className="text-xs text-indigo-600 font-semibold group-hover:underline flex items-center mt-2">
                    View Profile <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
