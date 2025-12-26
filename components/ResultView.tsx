
import React from 'react';

interface ResultViewProps {
  content: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ content, onReset }) => {
  // Simple parser for the markdown-ish format returned
  const sections = content.split('\n## ').filter(Boolean);

  const renderSection = (section: string) => {
    const lines = section.split('\n');
    const title = lines[0].replace(/【|】/g, '').trim();
    const body = lines.slice(1).join('\n');

    if (title.includes('评分')) {
        const score = body.match(/\d+(\.\d+)?/)?.[0] || '0';
        return (
            <div key={title} className="bg-stone-50 border border-stone-200 p-6 rounded-lg text-center my-6">
                <h3 className="text-stone-500 uppercase tracking-widest text-sm mb-2">综合评分</h3>
                <div className="relative inline-block">
                    <span className="text-6xl font-bold text-stone-900 leading-none">{score}</span>
                    <span className="text-stone-400 absolute -right-8 bottom-1">/10</span>
                </div>
            </div>
        );
    }

    return (
      <div key={title} className="mb-8 last:mb-0">
        <h3 className="text-lg font-bold text-stone-800 border-l-4 border-stone-800 pl-3 mb-4">
          {title}
        </h3>
        <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap">
          {body.trim()}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl max-w-3xl mx-auto border border-stone-100">
      <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
        <h2 className="text-2xl font-bold text-stone-900">鉴赏报告</h2>
        <button
          onClick={onReset}
          className="text-stone-500 hover:text-stone-800 text-sm flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重新点评
        </button>
      </div>

      <div className="space-y-6">
        {sections.map(renderSection)}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-block relative">
            <div className="absolute inset-0 border-2 border-stone-800 scale-105 opacity-20"></div>
            <p className="px-6 py-2 text-stone-800 font-bold tracking-[0.5em] italic">
                美院教授点评印
            </p>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
