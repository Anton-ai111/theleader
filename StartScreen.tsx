import React, { useState, useMemo, useEffect } from 'react';
import { getWorldAtYear } from '../data/worldData';
import { CountryDef, LeaderType } from '../types';
import { ChevronRight, Globe, Users, TrendingUp, Shield, Activity, Search, Crown, Vote, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { WorldMap } from './WorldMap';

interface StartScreenProps {
  onStart: (country: CountryDef, leaderName: string, leaderType: LeaderType, startYear: number) => void;
  isLoading: boolean;
}

// Simple list of banned names (lowercase for comparison)
const BANNED_NAMES = [
  'hitler', 'adolf', 'stalin', 'mussolini', 'pol pot', 
  'bin laden', 'osama', 'goebbels', 'himmler', 'mao zedong', 
  'kim jong', 'pinochet', 'saddam', 'hussein', 'gaddafi',
  'idi amin', 'bokassa'
];

const TIMELINES = [
    { year: 1900, label: "The Age of Empires", desc: "Colonialism, Industrialization, Pre-WWI tensions." },
    { year: 1930, label: "The Great Depression", desc: "Economic collapse, Rise of Fascism and Communism." },
    { year: 1948, label: "The Cold War Begins", desc: "Iron Curtain, Nuclear Proliferation, Decolonization." },
    { year: 1980, label: "Late Cold War", desc: "Neoliberalism, Proxy Wars, Technological Boom." },
    { year: 2024, label: "Modern Day", desc: "Information Age, Climate Crisis, Multipolar World." }
];

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading }) => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>("USA");
  const [leaderName, setLeaderName] = useState('');
  const [leaderType, setLeaderType] = useState<LeaderType>('DEMOCRAT');
  const [startYear, setStartYear] = useState<number>(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get the effective world list for the selected timeline
  const activeWorldData = useMemo(() => getWorldAtYear(startYear), [startYear]);

  // Ensure selected country exists in this timeline, otherwise default to first available
  useEffect(() => {
    const exists = activeWorldData.find(c => c.id === selectedCountryId);
    if (!exists && activeWorldData.length > 0) {
        setSelectedCountryId(activeWorldData[0].id);
    }
  }, [startYear, activeWorldData]);

  const selectedCountry = useMemo(() => 
    activeWorldData.find(c => c.id === selectedCountryId) || activeWorldData[0], 
  [selectedCountryId, activeWorldData]);

  const filteredCountries = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return activeWorldData.filter(c => 
        c.name.toLowerCase().includes(lower) || 
        c.id.toLowerCase().includes(lower)
    ).sort((a, b) => b.baseStats.population - a.baseStats.population); // Sort by pop
  }, [searchTerm, activeWorldData]);

  const handleStart = () => {
    const normalized = leaderName.toLowerCase().trim();
    if (BANNED_NAMES.some(banned => normalized.includes(banned))) {
      setError("This name is not permitted.");
      return;
    }
    setError(null);
    if (selectedCountry) {
        onStart(selectedCountry, leaderName, leaderType, startYear);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-auto lg:h-[90vh]">
        
        {/* Left Panel: Map Selection */}
        <div className="w-full lg:w-3/4 p-4 bg-[#020617] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
          <header className="mb-4 flex justify-between items-center px-2">
             <div>
                <h1 className="text-2xl font-serif text-white flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-500" />
                    TheLeader
                </h1>
                <p className="text-slate-400 text-xs">Grand Strategy Simulation</p>
             </div>
             <div className="hidden md:block text-right">
                <div className="text-[10px] text-slate-500 uppercase">Playable Nations</div>
                <div className="text-slate-300 font-mono text-sm">{activeWorldData.length} Countries</div>
             </div>
          </header>
          
          {/* Map Container */}
          <div className="flex-1 rounded-xl border border-slate-800 bg-[#0f172a] relative overflow-hidden group shadow-inner">
            <WorldMap 
                selectedCountryId={selectedCountryId} 
                onSelect={setSelectedCountryId} 
                hoverEnabled={true}
                enableZoom={true}
                year={startYear}
            />
          </div>

          {/* Country Search & List */}
          <div className="mt-4 flex flex-col gap-2 h-40">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search country..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-y-auto pr-2 custom-scrollbar">
                {filteredCountries.map(c => (
                    <button 
                        key={c.id}
                        onClick={() => setSelectedCountryId(c.id)}
                        className={`text-xs p-2 rounded border truncate transition-all text-left ${
                            selectedCountryId === c.id 
                            ? 'border-blue-500 bg-blue-900/30 text-blue-200' 
                            : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                        }`}
                    >
                        {c.name}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Details & Confirm */}
        <div className="w-full lg:w-1/4 p-6 bg-slate-900 flex flex-col border-l border-slate-800 shadow-2xl z-10">
            <div className="flex-1 overflow-y-auto pr-1">
                {selectedCountry && (
                    <div className="mb-6">
                        <h2 className="text-3xl font-serif text-white mb-1 truncate" title={selectedCountry.name}>{selectedCountry.name}</h2>
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-6 font-mono">
                            <Users className="w-3 h-3" />
                            <span>{(selectedCountry.baseStats.population).toLocaleString()} Million</span>
                        </div>

                        {/* Timeline Selector */}
                        <div className="mb-6 space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-2">
                                <Clock className="w-3 h-3"/> Select Timeline
                            </label>
                            <select 
                                value={startYear} 
                                onChange={(e) => setStartYear(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                            >
                                {TIMELINES.map(t => (
                                    <option key={t.year} value={t.year}>{t.year} - {t.label}</option>
                                ))}
                            </select>
                            <div className="text-[10px] text-slate-400 italic leading-tight">
                                {TIMELINES.find(t => t.year === startYear)?.desc}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 flex items-center gap-2"><TrendingUp className="w-3 h-3"/> Economy</span>
                                    <span className="font-mono text-emerald-400">{selectedCountry.baseStats.economy}</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${selectedCountry.baseStats.economy}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 flex items-center gap-2"><Shield className="w-3 h-3"/> Military</span>
                                    <span className="font-mono text-red-400">{selectedCountry.baseStats.military}</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${selectedCountry.baseStats.military}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6 pt-6 border-t border-slate-800">
                    <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Leadership Style</label>
                         <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => setLeaderType('DEMOCRAT')}
                                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${leaderType === 'DEMOCRAT' ? 'bg-blue-900/40 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                            >
                                <Vote className="w-5 h-5" />
                                <span className="text-xs font-bold">Politician</span>
                            </button>
                            <button 
                                onClick={() => setLeaderType('DICTATOR')}
                                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${leaderType === 'DICTATOR' ? 'bg-red-900/40 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                            >
                                <Crown className="w-5 h-5" />
                                <span className="text-xs font-bold">Dictator</span>
                            </button>
                         </div>
                         <div className="text-[10px] text-slate-500 text-center leading-tight h-8">
                            {leaderType === 'DEMOCRAT' 
                                ? "Rule by law. High public approval required. Cannot purge dissenters easily." 
                                : "Rule by force. Total control. Can eliminate opposition, but rebellion risk is high."}
                         </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Head of State</label>
                        <input 
                            type="text" 
                            value={leaderName}
                            onChange={(e) => {
                                setLeaderName(e.target.value);
                                if(error) setError(null);
                            }}
                            placeholder="Enter Leader Name..."
                            className={`w-full bg-slate-950 border rounded p-3 text-white text-sm focus:outline-none placeholder:text-slate-600 ${error ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'}`}
                        />
                        {error && (
                            <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                <AlertTriangle className="w-3 h-3" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button 
                disabled={!leaderName || isLoading || !selectedCountry}
                onClick={handleStart}
                className={`mt-6 w-full font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${leaderType === 'DEMOCRAT' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 'bg-red-700 hover:bg-red-600 shadow-red-900/20 text-white'}`}
            >
                {isLoading ? 'INITIALIZING...' : 'TAKE POWER'}
                {!isLoading && <ChevronRight className="w-4 h-4" />}
            </button>
        </div>
      </div>
    </div>
  );
};