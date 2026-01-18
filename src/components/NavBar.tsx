import { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function NavBar() {
  const { user, logout, content } = useContext(DataContext);
  const location = useLocation();

  useEffect(() => {
    if (content.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = content.favicon;
    }
  }, [content.favicon]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/60 backdrop-blur-md border-b border-white/10 shadow-sm transition-all">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300 transform group-hover:scale-105 bg-white p-0.5">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
          MMC Eco Club
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-6 text-slate-300 font-medium">
          <Link to="/" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/' ? 'text-emerald-400' : ''}`}>Home</Link>
          <Link to="/about" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/about' ? 'text-emerald-400' : ''}`}>About</Link>
          <Link to="/events" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/events' ? 'text-emerald-400' : ''}`}>Events</Link>
          <Link to="/campus-activities" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/campus-activities' ? 'text-emerald-400' : ''}`}>Campus Activities</Link>
          <Link to="/field-visits" className={`hover:text-emerald-400 transition-colors ${location.pathname === '/field-visits' ? 'text-emerald-400' : ''}`}>Field Visits</Link>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
             <Link to="/profile">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 hover:border-emerald-500/30">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  {user.name[0]}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
              </div>
             </Link>
             {user.role === 'admin' && (
               <Link to="/admin" className="p-2 text-slate-400 hover:text-emerald-400 transition-colors" title="Admin Dashboard">
                 <Settings className="w-5 h-5" />
               </Link>
             )}
             <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        ) : (
          <Link to="/login" className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
