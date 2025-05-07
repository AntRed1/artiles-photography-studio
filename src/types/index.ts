export interface CarouselImage {
  id: number;
  url: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface Service {
  id: number;
  title: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  message: string;
  createdAt: string;
  device: string;
  ipAddress: string;
  location: string;
  enable: boolean;
}

export interface GalleryImage {
  id: number;
  imageUrl: string;
  description: string;
}

export interface PhotographyPackage {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  isActive: boolean;
  features: string[];
}

export interface Information {
  id: number;
  title: string;
  content: string;
  specialties: string[];
  specialtyIcons: string[];
}

export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  googleMapsUrl: string;
}

export interface Legal {
  id: number;
  type: 'PRIVACY' | 'TERMS';
  content: string;
}

export interface Configuration {
  id: number;
  logoUrl: string;
  heroBackgroundUrl: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  userAgent: string;
}
