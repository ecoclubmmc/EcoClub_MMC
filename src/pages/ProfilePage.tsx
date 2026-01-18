import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import HolographicBadge from '../components/HolographicBadge';
import { DefaultAvatars } from '../types';

export default function ProfilePage() {
  const { user } = useContext(DataContext);
  
  if (!user) return <Navigate to="/login" />;

  // Find the user's avatar
  const userAvatar = DefaultAvatars.find(a => a.id === user.avatar) || DefaultAvatars[0];

  return (
    <div className="pt-24 pb-12 min-h-screen bg-transparent text-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <div className="bg-black/40 backdrop-blur-md rounded-[2.5rem] shadow-lg border border-white/10 p-8 text-center sticky top-24">
                {/* Large Avatar Display */}
                <div 
                  className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl mb-4 shadow-lg ring-4 ring-white/10 bg-white/5"
                  style={{ backgroundColor: userAvatar.color }}
                >
                  {userAvatar.emoji}
                </div>
                
                <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
                <div className="inline-block px-3 py-1 my-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">{user.role}</p>
                </div>
                <p className="text-slate-400 text-sm mb-8 font-bold tracking-wider">BATCH {user.batch}</p>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Badges</p>
                     <p className="text-3xl font-bold text-white">{user.badges.filter(b => b.status === 'active').length}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Pending</p>
                     <p className="text-3xl font-bold text-slate-300">{user.badges.filter(b => b.status === 'pending').length}</p>
                  </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-400" /> Achievements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                 {user.badges.map((badge, idx) => (
                   <HolographicBadge key={idx} badge={badge} />
                 ))}
                 
                 {user.badges.length === 0 && (
                   <div className="col-span-full py-12 text-center text-slate-400 bg-black/30 rounded-[2rem] border border-dashed border-white/10 font-bold text-sm uppercase tracking-wide">
                     NO BADGES EARNED
                   </div>
                 )}
              </div>
            </div>
            
            <div>
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400" /> Recent Activity
               </h3>
               <div className="bg-black/40 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-white/10 p-8">
                  <div className="space-y-6">
                    {/* Activity Timeline Placeholder */}
                    <div className="flex gap-4">
                       <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-emerald-500/20" />
                          <div className="w-0.5 h-full bg-white/10 my-1" />
                       </div>
                       <div className="pb-6">
                          <p className="text-sm font-bold text-white">Joined Eco Club</p>
                          <p className="text-xs text-slate-400 mt-1">BATCH {user.batch}</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
