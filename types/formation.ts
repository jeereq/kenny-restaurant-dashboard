export interface Formation {
  id: number;
  title: string;
  description: string;
  category: 'dev' | 'marketing' | 'data' | 'design' | 'business';
  level: 'debutant' | 'intermediaire' | 'avance';
  duration: string;
  price: number;
  rating: number;
  students: number;
  image: string;
  instructor: Instructor;
  chapters: Chapter[];
  skills?: string[];
  prerequisites?: string[];
  objectives?: string[];
}

export interface Instructor {
  id: number;
  name: string;
  title: string;
  image: string;
  speciality?: string;
  bio?: string;
  rating?: number;
  totalStudents?: number;
  totalCourses?: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Chapter {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'exercice';
  description?: string;
  isCompleted?: boolean;
  resources?: Resource[];
}

export interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'code' | 'link';
  url: string;
  size?: string;
}