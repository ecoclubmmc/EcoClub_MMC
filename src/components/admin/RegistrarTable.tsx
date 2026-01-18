import React, { useContext, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { DataContext } from '../../context/DataContext';

export default function RegistrarTable() {
  const { registrations, events } = useContext(DataContext);
  const [filterEvent, setFilterEvent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = registrations.filter(reg => {
    const matchesEvent = filterEvent ? reg.eventId === filterEvent : true;
    const matchesSearch = reg.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const getValue = (reg: any, keys: string[]) => {
    for (const k of keys) {
      // Case insensitive check
      const foundKey = Object.keys(reg.formData).find(fk => fk.toLowerCase() === k.toLowerCase());
      if (foundKey) return reg.formData[foundKey];
    }
    return '-';
  };

  const exportCSV = () => {
    const headers = ['Registration ID', 'User Name', 'Email', 'Batch', 'Event', 'Competition', 'Date', 'Details'];
    const rows = filtered.map(r => [
      r.id, 
      r.userName, 
      r.userEmail,
      getValue(r, ['batch', 'year']),
      r.eventTitle,
      getValue(r, ['competition', 'category', 'event']), 
      new Date(r.timestamp).toLocaleDateString(),
      JSON.stringify(r.formData).replace(/"/g, '""') // Basic escape
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mmc_registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-wrap gap-4 justify-between items-center bg-slate-800/50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white">Registrar Master Table</h3>
          <span className="bg-lime-500/10 text-lime-400 text-xs px-2 py-1 rounded-full font-bold border border-lime-500/20">{filtered.length} Records</span>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:border-lime-500 outline-none w-48 placeholder-slate-500"
            />
          </div>
          <select 
            value={filterEvent} 
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:border-lime-500 outline-none"
          >
            <option value="">All Events</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-lime-600 text-white text-sm font-bold rounded-lg hover:bg-lime-500 transition-colors shadow-md"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-xs border-b border-slate-700">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Batch</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Competition</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Form Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500 italic">No records found</td></tr>
            ) : filtered.map(reg => (
              <tr key={reg.id} className="hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-white group-hover:text-lime-400 transition-colors">{reg.userName}</div>
                  <div className="text-xs text-slate-500">{reg.userEmail}</div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-300">
                  {getValue(reg, ['batch', 'year'])}
                </td>
                <td className="px-6 py-4 font-medium text-lime-400">{reg.eventTitle}</td>
                <td className="px-6 py-4 font-medium text-slate-300">
                  {getValue(reg, ['competition', 'category', 'event'])}
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(reg.timestamp).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(reg.formData).map(([k, v]) => (
                      <span key={k} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
