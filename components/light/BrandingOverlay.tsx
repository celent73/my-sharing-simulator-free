import React from 'react';
import { useProfileStore } from './store/useProfileStore';
import { Instagram, Send, Phone, User } from 'lucide-react';

const BrandingOverlay = () => {
    const profile = useProfileStore();

    return (
        <div className="mt-8 pt-6 border-t border-union-green-500/10 flex flex-wrap justify-between items-center gap-4 px-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-union-green-500/10 flex items-center justify-center text-union-green-600">
                    <User size={20} />
                </div>
                <div>
                    <p className="text-xs font-black text-union-green-600 uppercase tracking-tighter">Consulente Partner</p>
                    <p className="text-sm font-bold text-union-black">{profile.name}</p>
                </div>
            </div>

            <div className="flex gap-4">
                {profile.instagram && (
                    <div className="flex items-center gap-1 text-union-black/60">
                        <Instagram size={14} className="text-pink-500" />
                        <span className="text-[10px] font-bold">@{profile.instagram}</span>
                    </div>
                )}
                {profile.telegram && (
                    <div className="flex items-center gap-1 text-union-black/60">
                        <Send size={14} className="text-blue-400" />
                        <span className="text-[10px] font-bold">@{profile.telegram}</span>
                    </div>
                )}
                {profile.phone && (
                    <div className="flex items-center gap-1 text-union-black/60">
                        <Phone size={14} className="text-union-green-600" />
                        <span className="text-[10px] font-bold">{profile.phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandingOverlay;
