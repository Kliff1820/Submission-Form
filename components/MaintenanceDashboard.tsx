
import React from 'react';
import { Ticket, Property } from '../types';

interface MaintenanceDashboardProps {
  tickets: Ticket[];
  properties: Property[];
  onResolveClick: (ticket: Ticket) => void;
}

const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ tickets, properties, onResolveClick }) => {
  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.name || 'Unknown Property';
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Open Maintenance Tickets</h2>
      {tickets.length === 0 ? (
        <div className="text-center py-10 bg-gray-800 rounded-lg">
          <p className="text-gray-400">No open tickets at the moment. Great job!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <img src={`data:image/jpeg;base64,${ticket.issuePhoto}`} alt="Issue" className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-sm text-gray-400">{ticket.id} - {new Date(ticket.dateCreated).toLocaleDateString()}</p>
                <h3 className="text-lg font-bold text-white mt-1">{getPropertyName(ticket.propertyId)}</h3>
                <p className="text-gray-300 mt-2 text-sm h-16 overflow-y-auto">{ticket.issueDescription}</p>
                <button
                  onClick={() => onResolveClick(ticket)}
                  className="mt-4 w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors duration-200"
                >
                  Resolve Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceDashboard;
