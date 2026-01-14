'use client';

import { useState } from "react";
import UserProfileModal from "./user-profile-modal";
import { UserCircle2 } from "lucide-react";
import { UserProfile } from "../actions";

export default function ClientModalWrapper({ existingProfile }: { existingProfile?: UserProfile }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                title="Hồ sơ cá nhân"
            >
                <UserCircle2 size={24} />
            </button>
            <UserProfileModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                existingProfile={existingProfile}
            />
        </>
    );
}
