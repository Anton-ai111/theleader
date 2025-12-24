import React, { useState } from 'react';
import { GameState, CountryDef, LeaderType } from './types';
import { Dashboard } from './components/Dashboard';
import { StartScreen } from './components/StartScreen';
import { initializeGame } from './services/gemini';
import { RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  const startGame = async (country: CountryDef, leaderName: string, leaderType: LeaderType, startYear: number) => {
    setIsLoading(true);
    try {
      const initialState = await initializeGame(country.name, leaderName, leaderType, country.baseStats, startYear);
      setGameState({
        countryName: country.name,
        leaderName: leaderName,
        leaderType: leaderType,
        turn: 1,
        startYear: startYear,
        level: 1,
        stats: initialState.stats,
        laws: initialState.laws || [],
        globalTension: initialState.globalTension || 10,
        events: [initialState.event],
        isGameOver: false,
        controlledCountryIds: [country.id, ...(initialState.controlledCountryIds || [])],
        tradePartners: initialState.tradePartners || [],
        wars: initialState.wars || []
      });
    } catch (error) {
      console.error("Failed to start game", error);
      alert("Failed to initialize game engine. Please check API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameOver = (reason: string) => {
    setGameOverReason(reason);
  };

  const resetGame = () => {
    setGameState(null);
    setGameOverReason(null);
  };

  if (gameOverReason) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
        <h1 className="text-6xl font-serif text-red-600 mb-6 tracking-widest uppercase">Regime Fallen</h1>
        <p className="text-slate-400 text-xl max-w-2xl mb-12 font-mono leading-relaxed">{gameOverReason}</p>
        
        {gameState && (
            <div className="grid grid-cols-2 gap-8 text-left mb-12 border-t border-slate-800 pt-8">
                <div>
                    <div className="text-xs text-slate-600 uppercase">Years in Power</div>
                    <div className="text-2xl text-slate-200 font-mono">{Math.floor(gameState.turn / 4)} Years</div>
                </div>
                 <div>
                    <div className="text-xs text-slate-600 uppercase">Final Ideology</div>
                    <div className="text-2xl text-slate-200 font-mono">{gameState.stats.ideologyScore > 0 ? "Right-Wing" : "Left-Wing"}</div>
                </div>
            </div>
        )}

        <button 
            onClick={resetGame}
            className="group flex items-center gap-3 px-8 py-3 border border-slate-700 hover:bg-slate-900 hover:text-white hover:border-white transition-all text-slate-400 rounded-full"
        >
            <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
            <span>START NEW TIMELINE</span>
        </button>
      </div>
    );
  }

  if (!gameState) {
    return <StartScreen onStart={startGame} isLoading={isLoading} />;
  }

  return (
    <Dashboard 
      gameState={gameState} 
      setGameState={setGameState} 
      onGameOver={handleGameOver} 
    />
  );
};

export default App;