import { getEntries, deleteEntry, getUserProfile } from "./actions";
import AddEntryForm from "./components/add-entry-form";
import UserProfileModal from "./components/user-profile-modal";
import NutritionAdvisor from "./components/nutrition-advisor";
import { Trash2, TrendingUp, UserCircle2 } from "lucide-react";
import ClientModalWrapper from "./components/client-modal-wrapper";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const entries = await getEntries();
  const userProfile = await getUserProfile();

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = entries.reduce((sum, entry) => sum + entry.fat, 0);

  const tdee = userProfile?.tdee || 2000;
  const progressPercent = Math.min(Math.round((totalCalories / tdee) * 100), 100);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-blue-500/30 pb-24">
      <div className="max-w-md mx-auto space-y-8 pt-4">

        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Hôm nay</h1>
          <ClientModalWrapper existingProfile={userProfile} />
        </div>

        {/* Total Summary Card */}
        <div className="relative overflow-hidden bg-zinc-900/40 rounded-3xl p-8 border border-white/5 text-center">
          {/* Background Gradient Blob */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none transition-all duration-1000`}
            style={{ opacity: progressPercent / 100 + 0.2 }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <p className="text-base text-gray-400 font-medium mb-1">Đã nạp / Mục tiêu</p>
            <div className="relative">
              <span className="text-6xl font-bold tracking-tighter text-white drop-shadow-xl">
                {totalCalories}
              </span>
              <span className="text-2xl text-gray-500 font-normal ml-2">/ {tdee}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Macros Mini Summary */}
            <div className="flex justify-between w-full mt-6 px-2">
              <div className="text-center">
                <p className="text-xs text-red-400 font-medium">Protein</p>
                <p className="font-bold">{totalProtein}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-yellow-400 font-medium">Carbs</p>
                <p className="font-bold">{totalCarbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-400 font-medium">Fat</p>
                <p className="font-bold">{totalFat}g</p>
              </div>
            </div>
          </div>

          <NutritionAdvisor history={entries} profile={userProfile} />
        </div>

        {/* Input Form */}
        <AddEntryForm />

        {/* Entries List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight px-1 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Nhật ký ăn uống
          </h2>

          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600 space-y-2 border border-dashed border-white/10 rounded-2xl bg-white/5 mx-1">
              <p>Chưa có dữ liệu hôm nay</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {entries.map((entry) => {
                let micronutrients = {};
                try {
                  micronutrients = JSON.parse(entry.micronutrients || '{}');
                } catch (e) { }

                return (
                  <div key={entry.id} className="group relative bg-zinc-900/60 hover:bg-zinc-800/80 p-5 rounded-2xl border border-white/5 transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-base text-gray-100">{entry.name}</p>
                        <div className="flex gap-2 mt-1 lowercase text-xs">
                          <span className="text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded">P: {entry.protein}g</span>
                          <span className="text-yellow-300 bg-yellow-500/10 px-1.5 py-0.5 rounded">C: {entry.carbs}g</span>
                          <span className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded">F: {entry.fat}g</span>
                        </div>

                        {/* Simple Micro display if exists */}
                        {Object.entries(micronutrients).length > 0 && (
                          <div className="mt-2 text-[10px] text-gray-500 flex flex-wrap gap-x-2">
                            {Object.entries(micronutrients).slice(0, 3).map(([key, val]) => (
                              <span key={key}>• {key}: {val as string}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-white">{entry.calories}</span>
                        <form action={deleteEntry.bind(null, entry.id)}>
                          <button type="submit" className="p-2 -mr-2 text-gray-600 hover:text-red-400 transition-colors rounded-full hover:bg-white/5">
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
