
import React, { useState } from 'react';
import { Ticket, MaintenanceLog } from '../types';
import CameraIcon from './icons/CameraIcon';

interface ResolveTicketModalProps {
  ticket: Ticket;
  onClose: () => void;
  onSubmit: (log: Omit<MaintenanceLog, 'id'>) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const ResolveTicketModal: React.FC<ResolveTicketModalProps> = ({ ticket, onClose, onSubmit }) => {
  const [maintenancePersonName, setMaintenancePersonName] = useState('');
  const [notes, setNotes] = useState('');
  const [afterPhoto, setAfterPhoto] = useState<{file: File | null, base64: string}>({file: null, base64: ''});
  const [error, setError] = useState('');

  const handleAfterPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setAfterPhoto({ file, base64 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenancePersonName || !notes || !afterPhoto.base64) {
      setError('Please fill out all fields and upload an "After" photo.');
      return;
    }
    onSubmit({
      ticketId: ticket.id,
      maintenancePersonName,
      dateFixed: new Date().toISOString(),
      beforePhoto: ticket.issuePhoto,
      afterPhoto: afterPhoto.base64,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Resolve Ticket: {ticket.id}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Before Photo</h4>
                        <img src={`data:image/jpeg;base64,${ticket.issuePhoto}`} alt="Before" className="w-full rounded-lg object-cover" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">After Photo</h4>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {afterPhoto.base64 ? (
                                    <img src={`data:image/jpeg;base64,${afterPhoto.base64}`} alt="After Preview" className="mx-auto h-24 w-auto rounded-md" />
                                ) : (
                                    <CameraIcon className="mx-auto h-12 w-12 text-gray-500" />
                                )}
                                <div className="flex text-sm text-gray-400">
                                    <label htmlFor="afterPhoto" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-brand-blue hover:text-brand-blue-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-brand-blue">
                                        <span>{afterPhoto.file ? 'Change photo' : 'Upload photo'}</span>
                                        <input id="afterPhoto" name="afterPhoto" type="file" accept="image/*" className="sr-only" onChange={handleAfterPhotoChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="maintenancePersonName" className="block text-sm font-medium text-gray-300">Your Name</label>
                    <input type="text" id="maintenancePersonName" value={maintenancePersonName} onChange={e => setMaintenancePersonName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-blue focus:border-brand-blue" />
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes on Fix</label>
                    <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-blue focus:border-brand-blue"></textarea>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-opacity-80">Mark as Resolved</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ResolveTicketModal;
