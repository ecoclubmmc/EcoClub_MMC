import { useContext } from 'react';
import { Leaf, Award, Users } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import SecretaryCard from '../components/SecretaryCard';
import EditableText from '../components/EditableText';

export default function AboutPage() {
  const { secretaries, content } = useContext(DataContext);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission Section */}
          <div className="text-center space-y-4">
             <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold mb-4">
                OUR MISSION
             </div>
             <EditableText 
               tag="h1" 
               value={content.aboutTitle} 
               contentKey="aboutTitle"
               className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-lg"
             />
             <EditableText 
               value={content.aboutSubtitle} 
               contentKey="aboutSubtitle"
               className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
             />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             {[
               { title: "Sustainability", icon: <Leaf />, desc: "Promoting green practices on campus." },
               { title: "Awareness", icon: <Award />, desc: "Educating peers about ecological impact." },
               { title: "Action", icon: <Users />, desc: "Organizing drives and planting events." }
             ].map((item, i) => (
               <div key={i} className="bg-black/40 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/10 text-center hover:-translate-y-2 transition-transform duration-300 group">
                  <div className="w-14 h-14 mx-auto bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all border border-white/10">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h3>
                  <p className="text-slate-300">{item.desc}</p>
               </div>
             ))}
          </div>

          {/* Secretaries Section */}
          <div className="pt-12 border-t border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center uppercase tracking-widest">
               <span className="text-emerald-500 text-xl block mb-2">Team</span>
               Core Committee
            </h2>
            
            {secretaries.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {secretaries.map(sec => (
                  <SecretaryCard key={sec.id} secretary={sec} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/40 backdrop-blur-md rounded-[2rem] border border-white/20 border-dashed">
                <p className="text-slate-400 italic">Team data loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
