
import React, { useState } from 'react';
import { Property, CleanerLog, Ticket, MaintenanceLog, TicketStatus } from '../types';
import { summarizeMaintenanceNotes } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface AdminDashboardProps {
  properties: Property[];
  cleanerLogs: CleanerLog[];
  tickets: Ticket[];
  maintenanceLogs: MaintenanceLog[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ properties, cleanerLogs, tickets, maintenanceLogs }) => {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const getPropertyName = (propertyId: string) => properties.find(p => p.id === propertyId)?.name || 'N/A';
  const openTickets = tickets.filter(t => t.status === TicketStatus.Open);
  
  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    setSummary('Generating summary...');
    const notes = maintenanceLogs.map(log => log.notes);
    const result = await summarizeMaintenanceNotes(notes);
    setSummary(result);
    setIsSummarizing(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open Tickets */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Open Tickets ({openTickets.length})</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {openTickets.length > 0 ? openTickets.map(ticket => (
              <div key={ticket.id} className="p-3 bg-gray-700 rounded-lg">
                <p className="font-semibold text-brand-blue">{ticket.id}</p>
                <p className="text-sm text-gray-300">{getPropertyName(ticket.propertyId)}</p>
                <p className="text-xs text-gray-400">{ticket.issueDescription.substring(0, 50)}...</p>
              </div>
            )) : <p className="text-gray-400">No open tickets.</p>}
          </div>
        </div>

        {/* Maintenance Summary */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Maintenance Summary</h3>
            <button
              onClick={handleGenerateSummary}
              disabled={isSummarizing}
              className="flex items-center py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              {isSummarizing ? 'Generating...' : 'Generate AI Summary'}
            </button>
          </div>
          <div className="bg-gray-900 p-4 rounded-md h-80 overflow-y-auto text-gray-300 text-sm whitespace-pre-wrap">
            {summary || "Click 'Generate AI Summary' to get an overview of all maintenance work."}
          </div>
        </div>
      </div>

      {/* Cleaner Logs */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Cleaner Logs</h3>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cleaner</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Property</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Issues</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {cleanerLogs.map(log => (
                <tr key={log.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{log.cleanerName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{getPropertyName(log.propertyId)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{log.timeStarted} - {log.timeFinished}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{log.issuesFound ? <span className="text-red-400">Yes</span> : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Maintenance History */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Maintenance History</h3>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticket ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fixed By</th>
                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Fixed</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {maintenanceLogs.map(log => (
                <tr key={log.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{log.ticketId}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{log.maintenancePersonName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(log.dateFixed).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm text-gray-300">{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
