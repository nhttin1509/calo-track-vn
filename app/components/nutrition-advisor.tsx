'use client';

import { useState } from 'react';
import { getNutritionAdvice } from '../ai-actions';
import { Sparkles, X, MessageSquareQuote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
    history: any[];
    profile: any;
}

export default function NutritionAdvisor({ history, profile }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetAdvice = async () => {
        setIsOpen(true);
        if (advice) return; // Don't re-fetch if already have advice (unless reset?)

        setIsLoading(true);
        const result = await getNutritionAdvice(history, profile);
        setAdvice(result);
        setIsLoading(false);
    };

    return (
        <>
            <button
                onClick={handleGetAdvice}
                className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-purple-900/20"
            >
                <Sparkles size={18} />
                Phân tích & Lời khuyên
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-zinc-900 sticky top-0">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <MessageSquareQuote className="text-purple-400" />
                                Góc tư vấn
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                                    <p className="text-sm text-center text-gray-500 mt-4">Đang phân tích dữ liệu...</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                    <ReactMarkdown>{advice}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {!isLoading && (
                            <div className="p-4 border-t border-white/5 bg-zinc-900/50">
                                <button
                                    onClick={() => {
                                        setAdvice(''); // Clear to force refresh
                                        handleGetAdvice();
                                    }}
                                    className="w-full py-2.5 text-sm font-medium text-purple-400 hover:bg-purple-500/10 rounded-lg transition"
                                >
                                    Phân tích lại
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
