export interface Category {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
}

export interface Gallery {
  id?: number;
  imageUrl: string;
  description: string;
  uploadedAt?: string;
}

export interface PhotographyPackage {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
  createdAt?: string;
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

export interface Information {
  id: number;
  title: string;
  content: string;
}

export interface Legal {
  id?: number;
  type: 'PRIVACY' | 'TERMS';
  content: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface Configuration {
  id?: number;
  logoUrl: string;
  heroBackgroundImage?: string;
}
