import { PhotographyPackage } from '../types';

export const packages: PhotographyPackage[] = [
  {
    id: 1,
    title: 'Paquete Básico',
    description: 'Incluye sesión de fotos de 1 hora y 10 fotos editadas.',
    price: 3500,
    imageUrl: '/images/package1.jpg',
    active: true,
  },
  {
    id: 2,
    title: 'Paquete Estándar',
    description: 'Incluye sesión de fotos de 2 horas y 20 fotos editadas.',
    price: 5500,
    imageUrl: '/images/package2.jpg',
    active: true,
  },
  {
    id: 3,
    title: 'Paquete Premium',
    description:
      'Incluye sesión de fotos de 3 horas, 30 fotos editadas y álbum físico.',
    price: 8500,
    imageUrl: '/images/package3.jpg',
    active: true,
  },
];
