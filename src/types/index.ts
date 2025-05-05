export interface CarouselImage {
  id: number;
  url: string;
  title: string;
  description: string;
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  price: string;
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  category: string;
}

export interface Package {
  id: number;
  title: string;
  image: string;
  description: string;
  features: string[];
}
