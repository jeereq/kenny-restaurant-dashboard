export interface Entreprise {
  id: number;
  name: string;
  logo: string;
  industry: string;
  size: 'startup' | 'pme' | 'grande_entreprise';
  description: string;
  location: string;
  website?: string;
  contactInfo: EntrepriseContact;
  subscription: EntrepriseSubscription;
  employees: EntrepriseEmployee[];
  trainings: EntrepriseTraining[];
}

export interface EntrepriseContact {
  primaryName: string;
  primaryEmail: string;
  primaryPhone: string;
  secondaryContact?: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface EntrepriseSubscription {
  plan: 'basic' | 'professional' | 'enterprise';
  startDate: Date;
  endDate: Date;
  maxUsers: number;
  features: string[];
  status: 'active' | 'pending' | 'expired';
  billingInfo: {
    method: 'card' | 'transfer' | 'cheque';
    frequency: 'monthly' | 'annual';
    amount: number;
  };
}

export interface EntrepriseEmployee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: Date;
  status: 'active' | 'inactive';
  progress: {
    completedCourses: number;
    inProgressCourses: number;
    certifications: number;
  };
}

export interface EntrepriseTraining {
  id: number;
  formationId: number;
  startDate: Date;
  endDate: Date;
  participants: number;
  progress: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  instructor?: {
    id: number;
    name: string;
  };
  sessions: {
    date: Date;
    duration: string;
    type: 'presentiel' | 'distanciel';
    location?: string;
  }[];
}