
import React, { useState } from 'react';
import { MOCK_STAFF } from '../mockData';
import { StaffMember } from '../types';
import { Users, UserPlus, Mail, MoreHorizontal, Briefcase, CheckCircle, XCircle, Search, Calendar, Clock, DollarSign, PieChart, ArrowRight, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const HRDashboard: React.FC = () => {
  const { notify } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'directory' | 'payroll'>('directory');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const filteredStaff = MOCK_STAFF.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StaffDetailModal = ({ staff, onClose }: { staff: StaffMember, onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
       <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <div className="bg-kala-800 p-6 border-b border-kala-700 flex justify-between items-start">
             <div className="flex items-center gap-4">
                <img src={staff.avatar} alt={staff.name} className="w-16 h-16 rounded-xl border-2 border-kala-600 object-cover" />
                <div>
                   <h3 className="text-xl font-bold text-white">{staff.name}</h3>
                   <div className="flex items-center gap-2 text-sm text-kala-400 mt-1">
                      <span className="px-2 py-0.5 bg-kala-900 rounded border border-kala-700">{staff.role}</span>
                      <span>•</span>
                      <span>{staff.department} Dept</span>
                   </div>
                   <div className="mt-2 text-sm font-bold text-kala-300 bg-kala-900/50 px-2 py-1 rounded w-fit border border-kala-700/50">
                     {staff.designation}
                   </div>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-kala-700 rounded-lg text-kala-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>

          <div className="p-6 space-y-8">
             {/* Section 1: Employment Details */}
             <div>
                <h4 className="text-sm font-bold text-kala-500 uppercase tracking-wider mb-4 border-b border-kala-800 pb-2 flex items-center gap-2">
                   <Briefcase className="w-4 h-4" /> Employment Details
                </h4>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <div className="text-xs text-kala-500 mb-1">Status</div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                         staff.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                         {staff.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                         {staff.status}
                      </div>
                   </div>
                   <div>
                      <div className="text-xs text-kala-500 mb-1">Date of Joining</div>
                      <div className="text-white font-medium flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-kala-400" /> {staff.employmentDate}
                      </div>
                   </div>
                   <div className="col-span-2">
                      <div className="text-xs text-kala-500 mb-1">Work Email</div>
                      <div className="text-white font-mono bg-kala-800 p-2 rounded border border-kala-700 flex justify-between items-center">
                         {staff.email}
                         <Mail className="w-4 h-4 text-kala-500" />
                      </div>
                   </div>
                </div>
             </div>

             {/* Section 2: Compensation & Tax */}
             <div>
                <h4 className="text-sm font-bold text-kala-500 uppercase tracking-wider mb-4 border-b border-kala-800 pb-2 flex items-center gap-2">
                   <DollarSign className="w-4 h-4" /> Compensation & Tax
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="bg-kala-800/50 p-3 rounded-lg border border-kala-700">
                      <div className="text-xs text-kala-400 mb-1">Base Salary (Monthly)</div>
                      <div className="text-xl font-bold text-white">{staff.salary.toLocaleString()} {staff.currency}</div>
                   </div>
                   <div className="bg-kala-800/50 p-3 rounded-lg border border-kala-700">
                      <div className="text-xs text-kala-400 mb-1">Tax Deductions</div>
                      <div className="text-xl font-bold text-red-400">-{staff.taxDeductions.toLocaleString()} {staff.currency}</div>
                   </div>
                   <div className="bg-kala-800/50 p-3 rounded-lg border border-kala-700">
                      <div className="text-xs text-kala-400 mb-1">Net Pay (Est.)</div>
                      <div className="text-xl font-bold text-green-400">
                         {(staff.salary - staff.taxDeductions + staff.overtimePaid).toLocaleString()} {staff.currency}
                      </div>
                   </div>
                </div>
             </div>

             {/* Section 3: Time & Attendance */}
             <div>
                <h4 className="text-sm font-bold text-kala-500 uppercase tracking-wider mb-4 border-b border-kala-800 pb-2 flex items-center gap-2">
                   <Clock className="w-4 h-4" /> Time & Attendance (Current Month)
                </h4>
                <div className="bg-kala-800/30 rounded-xl p-4 border border-kala-700/50">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div>
                         <div className="text-xs text-kala-500 mb-1">Normal Hours</div>
                         <div className="text-lg font-bold text-white">{staff.normalHours}h</div>
                      </div>
                      <div>
                         <div className="text-xs text-kala-500 mb-1">Hours Worked</div>
                         <div className={`text-lg font-bold ${staff.hoursWorked >= staff.normalHours ? 'text-green-400' : 'text-yellow-400'}`}>
                            {staff.hoursWorked}h
                         </div>
                      </div>
                      <div>
                         <div className="text-xs text-kala-500 mb-1">Overtime</div>
                         <div className="text-lg font-bold text-purple-400">+{staff.overtimeHours}h</div>
                      </div>
                      <div>
                         <div className="text-xs text-kala-500 mb-1">OT Payout</div>
                         <div className="text-lg font-bold text-purple-400">+{staff.overtimePaid} {staff.currency}</div>
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-kala-700/50">
                      <div className="w-full bg-kala-900 rounded-full h-2 overflow-hidden flex">
                         <div className="bg-green-500 h-full" style={{ width: `${Math.min(100, (staff.hoursWorked / staff.normalHours) * 100)}%` }}></div>
                         <div className="bg-purple-500 h-full" style={{ width: `${(staff.overtimeHours / staff.normalHours) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-kala-500 mt-1">
                         <span>0h</span>
                         <span>Target: {staff.normalHours}h</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Section 4: Leave Balance */}
             <div>
                <h4 className="text-sm font-bold text-kala-500 uppercase tracking-wider mb-4 border-b border-kala-800 pb-2 flex items-center gap-2">
                   <PieChart className="w-4 h-4" /> Leave Management
                </h4>
                <div className="flex items-center gap-6">
                   <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                         <span className="text-kala-300">Accrued Leaves</span>
                         <span className="text-white font-bold">{staff.leavesAccrued} Days</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                         <span className="text-kala-300">Used Leaves</span>
                         <span className="text-white font-bold">{staff.leavesUsed} Days</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-kala-700">
                         <span className="text-kala-300 font-bold">Remaining Balance</span>
                         <span className={`font-bold ${staff.leavesAccrued - staff.leavesUsed < 5 ? 'text-red-400' : 'text-green-400'}`}>
                            {staff.leavesAccrued - staff.leavesUsed} Days
                         </span>
                      </div>
                   </div>
                   
                   {/* Visual Representation */}
                   <div className="w-24 h-24 rounded-full border-4 border-kala-800 flex items-center justify-center relative">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                         <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="4"
                         />
                         <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="4"
                            strokeDasharray={`${((staff.leavesAccrued - staff.leavesUsed) / staff.leavesAccrued) * 100}, 100`}
                         />
                      </svg>
                      <div className="text-center">
                         <div className="text-xs font-bold text-white">{Math.round(((staff.leavesAccrued - staff.leavesUsed) / staff.leavesAccrued) * 100)}%</div>
                         <div className="text-[8px] text-kala-500">Left</div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Section 5: Duties & Tasks */}
             <div>
                <h4 className="text-sm font-bold text-kala-500 uppercase tracking-wider mb-4 border-b border-kala-800 pb-2 flex items-center gap-2">
                   <Briefcase className="w-4 h-4" /> Duties & Tasks
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-kala-800/30 p-4 rounded-lg border border-kala-700/50">
                      <h5 className="text-xs font-bold text-white mb-2 uppercase">Official Duties</h5>
                      <ul className="list-disc list-inside text-sm text-kala-300 space-y-1">
                         {staff.duties.map((duty, i) => <li key={i}>{duty}</li>)}
                      </ul>
                   </div>
                   <div className="bg-kala-800/30 p-4 rounded-lg border border-kala-700/50">
                      <h5 className="text-xs font-bold text-white mb-2 uppercase">Monthly Tasks</h5>
                      <ul className="list-disc list-inside text-sm text-kala-300 space-y-1">
                         {staff.monthlyTasks.map((task, i) => <li key={i}>{task}</li>)}
                      </ul>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="bg-kala-800 p-4 border-t border-kala-700 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold text-kala-400 hover:text-white transition-colors">
                Close
             </button>
             <button 
               onClick={() => notify('Record edit mode unlocked.', 'info')}
               className="px-4 py-2 rounded-lg text-sm font-bold bg-kala-secondary text-kala-900 hover:bg-cyan-400 transition-colors"
             >
                Edit Record
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-kala-secondary" /> HRD & Team Management
          </h2>
          <p className="text-kala-400 text-sm">Manage core team, moderators, time-tracking, and payroll.</p>
        </div>
        <div className="flex bg-kala-800 p-1 rounded-lg border border-kala-700">
           <button 
             onClick={() => setActiveTab('directory')}
             className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'directory' ? 'bg-kala-secondary text-kala-900' : 'text-kala-400 hover:text-white'}`}
           >
              Directory
           </button>
           <button 
             onClick={() => setActiveTab('payroll')}
             className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'payroll' ? 'bg-kala-secondary text-kala-900' : 'text-kala-400 hover:text-white'}`}
           >
              Payroll
           </button>
        </div>
      </div>

      {activeTab === 'directory' ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-kala-800/50 p-4 rounded-xl border border-kala-700">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff..." 
                  className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary"
                />
             </div>
             <button 
               onClick={() => notify('Staff onboarding wizard initiated.', 'info')}
               className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
             >
                <UserPlus className="w-4 h-4" /> Add Staff Member
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredStaff.map((staff) => (
                <div key={staff.id} className="bg-kala-800 border border-kala-700 rounded-xl p-6 hover:border-kala-500 transition-colors group relative">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-full object-cover" />
                         <div>
                            <div className="font-bold text-white">{staff.name}</div>
                            <div className="text-xs text-kala-400">{staff.role} • {staff.department}</div>
                         </div>
                      </div>
                      <button 
                        onClick={() => setSelectedStaff(staff)}
                        className="text-kala-500 hover:text-white p-1 hover:bg-kala-700 rounded"
                        title="View Details"
                      >
                         <MoreHorizontal className="w-5 h-5" />
                      </button>
                   </div>
                   
                   <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-kala-500">Status</span>
                         <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                            staff.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                         }`}>
                            {staff.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {staff.status}
                         </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-kala-500">Joined</span>
                         <span className="text-white">{staff.employmentDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-kala-500">Last Active</span>
                         <span className="text-kala-300">{staff.lastActive}</span>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => setSelectedStaff(staff)}
                     className="w-full py-2 bg-kala-900 hover:bg-kala-700 text-kala-300 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
                   >
                      View Full HR Profile <ArrowRight className="w-3 h-3" />
                   </button>
                </div>
             ))}
          </div>
        </>
      ) : (
        <div className="bg-kala-800/50 border border-kala-700 rounded-xl overflow-hidden">
           <div className="p-4 bg-kala-900/50 border-b border-kala-700">
              <h3 className="font-bold text-white">Monthly Payroll Overview</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-kala-800 text-kala-400 text-xs uppercase font-bold">
                   <tr>
                      <th className="px-6 py-3">Employee</th>
                      <th className="px-6 py-3">Base Salary</th>
                      <th className="px-6 py-3">Hours (Reg/OT)</th>
                      <th className="px-6 py-3">Deductions</th>
                      <th className="px-6 py-3">Net Pay</th>
                      <th className="px-6 py-3 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-kala-700/50">
                   {MOCK_STAFF.map(staff => (
                      <tr key={staff.id} className="hover:bg-kala-800/30">
                         <td className="px-6 py-4">
                            <div className="text-white font-medium">{staff.name}</div>
                            <div className="text-xs text-kala-500">{staff.role}</div>
                         </td>
                         <td className="px-6 py-4 text-white font-mono">{staff.salary.toLocaleString()} {staff.currency}</td>
                         <td className="px-6 py-4 text-kala-300">
                            {staff.hoursWorked}h <span className="text-kala-500 text-xs">/ {staff.normalHours}h</span>
                            {staff.overtimeHours > 0 && <span className="ml-1 text-purple-400 text-xs">(+{staff.overtimeHours} OT)</span>}
                         </td>
                         <td className="px-6 py-4 text-red-400">-{staff.taxDeductions.toLocaleString()}</td>
                         <td className="px-6 py-4 text-green-400 font-bold">
                            {(staff.salary - staff.taxDeductions + staff.overtimePaid).toLocaleString()} {staff.currency}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button 
                               onClick={() => setSelectedStaff(staff)}
                               className="text-xs text-kala-secondary hover:underline"
                            >
                               View Details
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}

      {selectedStaff && <StaffDetailModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />}
    </div>
  );
};

export default HRDashboard;
