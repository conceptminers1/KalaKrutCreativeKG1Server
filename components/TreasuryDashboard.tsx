
import React, { useState } from 'react';
import { MOCK_TREASURY_ASSETS } from '../mockData';
import { Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, PieChart, Download, Building2, Gift, ChevronDown, ChevronUp } from 'lucide-react';

const EXPENSE_DATA = {
  operational: [
    { label: 'Staff Salaries', value: 22500 },
    { label: 'Portal Running Costs (Server/Cloud)', value: 3200 },
    { label: 'Office Rental', value: 4500 },
    { label: 'Office Expenses (Utilities/Supplies)', value: 1200 },
    { label: 'Marketing Campaigns', value: 5000 },
    { label: 'Digital Ads', value: 3500 },
    { label: 'Loan/Equipment EMI', value: 2000 },
    { label: 'Investor Payouts', value: 8500 },
    { label: 'Miscellaneous', value: 1500 },
  ],
  grants: [
    { label: 'Portal Events & Hackathons', value: 12000 },
    { label: 'DAO Grants to Users', value: 18000 },
  ]
};

const TreasuryDashboard: React.FC = () => {
  const [showBreakdown, setShowBreakdown] = useState(true);

  const totalValue = MOCK_TREASURY_ASSETS.reduce((sum, asset) => sum + asset.valueUsd, 0);
  
  const totalOperational = EXPENSE_DATA.operational.reduce((sum, item) => sum + item.value, 0);
  const totalGrants = EXPENSE_DATA.grants.reduce((sum, item) => sum + item.value, 0);
  const totalBurn = totalOperational + totalGrants;

  // Assuming a rough runway calculation based on cash assets (USDC + ETH portion) vs burn
  const liquidAssets = MOCK_TREASURY_ASSETS.filter(a => ['USDC', 'ETH'].includes(a.symbol)).reduce((sum, a) => sum + a.valueUsd, 0);
  const runwayMonths = Math.floor(liquidAssets / totalBurn);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Coins className="text-kala-secondary" /> Treasury Management
          </h2>
          <p className="text-kala-400 text-sm">Real-time overview of DAO assets, liquidity, and allocations.</p>
        </div>
        <button className="flex items-center gap-2 bg-kala-800 text-kala-300 px-4 py-2 rounded-lg border border-kala-700 hover:text-white transition-colors text-sm font-bold">
           <Download className="w-4 h-4" /> Monthly Report (PDF)
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-green-900/40 to-kala-900 border border-green-500/20 rounded-xl p-6">
            <div className="text-kala-400 text-sm font-bold uppercase mb-2">Total Treasury Value</div>
            <div className="text-3xl font-mono text-white font-bold">${totalValue.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2 text-xs text-green-400 bg-green-500/10 w-fit px-2 py-1 rounded">
               <TrendingUp className="w-3 h-3" /> +4.2% (30d)
            </div>
         </div>
         <div className="bg-kala-800 border border-kala-700 rounded-xl p-6 relative overflow-hidden">
            <div className="text-kala-400 text-sm font-bold uppercase mb-2">Monthly Burn Rate</div>
            <div className="text-3xl font-mono text-white font-bold">${totalBurn.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2 text-xs text-red-400 bg-red-500/10 w-fit px-2 py-1 rounded">
               <ArrowUpRight className="w-3 h-3" /> Operations & Grants
            </div>
            {/* Mini bar chart visual */}
            <div className="absolute bottom-0 left-0 w-full h-1 flex">
               <div className="bg-blue-500" style={{ width: `${(totalOperational / totalBurn) * 100}%` }}></div>
               <div className="bg-purple-500" style={{ width: `${(totalGrants / totalBurn) * 100}%` }}></div>
            </div>
         </div>
         <div className="bg-kala-800 border border-kala-700 rounded-xl p-6">
            <div className="text-kala-400 text-sm font-bold uppercase mb-2">Runway Estimate</div>
            <div className="text-3xl font-mono text-white font-bold">{runwayMonths} Months</div>
            <div className="flex items-center gap-2 mt-2 text-xs text-kala-500">
               Based on liquid assets
            </div>
         </div>
      </div>

      {/* Detailed Burn Breakdown */}
      <div className="bg-kala-800/50 border border-kala-700 rounded-xl overflow-hidden">
         <button 
           onClick={() => setShowBreakdown(!showBreakdown)}
           className="w-full p-4 flex justify-between items-center bg-kala-900/50 hover:bg-kala-900 transition-colors"
         >
            <h3 className="font-bold text-white flex items-center gap-2">
               <TrendingDown className="w-5 h-5 text-red-400" /> Monthly Burn Breakdown
            </h3>
            <div className="flex items-center gap-4">
               <div className="text-xs text-kala-400 flex gap-4">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Ops: {((totalOperational/totalBurn)*100).toFixed(0)}%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Grants: {((totalGrants/totalBurn)*100).toFixed(0)}%</span>
               </div>
               {showBreakdown ? <ChevronUp className="w-4 h-4 text-kala-500" /> : <ChevronDown className="w-4 h-4 text-kala-500" />}
            </div>
         </button>
         
         {showBreakdown && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2">
               {/* Operational Column */}
               <div className="space-y-4">
                  <h4 className="text-sm font-bold text-kala-300 uppercase flex items-center gap-2 border-b border-kala-700 pb-2">
                     <Building2 className="w-4 h-4 text-blue-400" /> Operational Expenses
                     <span className="ml-auto text-white">${totalOperational.toLocaleString()}</span>
                  </h4>
                  <div className="space-y-3">
                     {EXPENSE_DATA.operational.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm group">
                           <span className="text-kala-400 group-hover:text-kala-200 transition-colors">{item.label}</span>
                           <div className="flex items-center gap-3 w-1/2 justify-end">
                              <div className="w-24 h-1.5 bg-kala-900 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500/50" style={{ width: `${(item.value / totalOperational) * 100}%` }}></div>
                              </div>
                              <span className="text-white font-mono w-16 text-right">${item.value.toLocaleString()}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Grants Column */}
               <div className="space-y-4">
                  <h4 className="text-sm font-bold text-kala-300 uppercase flex items-center gap-2 border-b border-kala-700 pb-2">
                     <Gift className="w-4 h-4 text-purple-400" /> Grants & Community
                     <span className="ml-auto text-white">${totalGrants.toLocaleString()}</span>
                  </h4>
                  <div className="space-y-3">
                     {EXPENSE_DATA.grants.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm group">
                           <span className="text-kala-400 group-hover:text-kala-200 transition-colors">{item.label}</span>
                           <div className="flex items-center gap-3 w-1/2 justify-end">
                              <div className="w-24 h-1.5 bg-kala-900 rounded-full overflow-hidden">
                                 <div className="h-full bg-purple-500/50" style={{ width: `${(item.value / totalGrants) * 100}%` }}></div>
                              </div>
                              <span className="text-white font-mono w-16 text-right">${item.value.toLocaleString()}</span>
                           </div>
                        </div>
                     ))}
                     
                     <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-xs text-purple-300">
                           <span className="font-bold">Note:</span> Grants are allocated from the Community Treasury Pool and voted upon by DAO members. Operational expenses are covered by platform fees.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* Asset Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-kala-800/50 border border-kala-700 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
               <PieChart className="w-5 h-5 text-kala-secondary" /> Asset Allocation
            </h3>
            <div className="space-y-4">
               {MOCK_TREASURY_ASSETS.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 bg-kala-900/50 rounded-lg hover:bg-kala-900 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                           asset.symbol === 'ETH' ? 'bg-indigo-500/20 text-indigo-400' :
                           asset.symbol === 'USDC' ? 'bg-blue-500/20 text-blue-400' :
                           asset.symbol === 'KALA' ? 'bg-purple-500/20 text-purple-400' :
                           'bg-orange-500/20 text-orange-400'
                        }`}>
                           {asset.symbol}
                        </div>
                        <div>
                           <div className="text-white font-bold">{asset.name}</div>
                           <div className="text-xs text-kala-500">{asset.balance.toLocaleString()} {asset.symbol}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-white font-mono font-bold">${asset.valueUsd.toLocaleString()}</div>
                        <div className="flex items-center justify-end gap-1 text-xs">
                           <span className="text-kala-400">{asset.allocation}%</span>
                           {asset.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
                           {asset.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Recent Movements</h3>
            <div className="space-y-3">
               {[1,2,3,4,5].map((i) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b border-kala-800 pb-2 last:border-0 last:pb-0">
                     <div className="flex items-center gap-2">
                        {i % 2 === 0 ? <ArrowDownLeft className="w-4 h-4 text-green-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                        <span className="text-kala-300">{i % 2 === 0 ? 'Grant Refund' : 'Dev Payout'}</span>
                     </div>
                     <div className="font-mono text-white">{i % 2 === 0 ? '+2,500' : '-5,000'} USDC</div>
                  </div>
               ))}
            </div>
            <button className="w-full mt-4 py-2 bg-kala-900 hover:bg-kala-800 text-kala-400 text-xs font-bold rounded transition-colors">
               View Full Ledger
            </button>
         </div>
      </div>
    </div>
  );
};

export default TreasuryDashboard;
