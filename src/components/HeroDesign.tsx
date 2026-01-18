import { useContext } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableText from './EditableText';
import { DataContext } from '../context/DataContext';

export default function HeroDesign() {
  const { content, updateContent } = useContext(DataContext);

  return (
    <div className="relative pt-32 pb-20 overflow-hidden min-h-[70vh] flex items-center justify-center text-center px-6">
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
         >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 font-bold tracking-wide uppercase text-sm mb-6">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               Nature &bull; Sustainability &bull; Action
            </div>

            <EditableText 
              tag="h1" 
              value={content.heroTitle || "Protecting Our Planet"} 
              contentKey="heroTitle"
              className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-lg"
            />
            
            <EditableText 
              tag="p"
              value={content.heroSubtitle || "Join the movement to create a sustainable future for our community and beyond."}
              contentKey="heroSubtitle"
              className="text-lg md:text-xl text-slate-100 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md mt-6"
            />
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.8 }}
           className="flex flex-wrap justify-center gap-4"
         >
            <Link to="/events" className="group px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-xl hover:shadow-emerald-500/20">
               Get Involved <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/about" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all">
               Our Mission
            </Link>
         </motion.div>
      </div>
    </div>
  );
}
