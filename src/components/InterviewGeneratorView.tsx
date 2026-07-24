import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  Briefcase, 
  UserCheck, 
  CheckCircle2,
  FileQuestion,
  BookOpen
} from 'lucide-react';
import { Candidate, Job, InterviewQuestion } from '../types';

interface InterviewGeneratorViewProps {
  candidates: Candidate[];
  jobs: Job[];
}

export function InterviewGeneratorView({ candidates, jobs }: InterviewGeneratorViewProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || '');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<{ technicalQuestions: InterviewQuestion[]; hrQuestions: InterviewQuestion[] } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setQuestions(null);

    try {
      const response = await fetch('/api/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: selectedCandidateId, jobId: selectedJobId })
      });

      if (!response.ok) throw new Error('Failed to generate interview questions');
      const data = await response.json();
      setQuestions(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Automated Interview Question Generator</h1>
            <p className="text-xs text-slate-500">Tailor technical and behavioral interview questions based on candidate skill gaps and job requirements</p>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Candidate
            </label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.appliedJobTitle} ({c.matchScore}% Match)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Target Job Opening
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Tailored Questions...</span>
                </>
              ) : (
                <>
                  <FileQuestion className="w-4 h-4" />
                  <span>Generate Interview Kit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Questions Output */}
      {questions && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Box */}
          {selectedCandidate && selectedJob && (
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-sm font-bold mb-1">Interview Kit for {selectedCandidate.name}</h3>
              <p className="text-xs text-indigo-200 mb-3">Position: {selectedJob.title} • Missing qualifications probed: {selectedCandidate.missingQualifications.join(', ') || 'None'}</p>
            </div>
          )}

          {/* Technical Questions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>Technical & Architectural Assessment</span>
            </h3>

            <div className="space-y-4">
              {questions.technicalQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-indigo-600">Question {idx + 1} • {q.focusArea}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{q.question}</p>
                  <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong className="text-slate-800">Evaluation Guideline:</strong> {q.evaluationGuideline}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HR & Behavioral Questions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-violet-600" />
              <span>HR & Behavioral Assessment</span>
            </h3>

            <div className="space-y-4">
              {questions.hrQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-violet-600">Behavioral {idx + 1} • {q.focusArea}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{q.question}</p>
                  <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong className="text-slate-800">Evaluation Guideline:</strong> {q.evaluationGuideline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
