import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GameState, Law } from '../types';
import { getWorldAtYear } from '../data/worldData';
import { 
    Shield, TrendingUp, Users, Scale, Activity, Globe, Skull, 
    ThumbsUp, ThumbsDown, Crown, Vote, Gavel, FileText, 
    Swords, Handshake, Target, Wifi, Plane, Ship, AlertTriangle, Medal, Star
} from 'lucide-react';
import { processTurn } from '../services/gemini';
import { WorldMap } from './WorldMap';

interface DashboardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onGameOver: (reason: string) => void;
}

type Tab = 'overview' | 'laws' | 'diplomacy' | 'military';

export const Dashboard: React.FC<DashboardProps> = ({ gameState, setGameState, onGameOver }) => {
  const [customAction, setCustomAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState.events]);

  const currentYear = useMemo(() => {
      return gameState.startYear + Math.floor((gameState.turn - 1) / 4);
  }, [gameState.turn, gameState.startYear]);

  // Level Up Logic: Check if player survived 4 years (16 turns)
  useEffect(() => {
    if (gameState.turn > 1 && (gameState.turn - 1) % 16 === 0) {
        setShowLevelUp(true);
        // Bonus stats for surviving a term
        setGameState(prev => ({
            ...prev,
            level: prev.level + 1,
            stats: {
                ...prev.stats,
                approval: Math.min(100, prev.stats.approval + 5),
                stability: Math.min(100, prev.stats.stability + 5)
            }
        }));
    }
  }, [gameState.turn]);

  const handleAction = async (actionText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const result = await processTurn(gameState, actionText);
      
      if (result.gameOver) {
        onGameOver(result.gameOverReason || "Your regime has fallen.");
        return;
      }

      setGameState(prev => ({
        ...prev,
        turn: prev.turn + 1,
        stats: result.stats,
        laws: result.laws || prev.laws,
        globalTension: result.globalTension,
        events: [result.event, ...prev.events],
        controlledCountryIds: result.controlledCountryIds || prev.controlledCountryIds,
        tradePartners: result.tradePartners || prev.tradePartners,
        wars: result.wars || prev.wars
      }));
      setCustomAction('');
    } catch (e) {
      console.error("Action failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const activeWorldData = useMemo(() => getWorldAtYear(currentYear), [currentYear]);

  const handleLawToggle = (law: Law) => {
    const action = law.isActive 
        ? `Repeal the "${law.title}" law.` 
        : `Pass the "${law.title}" law.`;
    handleAction(action);
  };

  const handleDiplomacy = (targetId: string, type: 'trade' | 'war') => {
    const target = activeWorldData.find(c => c.id === targetId);
    if (!target) return;

    if (type === 'war') {
        const hasMajorAlliance = target.alliances.some(a => ['NATO', 'BRICS', 'EU', 'US Treaty Ally', 'Warsaw Pact', 'Allies'].includes(a));
        const confirmMsg = hasMajorAlliance 
            ? `WARNING: ${target.name} is a member of ${target.alliances.join(', ')}. Declaring war will likely trigger a massive global conflict. Proceed?`
            : `Declare war on ${target.name}?`;
        
        if (!window.confirm(confirmMsg)) return;
        handleAction(`Declare war on ${target.name} (ID: ${target.id}).`);
    } else {
        const isTrading = gameState.tradePartners?.includes(targetId);
        const action = isTrading 
            ? `End trade agreement with ${target.name}.`
            : `Establish trade agreement with ${target.name}.`;
        handleAction(action);
    }
  };

  const handleMilitaryInvest = (branch: string) => {
    handleAction(`Invest heavily in modernizing the ${branch} branch of the military.`);
  };

  const filteredCountries = useMemo(() => {
    return activeWorldData.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        c.name !== gameState.countryName
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, gameState.countryName, activeWorldData]);

  const statItem = (icon: React.ReactNode, label: string, value: number, color: string) => (
    <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
      <div className={`p-2 rounded-md ${color} bg-opacity-20`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-5 h-5 ${color.replace('bg-', 'text-')}` })}
      </div>
      <div>
        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">{label}</div>
        <div className="text-xl font-mono font-bold text-slate-100">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 flex flex-col gap-4 max-w-7xl mx-auto relative">
      
      {/* Level Up Overlay */}
      {showLevelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
              <div className="bg-slate-900 border border-yellow-500/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-yellow-900/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/10 to-transparent"></div>
                  <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-500 mb-4 animate-bounce">
                          <Medal className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-serif text-yellow-500 mb-2">Term Completed!</h2>
                      <p className="text-slate-300 mb-6">
                          You have successfully survived 4 years in office. Your grip on power tightens.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                          <div className="bg-slate-800 p-3 rounded border border-slate-700">
                              <div className="text-slate-500 text-xs uppercase">Approval</div>
                              <div className="text-green-400 font-bold">+5%</div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded border border-slate-700">
                              <div className="text-slate-500 text-xs uppercase">Stability</div>
                              <div className="text-green-400 font-bold">+5%</div>
                          </div>
                      </div>
                      <button 
                        onClick={() => setShowLevelUp(false)}
                        className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors"
                      >
                          BEGIN TERM {gameState.level}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white flex items-center gap-2">
            {gameState.countryName}
            {gameState.leaderType === 'DICTATOR' ? <Crown className="w-5 h-5 text-red-500" /> : <Vote className="w-5 h-5 text-blue-500" />}
          </h1>
          <p className="text-slate-400 text-sm flex items-center gap-2">
              Leader: <span className={gameState.leaderType === 'DICTATOR' ? "text-red-400 font-bold" : "text-blue-400"}>{gameState.leaderName}</span> 
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 font-mono">Year {currentYear}</span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current"/> Term {gameState.level}</span>
          </p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
            <div className="bg-slate-900 px-3 py-1 rounded border border-slate-700 text-slate-400">
                TURN: <span className="text-white">{gameState.turn}</span>
            </div>
            <div className="bg-slate-900 px-3 py-1 rounded border border-slate-700 text-slate-400">
                TENSION: <span className={`${gameState.globalTension > 70 ? 'text-red-500 animate-pulse font-bold' : 'text-amber-500'}`}>{gameState.globalTension}%</span>
            </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItem(<Activity />, "Stability", gameState.stats.stability, "bg-teal-500")}
          {statItem(<TrendingUp />, "Economy", gameState.stats.economy, "bg-emerald-500")}
          {statItem(<Shield />, "Military", gameState.stats.military, "bg-red-500")}
          <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
            <div className={`p-2 rounded-md ${gameState.stats.approval > 50 ? 'bg-blue-500' : 'bg-orange-500'} bg-opacity-20`}>
              {gameState.stats.approval > 50 ? <ThumbsUp className="w-5 h-5 text-blue-500" /> : <ThumbsDown className="w-5 h-5 text-orange-500" />}
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Approval</div>
              <div className="text-xl font-mono font-bold text-slate-100">{gameState.stats.approval}%</div>
            </div>
          </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto">
          {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'laws', label: 'Laws & Decree', icon: Gavel },
              { id: 'military', label: 'War Room', icon: Swords },
              { id: 'diplomacy', label: 'Diplomacy', icon: Handshake },
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'border-blue-500 text-white bg-slate-800/50' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
              </button>
          ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
        
        {/* Dynamic Left Column */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
            
            {activeTab === 'overview' && (
                <div className="flex flex-col h-full">
                    <div className="relative w-full h-[400px] bg-[#050b14] border-b border-slate-800 flex items-center justify-center group">
                        <WorldMap 
                            controlledCountryIds={gameState.controlledCountryIds} 
                            hoverEnabled={true} 
                            enableZoom={true}
                            year={currentYear}
                        />
                         <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 bg-black/50 px-2 py-1 rounded">
                            Scroll to Zoom • Drag to Pan
                        </div>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Scale className="w-3 h-3"/> Active Conflicts</h3>
                             {gameState.wars && gameState.wars.length > 0 ? (
                                <div className="space-y-1">
                                    {gameState.wars.map(warId => (
                                        <div key={warId} className="bg-red-900/20 text-red-200 px-2 py-1 rounded text-xs border border-red-900/50 flex items-center gap-2">
                                            <Swords className="w-3 h-3" /> War with {warId}
                                        </div>
                                    ))}
                                </div>
                             ) : <div className="text-xs text-slate-500 italic">No active wars.</div>}
                        </div>
                         <div className="space-y-2">
                             <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Handshake className="w-3 h-3"/> Trade Network</h3>
                             {gameState.tradePartners && gameState.tradePartners.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {gameState.tradePartners.map(pId => (
                                        <span key={pId} className="bg-emerald-900/20 text-emerald-200 px-2 py-1 rounded text-xs border border-emerald-900/50">
                                            {pId}
                                        </span>
                                    ))}
                                </div>
                             ) : <div className="text-xs text-slate-500 italic">Isolationist policy. No partners.</div>}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'laws' && (
                <div className="p-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gameState.laws && gameState.laws.map(law => (
                            <button 
                            key={law.id} 
                            disabled={isProcessing}
                            onClick={() => handleLawToggle(law)}
                            className={`flex flex-col gap-1 p-3 rounded-lg border text-left transition-all ${
                                law.isActive 
                                ? 'bg-blue-900/20 border-blue-500/50 hover:bg-blue-900/30' 
                                : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`font-bold text-sm ${law.isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {law.title}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                    law.isActive ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-500'
                                }`}>
                                    {law.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">{law.description}</p>
                            <div className="text-[10px] text-slate-500 font-mono mt-1 flex gap-2">
                                <span className="uppercase text-slate-600 bg-slate-900 px-1 rounded">{law.type}</span>
                                <span className="text-slate-400">{law.effectDescription}</span>
                            </div>
                        </button>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'military' && (
                <div className="p-4 flex flex-col h-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <button disabled={isProcessing} onClick={() => handleMilitaryInvest('ARMY')} className="p-4 bg-slate-800 border border-slate-700 hover:border-red-500 rounded-lg flex flex-col items-center gap-2 group">
                            <Target className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">ARMY</span>
                            <span className="text-[10px] text-slate-500 text-center">Land Defense</span>
                        </button>
                        <button disabled={isProcessing} onClick={() => handleMilitaryInvest('NAVY')} className="p-4 bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-lg flex flex-col items-center gap-2 group">
                            <Ship className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">NAVY</span>
                            <span className="text-[10px] text-slate-500 text-center">Power Projection</span>
                        </button>
                         <button disabled={isProcessing} onClick={() => handleMilitaryInvest('AIR FORCE')} className="p-4 bg-slate-800 border border-slate-700 hover:border-sky-400 rounded-lg flex flex-col items-center gap-2 group">
                            <Plane className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">AIR FORCE</span>
                            <span className="text-[10px] text-slate-500 text-center">Strike Capability</span>
                        </button>
                         <button disabled={isProcessing} onClick={() => handleMilitaryInvest('CYBER')} className="p-4 bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded-lg flex flex-col items-center gap-2 group">
                            <Wifi className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">CYBER</span>
                            <span className="text-[10px] text-slate-500 text-center">Intel & Sabotage</span>
                        </button>
                    </div>
                    
                    <div className="bg-slate-950 rounded p-4 border border-slate-800 flex-1">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Military Doctrine</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Invest in specific branches to counter different threats. Cyber warfare is low-risk but effective against economy. Navy is essential for overseas projection.
                        </p>
                        {gameState.stats.military < 30 && (
                            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/10 p-2 rounded border border-red-900/50">
                                <AlertTriangle className="w-4 h-4" />
                                <span>CRITICAL WEAKNESS: Your armed forces are unprepared for invasion.</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'diplomacy' && (
                <div className="flex flex-col h-full">
                    <div className="p-3 border-b border-slate-800 flex gap-2">
                         <input 
                            type="text" 
                            placeholder="Search nations..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950 text-xs text-slate-500 uppercase sticky top-0">
                                <tr>
                                    <th className="p-3">Nation</th>
                                    <th className="p-3">Alliances</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredCountries.map(c => {
                                    const isAtWar = gameState.wars?.includes(c.id);
                                    const isAlly = gameState.tradePartners?.includes(c.id);

                                    return (
                                        <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="p-3">
                                                <div className="font-bold text-white">{c.name}</div>
                                                <div className="text-[10px] text-slate-500">Pop: {c.baseStats.population}M • Eco: {c.baseStats.economy}</div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {c.alliances.map(a => (
                                                        <span key={a} className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 whitespace-nowrap">
                                                            {a}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-3 text-right space-x-2">
                                                <button 
                                                    disabled={isProcessing || isAtWar}
                                                    onClick={() => handleDiplomacy(c.id, 'trade')}
                                                    className={`px-3 py-1 rounded text-xs border transition-colors ${
                                                        isAlly 
                                                        ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400 hover:bg-emerald-900/40' 
                                                        : 'bg-slate-800 border-slate-600 hover:bg-slate-700'
                                                    }`}
                                                >
                                                    {isAlly ? 'End Trade' : 'Trade'}
                                                </button>
                                                <button 
                                                    disabled={isProcessing || isAtWar}
                                                    onClick={() => handleDiplomacy(c.id, 'war')}
                                                    className={`px-3 py-1 rounded text-xs border transition-colors ${
                                                        isAtWar 
                                                        ? 'bg-red-900/20 border-red-500 text-red-500 cursor-not-allowed' 
                                                        : 'bg-slate-800 border-slate-600 hover:border-red-500 hover:text-red-400'
                                                    }`}
                                                >
                                                    {isAtWar ? 'AT WAR' : 'WAR'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>

        {/* Right Column: Events & Quick Actions */}
        <div className="lg:col-span-4 flex flex-col gap-4">
             {/* Events Feed */}
             <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-[400px] flex flex-col">
                 <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Global Intelligence Feed
                 </h3>
                 <div className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth custom-scrollbar" ref={scrollRef}>
                    {gameState.events.map((event, idx) => (
                        <div key={idx} className={`p-3 rounded border-l-2 ${
                            event.type === 'war' ? 'border-red-500 bg-red-900/10' :
                            event.type === 'economic' ? 'border-emerald-500 bg-emerald-900/10' :
                            event.type === 'political' ? 'border-blue-500 bg-blue-900/10' :
                            'border-slate-500 bg-slate-800/50'
                        }`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-300 uppercase">{event.title}</span>
                                <span className="text-[10px] text-slate-500">Turn {event.turn}</span>
                            </div>
                            <p className="text-sm text-slate-300 mb-1">{event.description}</p>
                            <p className="text-xs text-slate-500 italic">Result: {event.consequence}</p>
                        </div>
                    ))}
                 </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">State Decrees</h3>
                 
                 {/* ELIMINATE OPPOSITION BUTTON */}
                <button 
                    disabled={isProcessing} 
                    onClick={() => handleAction(gameState.leaderType === 'DICTATOR' ? "Purge all political opposition and dissenters" : "Suppress opposition media and arrest critics")} 
                    className={`group p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-left transition-all relative overflow-hidden ${gameState.leaderType === 'DICTATOR' ? 'hover:border-red-600' : 'hover:border-orange-500'}`}
                >
                    <div className={`absolute inset-0 transition-all ${gameState.leaderType === 'DICTATOR' ? 'bg-red-900/10 group-hover:bg-red-900/30' : 'bg-orange-900/10 group-hover:bg-orange-900/20'}`}></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <Skull className={`w-5 h-5 transition-transform ${gameState.leaderType === 'DICTATOR' ? 'text-red-600' : 'text-orange-500'}`} />
                        <div>
                            <div className={`font-bold text-sm ${gameState.leaderType === 'DICTATOR' ? 'text-red-100' : 'text-orange-100'}`}>
                                {gameState.leaderType === 'DICTATOR' ? "PURGE DISSENTERS" : "SUPPRESS OPPOSITION"}
                            </div>
                            <div className="text-xs text-slate-400">
                                {gameState.leaderType === 'DICTATOR' ? "Eliminate enemies. Pop--, Stability++" : "Censor critics. Approval--, Stability+"}
                            </div>
                        </div>
                    </div>
                </button>

                 <div className="mt-2">
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase">Custom Order</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={customAction}
                            onChange={(e) => setCustomAction(e.target.value)}
                            placeholder="E.g., Host a summit, Deploy spies..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600"
                            disabled={isProcessing}
                            onKeyDown={(e) => e.key === 'Enter' && customAction && handleAction(customAction)}
                        />
                        <button 
                            onClick={() => customAction && handleAction(customAction)}
                            disabled={isProcessing || !customAction}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
                        >
                            {isProcessing ? '...' : 'EXECUTE'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};