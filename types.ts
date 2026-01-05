
export enum Role {
  Cleaner = 'Cleaner',
  Maintenance = 'Maintenance',
  Admin = 'Admin',
}

export interface Property {
  id: string;
  name: string;
  address: string;
}

export interface CleanerLog {
  id: string;
  propertyId: string;
  cleanerName: string;
  date: string;
  timeStarted: string;
  timeFinished: string;
  workPhotosLink: string;
  issuesFound: boolean;
}

export enum TicketStatus {
  Open = 'Open',
  Resolved = 'Resolved',
}

export interface Ticket {
  id: string;
  cleanerLogId: string;
  propertyId: string;
  issueDescription: string;
  issuePhoto: string; // base64 string
  status: TicketStatus;
  dateCreated: string;
}

export interface MaintenanceLog {
  id: string;
  ticketId: string;
  maintenancePersonName: string;
  dateFixed: string;
  beforePhoto: string; // base64 string
  afterPhoto: string; // base64 string
  notes: string;
}
