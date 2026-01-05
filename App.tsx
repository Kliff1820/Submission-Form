
import React, { useState } from 'react';
import { Role, Property, CleanerLog, Ticket, MaintenanceLog, TicketStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_PROPERTIES, INITIAL_CLEANER_LOGS, INITIAL_TICKETS, INITIAL_MAINTENANCE_LOGS } from './data/initialData';
import Header from './components/Header';
import CleanerForm from './components/CleanerForm';
import MaintenanceDashboard from './components/MaintenanceDashboard';
import AdminDashboard from './components/AdminDashboard';
import ResolveTicketModal from './components/ResolveTicketModal';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<Role>(Role.Cleaner);
  const [properties, setProperties] = useLocalStorage<Property[]>('properties', INITIAL_PROPERTIES);
  const [cleanerLogs, setCleanerLogs] = useLocalStorage<CleanerLog[]>('cleanerLogs', INITIAL_CLEANER_LOGS);
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('tickets', INITIAL_TICKETS);
  const [maintenanceLogs, setMaintenanceLogs] = useLocalStorage<MaintenanceLog[]>('maintenanceLogs', INITIAL_MAINTENANCE_LOGS);
  const [ticketToResolve, setTicketToResolve] = useState<Ticket | null>(null);

  const addCleanerLog = (log: Omit<CleanerLog, 'id'>, ticketData?: Omit<Ticket, 'id' | 'cleanerLogId' | 'dateCreated' | 'status'>) => {
    const newLog: CleanerLog = { ...log, id: `log-${Date.now()}` };
    setCleanerLogs(prevLogs => [...prevLogs, newLog]);

    if (ticketData) {
      const ticketIdNumber = tickets.length + 1;
      const formattedTicketId = `TICKET-${String(ticketIdNumber).padStart(3, '0')}`;
      const newTicket: Ticket = {
        ...ticketData,
        id: formattedTicketId,
        cleanerLogId: newLog.id,
        dateCreated: new Date().toISOString(),
        status: TicketStatus.Open,
      };
      setTickets(prevTickets => [...prevTickets, newTicket]);
    }
  };
  
  const handleOpenResolveModal = (ticket: Ticket) => {
    setTicketToResolve(ticket);
  };

  const handleCloseResolveModal = () => {
    setTicketToResolve(null);
  };

  const resolveTicket = (log: Omit<MaintenanceLog, 'id'>) => {
    if (!ticketToResolve) return;

    const newMaintenanceLog: MaintenanceLog = { ...log, id: `maint-${Date.now()}` };
    setMaintenanceLogs(prevLogs => [...prevLogs, newMaintenanceLog]);

    setTickets(prevTickets =>
      prevTickets.map(t =>
        t.id === ticketToResolve.id ? { ...t, status: TicketStatus.Resolved } : t
      )
    );
    handleCloseResolveModal();
  };

  const renderContent = () => {
    switch (activeRole) {
      case Role.Cleaner:
        return <CleanerForm properties={properties} onSubmit={addCleanerLog} />;
      case Role.Maintenance:
        const openTickets = tickets.filter(t => t.status === TicketStatus.Open);
        return <MaintenanceDashboard tickets={openTickets} properties={properties} onResolveClick={handleOpenResolveModal} />;
      case Role.Admin:
        return <AdminDashboard 
          properties={properties} 
          cleanerLogs={cleanerLogs} 
          tickets={tickets} 
          maintenanceLogs={maintenanceLogs} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header activeRole={activeRole} setActiveRole={setActiveRole} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      {ticketToResolve && (
        <ResolveTicketModal
          ticket={ticketToResolve}
          onClose={handleCloseResolveModal}
          onSubmit={resolveTicket}
        />
      )}
    </div>
  );
};

export default App;
