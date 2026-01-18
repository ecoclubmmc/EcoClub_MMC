import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Secretary } from '../types';
import EditableText from './EditableText';

interface SecretaryCardProps {
  secretary: Secretary;
}

export default function SecretaryCard({ secretary }: SecretaryCardProps) {
  const { updateSecretary } = useContext(DataContext);

  return (
    <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-lg hover:shadow-lime-500/20 transition-all group flex flex-col w-full max-w-[240px] mx-auto aspect-[210/297] overflow-hidden relative">
      <div className="h-[70%] w-full bg-slate-800 relative">
        {secretary.image.startsWith('http') || secretary.image.startsWith('/') ? (
          <EditableText 
            value={secretary.image}
            type="image" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            onSave={(val) => updateSecretary(secretary.id, { image: val })}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-slate-700 bg-slate-800">
             <EditableText 
                value={secretary.image || '👤'} 
                tag="span"
                onSave={(val) => updateSecretary(secretary.id, { image: val })}
             />
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50" />
      </div>
      
      <div className="h-[30%] flex flex-col items-center justify-center p-4 bg-slate-900 gap-1 relative z-10">
        <div className="text-lg font-bold text-white text-center w-full leading-tight">
           <EditableText 
             value={secretary.name}
             tag="span"
             className="text-center block hover:text-lime-400 transition-colors cursor-pointer"
             onSave={(val) => updateSecretary(secretary.id, { name: val })}
           />
        </div>
        <div className="inline-block px-3 py-1 bg-lime-500/10 text-lime-400 text-[10px] font-bold tracking-wider uppercase rounded-full border border-lime-500/20">
           <EditableText 
             value={secretary.role}
             tag="span"
             onSave={(val) => updateSecretary(secretary.id, { role: val })}
           />
        </div>
      </div>
    </div>
  );
}
