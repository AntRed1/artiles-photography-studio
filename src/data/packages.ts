import { PhotographyPackage } from '../types';

export const packages: PhotographyPackage[] = [
  {
    id: 1,
    title: 'Paquete Básico',
    description: 'Sesión de 1 hora con 10 fotos editadas.',
    price: 3500,
    imageUrl: '/images/package1.jpg',
    isActive: true,
  },
  {
    id: 2,
    title: 'Paquete Estándar',
    description: 'Sesión de 2 horas con 20 fotos editadas y álbum.',
    price: 5500,
    imageUrl: '/images/package2.jpg',
    isActive: true,
  },
  {
    id: 3,
    title: 'Paquete Premium',
    description: 'Sesión de 4 horas con 50 fotos editadas, álbum y video.',
    price: 8500,
    imageUrl: '/images/package3.jpg',
    isActive: true,
  },
];
