import React from 'react';
import { 
  X, 
  Sparkles, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase,
  FileText
} from 'lucide-react';
import { Candidate } from '../types';

interface CandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
  onGenerateQuestions: (candidate: Candidate) => void;
}

export function CandidateModal({ candidate, onClose, onGenerateQuestions }: CandidateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scaleUp">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{candidate.name}</h2>
              <p className="text-xs text-slate-500">{candidate.appliedJobTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Match Score & Breakdown Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">AI Match Evaluation</span>
              <h3 className="text-2xl font-extrabold mt-1">{candidate.matchScore}% Overall Fit</h3>
              <p className="text-xs text-slate-300 mt-1">Status: <span className="font-semibold text-emerald-400">{candidate.status}</span></p>
            </div>
            <div className="flex items-center space-x-4 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-md border border-white/10 text-xs">
              <div>
                <span className="block text-slate-300 text-[10px]">Skills</span>
                <span className="font-bold text-white text-sm">{candidate.matchBreakdown.skillsMatch}%</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="block text-slate-300 text-[10px]">Experience</span>
                <span className="font-bold text-white text-sm">{candidate.matchBreakdown.experienceMatch}%</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="block text-slate-300 text-[10px]">Cultural Fit</span>
                <span className="font-bold text-white text-sm">{candidate.matchBreakdown.culturalFit}%</span>
              </div>
            </div>
          </div>

          {/* Contact & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{candidate.phone}</span>
            </div>
          </div>

          {/* AI Justification */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Screening Justification</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{candidate.justification}</p>
          </div>

          {/* Missing Qualifications */}
          {candidate.missingQualifications.length > 0 && (
            <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Skill Gaps & Missing Qualifications</span>
              </h4>
              <ul className="space-y-1 text-xs text-amber-900">
                {candidate.missingQualifications.map((mq, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                    <span>{mq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verified Candidate Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Resume Excerpt */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Resume Excerpt</h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {candidate.resumeText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 flex items-center justify-between z-10">
          <button
            onClick={() => {
              onClose();
              onGenerateQuestions(candidate);
            }}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Interview Kit</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
