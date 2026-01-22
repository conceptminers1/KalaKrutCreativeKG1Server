import React from 'react';
import { LeaderboardEntry, UserRole } from '../types';
import { Trophy, TrendingUp, TrendingDown, Medal } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="bg-kala-800/50 backdrop-blur-md border border-kala-700 rounded-xl p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-yellow-400" /> Top Contributors
          </h2>
          <p className="text-kala-400 text-sm mt-1">Weekly XP Rankings across the DAO</p>
        </div>
        <div className="bg-kala-900 px-3 py-1 rounded-full text-xs text-kala-secondary font-mono border border-kala-700">
          Season 4: Week 2
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-kala-400 text-xs uppercase border-b border-kala-700/50">
              <th className="py-3 pl-2">Rank</th>
              <th className="py-3">User</th>
              <th className="py-3 text-center">Role</th>
              <th className="py-3 text-right">XP Earned</th>
              <th className="py-3 text-right pr-2">Trend</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.user.id} className="group hover:bg-kala-700/30 transition-colors border-b border-kala-800 last:border-0">
                <td className="py-4 pl-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                    entry.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                    'text-kala-400'
                  }`}>
                    {entry.rank}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={entry.user.avatar} 
                      alt={entry.user.name} 
                      className="w-10 h-10 rounded-full border-2 border-kala-800 group-hover:border-kala-secondary transition-colors object-cover"
                    />
                    <div>
                      <div className="font-semibold text-slate-200">{entry.user.name}</div>
                      <div className="flex gap-1 mt-1">
                        {entry.badges.map((badge, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-kala-700 text-kala-300 border border-kala-600">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    entry.user.role === UserRole.ARTIST ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    entry.user.role === UserRole.VENUE ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    entry.user.role === UserRole.SPONSOR ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    'bg-slate-700/50 text-slate-400 border-slate-600'
                  }`}>
                    {entry.user.role}
                  </span>
                </td>
                <td className="py-4 text-right font-mono text-kala-secondary font-bold">
                  {entry.user.xp.toLocaleString()} XP
                </td>
                <td className="py-4 text-right pr-2">
                  <div className="flex items-center justify-end gap-1">
                    {entry.change > 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-emerald-400">+{entry.change}</span>
                      </>
                    ) : entry.change < 0 ? (
                      <>
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                        <span className="text-xs text-rose-400">{entry.change}</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;