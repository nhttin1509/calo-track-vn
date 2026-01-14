'use client';

import { useState } from 'react';
import { saveUserProfile, UserProfile } from '../actions';
import { X, Calculator } from 'lucide-react';

interface Props {
    existingProfile?: UserProfile;
    isOpen: boolean;
    onClose: () => void;
}

export default function UserProfileModal({ existingProfile, isOpen, onClose }: Props) {
    const [formData, setFormData] = useState<Partial<UserProfile>>(existingProfile || {
        gender: 'male',
        activity_level: '1.2'
    });

    if (!isOpen) return null;

    const calculateTDEE = (data: Partial<UserProfile>) => {
        if (!data.weight || !data.activity_level) return 0;

        let bmr = 0;

        // Katch-McArdle Equation (Highest Accuracy if Body Fat is known)
        if (data.body_fat && data.body_fat > 0) {
            const leanBodyMass = data.weight * (1 - (data.body_fat / 100));
            bmr = 370 + (21.6 * leanBodyMass);
        }
        // Mifflin-St Jeor Equation (Fallback)
        else if (data.height && data.age && data.gender) {
            bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age);
            bmr += data.gender === 'male' ? 5 : -161;
        }

        return Math.round(bmr * parseFloat(data.activity_level));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tdee = calculateTDEE(formData);

        await saveUserProfile({
            ...formData as UserProfile,
            tdee
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Cập nhật hồ sơ</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Tuổi</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                value={formData.age || ''}
                                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Giới tính</label>
                            <select
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none appearance-none"
                                value={formData.gender}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Chiều cao (cm)</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                value={formData.height || ''}
                                onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Cân nặng (kg)</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                value={formData.weight || ''}
                                onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            % Body Fat (Tùy chọn)
                            <span className="text-xs text-gray-500 ml-1 font-normal">- giúp TDEE chuẩn hơn</span>
                        </label>
                        <input
                            type="number"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none placeholder:text-gray-600"
                            placeholder="Ví dụ: 15"
                            value={formData.body_fat || ''}
                            onChange={e => setFormData({ ...formData, body_fat: e.target.value ? Number(e.target.value) : undefined })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Mức độ vận động</label>
                        <select
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                            value={formData.activity_level}
                            onChange={e => setFormData({ ...formData, activity_level: e.target.value })}
                        >
                            <option value="1.2">Ít vận động (Văn phòng)</option>
                            <option value="1.375">Nhẹ (Tập 1-3 ng/tuần)</option>
                            <option value="1.55">Vừa (Tập 3-5 ng/tuần)</option>
                            <option value="1.725">Năng động (6-7 ng/tuần)</option>
                            <option value="1.9">Vận động viên</option>
                        </select>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-lg text-white">
                                <Calculator size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-blue-300">Nhu cầu năng lượng (TDEE)</p>
                                <p className="text-lg font-bold text-blue-400">{calculateTDEE(formData) || '--'} kcal</p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition">
                        Lưu hồ sơ
                    </button>
                </form>
            </div>
        </div>
    );
}
