import { useContext, useState, useEffect } from 'react';
import { Settings, Users, Calendar, Globe, Save } from 'lucide-react';
import RegistrarTable from '../../components/admin/RegistrarTable';
import EventManager from '../../components/admin/EventManager';
import SecretaryManager from '../../components/admin/SecretaryManager';
import { DataContext } from '../../context/DataContext';

export default function AdminDashboard() {
  const { content, updateContent } = useContext(DataContext);
  const [faviconUrl, setFaviconUrl] = useState('');
  
  // Local state for site settings
  const [localContent, setLocalContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    history: '',
    mission: '',
  });

  // Sync local state when content is loaded
  useEffect(() => {
    if (content) {
      setLocalContent(prev => ({
        ...prev,
        heroTitle: content.heroTitle || '',
        heroSubtitle: content.heroSubtitle || '',
        history: content.history || '',
        mission: content.mission || '',
      }));
      setFaviconUrl(content.favicon || '');
    }
  }, [content]);

  const handleSaveSettings = async () => {
    try {
      await updateContent('favicon', faviconUrl);
      await updateContent('heroTitle', localContent.heroTitle);
      await updateContent('heroSubtitle', localContent.heroSubtitle);
      await updateContent('history', localContent.history);
      await updateContent('mission', localContent.mission);
      alert('Site settings updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings.');
    }
  };

  const updateLocalContent = (field: string, value: string) => {
    setLocalContent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-transparent text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 bg-black/60 backdrop-blur-md w-fit px-6 py-3 rounded-2xl shadow-lg border border-white/10">
          <Settings className="text-emerald-500" />
          Admin Control Center
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RegistrarTable />
            <SecretaryManager />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <EventManager />
            
            {/* Site Settings */}
            <div className="bg-black/60 backdrop-blur-md rounded-[2rem] shadow-lg border border-white/10 p-6">
               <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Globe className="w-5 h-5 text-emerald-400" /> Site Settings
               </h3>
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                      Favicon URL
                    </label>
                    <input 
                      placeholder="https://example.com/favicon.ico"
                      value={faviconUrl}
                      className="w-full p-3 bg-black/40 rounded-xl border border-white/10 focus:border-emerald-500 text-white outline-none text-sm placeholder-slate-500 transition-colors"
                      onChange={e => setFaviconUrl(e.target.value)}
                    />
                  </div>

                  <div className="h-[1px] bg-white/10 my-4" />
                  
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Homepage Content</h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Hero Title</label>
                    <input 
                      value={localContent.heroTitle}
                      onChange={e => updateLocalContent('heroTitle', e.target.value)}
                      className="w-full p-3 bg-black/40 rounded-xl border border-white/10 focus:border-emerald-500 text-white outline-none text-sm"
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Hero Subtitle</label>
                    <textarea 
                      value={localContent.heroSubtitle}
                      rows={2}
                      onChange={e => updateLocalContent('heroSubtitle', e.target.value)}
                      className="w-full p-3 bg-black/40 rounded-xl border border-white/10 focus:border-emerald-500 text-white outline-none text-sm"
                    />
                  </div>

                  <div className="h-[1px] bg-white/10 my-4" />
                  
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Vision & Mission</h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Vision Text (History)</label>
                    <textarea 
                      value={localContent.history}
                      rows={3}
                      onChange={e => updateLocalContent('history', e.target.value)}
                      className="w-full p-3 bg-black/40 rounded-xl border border-white/10 focus:border-emerald-500 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Mission Text</label>
                     <textarea 
                      value={localContent.mission}
                      rows={3}
                      onChange={e => updateLocalContent('mission', e.target.value)}
                      className="w-full p-3 bg-black/40 rounded-xl border border-white/10 focus:border-emerald-500 text-white outline-none text-sm"
                    />
                  </div>

                  <div className="h-[1px] bg-white/10 my-4" />

                  <button 
                    onClick={handleSaveSettings}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-500 border border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/20"
                  >
                    <Save className="w-4 h-4" /> Update Favicon & Settings
                  </button>
               </div>
            </div>

            <div className="bg-black/60 backdrop-blur-md rounded-[2rem] shadow-lg border border-white/10 p-6">
              <h3 className="font-bold text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                    <p className="text-3xl font-bold text-emerald-400">124</p>
                    <p className="text-xs text-emerald-600 font-bold uppercase mt-1 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" /> Members
                    </p>
                 </div>
                 <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                    <p className="text-3xl font-bold text-emerald-400">8</p>
                    <p className="text-xs text-emerald-600 font-bold uppercase mt-1 flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" /> Events
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
