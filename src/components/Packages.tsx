import React, { useState, useEffect } from 'react';
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
    void fetchPackages();
  }, []);

  if (loading) return <div>Cargando paquetes...</div>;
  if (error) return <div>{error}</div>;
  if (packages.length === 0) return <div>No hay paquetes disponibles</div>;

  return (
    <section id="paquetes" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nuestros Paquetes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <p className="text-lg font-semibold text-red-600 mb-4">
                  ${pkg.price}
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Reservar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
