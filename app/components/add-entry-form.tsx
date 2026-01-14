'use client';

import { useState } from 'react';
import { addEntry } from '../actions';
import { estimateNutrition } from '../ai-actions';
import { Sparkles, Loader2, Plus } from 'lucide-react';

export default function AddEntryForm() {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
    const [micronutrients, setMicronutrients] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleAutoCalc = async () => {
        if (!name) return;

        setIsThinking(true);
        try {
            setIsThinking(true);
            const data = await estimateNutrition(name);

            if (data) {
                setCalories(data.calories.toString());
                setMacros({
                    protein: data.protein,
                    carbs: data.carbs,
                    fat: data.fat
                });
                setMicronutrients(JSON.stringify(data.micronutrients));
            } else {
                alert('Không thể ước tính dinh dưỡng. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi ước tính.');
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <form action={addEntry} className="bg-zinc-900/50 backdrop-blur-xl p-5 rounded-2xl border border-white/5 space-y-5">
            <input type="hidden" name="protein" value={macros.protein} />
            <input type="hidden" name="carbs" value={macros.carbs} />
            <input type="hidden" name="fat" value={macros.fat} />
            <input type="hidden" name="micronutrients" value={micronutrients} />

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Tên món ăn</label>
                    <div className="flex gap-2">
                        <input
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ví dụ: Phở bò"
                            required
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-black/50 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                        />
                        <button
                            type="button"
                            onClick={handleAutoCalc}
                            disabled={isThinking || !name}
                            className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-xl hover:bg-blue-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium border border-blue-600/20"
                            title="Dùng AI ước tính"
                        >
                            {isThinking ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Sparkles size={18} />
                            )}
                            <span>Auto</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Calories</label>
                        <input
                            name="calories"
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            placeholder="0"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/50 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition font-mono"
                        />
                    </div>
                    {/* Visual feedback for macros if available */}
                    <div className="flex flex-col justify-center gap-1 text-xs text-gray-500 pt-0">
                        {macros.protein > 0 && (
                            <div className="flex gap-2">
                                <span className="text-red-400 font-medium">Protein: {macros.protein}g</span>
                                <span className="text-yellow-400 font-medium">Carb: {macros.carbs}g</span>
                                <span className="text-blue-400 font-medium">Fat: {macros.fat}g</span>
                            </div>
                        )}
                        {micronutrients && micronutrients !== '{}' && (
                            <span className="text-[10px] text-gray-600 truncate max-w-[150px]">
                                + Micro nutrients
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="group w-full py-3.5 bg-white text-black font-bold text-base rounded-xl hover:bg-gray-200 transition active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={() => {
                    setTimeout(() => {
                        setName('');
                        setCalories('');
                        setMacros({ protein: 0, carbs: 0, fat: 0 });
                        setMicronutrients('');
                    }, 100);
                }}
            >
                <Plus size={20} className="text-black/70 group-hover:text-black transition" />
                Thêm món ăn
            </button>
        </form>
    );
}
