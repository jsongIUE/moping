
import React, { useState, useRef, useCallback } from 'react';
import { PaintingCategory, UserLevel } from './types';
import { analyzePainting } from './geminiService';
import LoadingOverlay from './components/LoadingOverlay';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [category, setCategory] = useState<PaintingCategory>(PaintingCategory.AUTO);
  const [level, setLevel] = useState<UserLevel>(UserLevel.BEGINNER);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzePainting(selectedImage, category, level);
      setAnalysisResult(result || "未能生成有效分析");
    } catch (err: any) {
      setError(err.message || "分析过程中发生错误，请稍后重试。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="py-12 text-center bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
        <div className="inline-block border-y-2 border-stone-800 py-2 px-8 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] text-stone-900">墨评</h1>
        </div>
        <p className="text-stone-600 italic">—— 您的 AI 国画点评大师 ——</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {!analysisResult ? (
          <div className="space-y-8">
            {/* Image Upload Area */}
            <div
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              className={`
                relative aspect-[4/3] w-full max-w-2xl mx-auto rounded-lg border-2 border-dashed
                ${selectedImage ? 'border-transparent' : 'border-stone-300 hover:border-stone-500'}
                bg-stone-50 overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-center
              `}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="User upload"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <svg className="mx-auto h-16 w-16 text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-stone-500 font-medium">点击上传国画作品照片</p>
                  <p className="text-stone-400 text-sm mt-1">支持 JPG, PNG 格式</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-100 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">作品品类</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(PaintingCategory).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm transition-all border ${
                          category === cat
                            ? 'bg-stone-800 text-white border-stone-800'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">点评深度</label>
                  <div className="flex gap-2">
                    {Object.values(UserLevel).map((lv) => (
                      <button
                        key={lv}
                        onClick={() => setLevel(lv)}
                        className={`flex-1 px-4 py-2 rounded-full text-sm transition-all border ${
                          level === lv
                            ? 'bg-stone-800 text-white border-stone-800'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {lv}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className={`
                  w-full mt-8 py-4 rounded-lg font-bold text-lg transition-all
                  ${!selectedImage || isAnalyzing
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-800 text-white hover:bg-stone-900 shadow-lg active:scale-[0.98]'}
                `}
              >
                {isAnalyzing ? '大师正在品鉴中...' : '提交大师点评'}
              </button>
            </div>
          </div>
        ) : (
          <ResultView content={analysisResult} onReset={handleReset} />
        )}
      </main>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <LoadingOverlay message="正在分析笔墨细节与气韵神采..." />
      )}

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 py-3 text-center text-xs text-stone-400 z-10">
        基于谢赫“六法”评价体系 • 中国美术学院教授学术支持 AI 模拟
      </footer>
    </div>
  );
};

export default App;
