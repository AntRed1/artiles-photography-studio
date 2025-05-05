import React, { useEffect, useState } from 'react';
import { getInformation } from '../services/informationService';
import { Information } from '../types';

const AboutUs: React.FC = () => {
  const [information, setInformation] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const data = await getInformation();
        setInformation(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la información');
        setLoading(false);
      }
    };
    fetchInformation();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  if (error || !information) {
    return (
      <div className="text-center py-16 text-red-600">
        {error || 'No se encontró información'}
      </div>
    );
  }

  return (
    <section id="nosotros" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {information.title}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            {information.content}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {information.specialties.map((specialty, index) => (
            <div key={index} className="text-center">
              <i
                className={`${information.specialtyIcons[index]} text-4xl text-red-600 mb-4`}
              ></i>
              <h3 className="text-lg font-semibold">{specialty}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
