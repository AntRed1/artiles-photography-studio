import React, { useEffect, useState } from 'react';
import { getActivePackages } from '../services/packageService';
import { PhotographyPackage } from '../types';

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<PhotographyPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getActivePackages();
        setPackages(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los paquetes');
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <section id="paquetes" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestros Paquetes
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Elige el paquete que mejor se adapte a tus necesidades.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className="bg-gray-50 rounded-lg shadow-md p-6 text-center"
            >
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <p className="text-lg font-bold text-red-600 mb-4">
                RD${pkg.price.toFixed(2)}
              </p>
              <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
                Reservar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
