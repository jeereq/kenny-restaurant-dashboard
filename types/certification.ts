export interface Certification {
  id: number;
  title: string;
  description: string;
  duration: string;
  questions: number;
  price: number;
  skills: string[];
  level: 'debutant' | 'intermediaire' | 'avance';
  attempts: number;
  passScore: number;
  validityPeriod?: string;
  prerequisites?: string[];
  domains: CertificationDomain[];
}

export interface CertificationDomain {
  id: number;
  title: string;
  description: string;
  weight: number; // Pourcentage du score total
  topics: string[];
}

export interface CertificationAttempt {
  id: number;
  userId: number;
  certificationId: number;
  startDate: Date;
  endDate?: Date;
  score?: number;
  status: 'en_cours' | 'termine' | 'expire';
  answers: CertificationAnswer[];
}

export interface CertificationAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // en secondes
}