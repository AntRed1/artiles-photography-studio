export interface Service {
  id?: number;
  title: string;
  icon: string;
}

export interface AboutUs {
  id?: number;
  title: string;
  content: string;
  specialties?: string[];
  specialtyIcons?: string[];
}

export interface ContactInfo {
  id?: number;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface Gallery {
  id?: number;
  imageUrl: string;
  description: string;
  uploadedAt?: string;
}

export interface PhotographyPackage {
  id?: number;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  imageUrl: string;
}

export interface Testimonial {
  id?: number;
  name: string;
  message: string;
  rating: number;
  createdAt?: string;
}

export interface Legal {
  id?: number;
  type: 'PRIVACY' | 'TERMS';
  content: string;
}

export interface Configuration {
  id?: number;
  logoUrl: string;
  heroBackgroundImage: string;
}
export interface Information {
  id?: number;
  title: string;
  content: string;
  specialties: string[];
  specialtyIcons: string[];
}
