
import React, { useState } from 'react';
import { Property, CleanerLog, Ticket } from '../types';
import { analyzeIssuePhoto } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import CameraIcon from './icons/CameraIcon';

interface CleanerFormProps {
  properties: Property[];
  onSubmit: (log: Omit<CleanerLog, 'id'>, ticketData?: Omit<Ticket, 'id'|'cleanerLogId'|'dateCreated'|'status'>) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const CleanerForm: React.FC<CleanerFormProps> = ({ properties, onSubmit }) => {
  const [propertyId, setPropertyId] = useState<string>(properties[0]?.id || '');
  const [cleanerName, setCleanerName] = useState('');
  const [timeStarted, setTimeStarted] = useState('');
  const [timeFinished, setTimeFinished] = useState('');
  const [workPhotosLink, setWorkPhotosLink] = useState('');
  const [issuesFound, setIssuesFound] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  const [issuePhoto, setIssuePhoto] = useState<{file: File | null, base64: string}>({file: null, base64: ''});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState('');

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setIssuePhoto({ file, base64 });
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!issuePhoto.file) return;
    setIsAnalyzing(true);
    setIssueDescription("AI is analyzing the photo...");
    const description = await analyzeIssuePhoto(issuePhoto.base64, issuePhoto.file.type);
    setIssueDescription(description);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !cleanerName || !timeStarted || !timeFinished) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const logData = {
      propertyId,
      cleanerName,
      date: new Date().toISOString().split('T')[0],
      timeStarted,
      timeFinished,
      workPhotosLink,
      issuesFound,
    };
    
    let ticketData;
    if (issuesFound) {
      if (!issueDescription || !issuePhoto.base64) {
        setMessage('Please describe the issue and upload a photo.');
        return;
      }
      ticketData = {
        propertyId,
        issueDescription,
        issuePhoto: issuePhoto.base64,
      };
    }
    
    onSubmit(logData, ticketData);

    // Reset form
    setPropertyId(properties[0]?.id || '');
    setCleanerName('');
    setTimeStarted('');
    setTimeFinished('');
    setWorkPhotosLink('');
    setIssuesFound(false);
    setIssueDescription('');
    setIssuePhoto({ file: null, base64: '' });
    setMessage('Log submitted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Cleaner Work Log</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="property" className="block text-sm font-medium text-gray-300">Property</label>
            <select id="property" value={propertyId} onChange={e => setPropertyId(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-blue focus:border-brand-blue">
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="cleanerName" className="block text-sm font-medium text-gray-300">Your Name</label>
            <input type="text" id="cleanerName" value={cleanerName} onChange={e => setCleanerName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-blue focus:border-brand-blue" />
          </div>
          <div>
            <label htmlFor="timeStarted" className="block text-sm font-medium text-gray-300">Time Started</label>
            <input type="time" id="timeStarted" value={timeStarted} onChange={e => setTimeStarted(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-blue focus:border-brand-blue" />
          </div>
          <div>
            <label htmlFor="timeFinished" className="block text-sm font-medium text-gray-300">Time Finished</label>
            <input type="time" id="timeFinished" value={timeFinished} onChange={e => setTimeFinished(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-blue focus:border-brand-blue" />
          </div>
        </div>
        <div>
          <label htmlFor="workPhotosLink" className="block text-sm font-medium text-gray-300">Work Photos Link</label>
          <input type="url" id="workPhotosLink" placeholder="https://photos.app.goo.gl/..." value={workPhotosLink} onChange={e => setWorkPhotosLink(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-blue focus:border-brand-blue" />
        </div>
        <div className="flex items-center">
          <label htmlFor="issuesFound" className="text-sm font-medium text-gray-300 mr-4">Issues Found?</label>
          <button type="button" onClick={() => setIssuesFound(!issuesFound)} className={`${issuesFound ? 'bg-brand-blue' : 'bg-gray-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-blue`}>
            <span className={`${issuesFound ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
          </button>
        </div>

        {issuesFound && (
          <div className="border-t border-gray-700 pt-6 space-y-6">
            <h3 className="text-lg font-semibold text-white">Issue Details</h3>
            <div>
              <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-300">Issue Description</label>
              <textarea id="issueDescription" rows={3} value={issueDescription} onChange={e => setIssueDescription(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-blue focus:border-brand-blue"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Photo of Issue</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {issuePhoto.base64 ? (
                            <img src={`data:image/jpeg;base64,${issuePhoto.base64}`} alt="Issue Preview" className="mx-auto h-24 w-auto rounded-md" />
                        ) : (
                            <CameraIcon className="mx-auto h-12 w-12 text-gray-500" />
                        )}
                        <div className="flex text-sm text-gray-400">
                            <label htmlFor="issuePhoto" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-brand-blue hover:text-brand-blue-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-brand-blue">
                                <span>{issuePhoto.file ? 'Change photo' : 'Upload a file'}</span>
                                <input id="issuePhoto" name="issuePhoto" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
            {issuePhoto.file && (
              <button type="button" onClick={handleAnalyzePhoto} disabled={isAnalyzing} className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                <SparklesIcon className="h-5 w-5 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Photo with AI'}
              </button>
            )}
          </div>
        )}
        
        {message && <p className="text-center text-green-400">{message}</p>}
        
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-blue">
          Submit Log
        </button>
      </form>
    </div>
  );
};

export default CleanerForm;
