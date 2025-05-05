import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section id="nosotros" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <i className="fa-solid fa-camera-retro text-5xl text-black"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sobre Nosotros
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-700 mb-8">
            En Artiles Photography Studio nos especializamos en capturar los
            momentos más importantes de tu vida con un enfoque artístico y
            profesional. Con más de 10 años de experiencia, nuestro equipo está
            comprometido con la excelencia y la satisfacción del cliente.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
            {[
              { icon: 'fa-solid fa-cake-candles', text: 'Quinceañeras' },
              { icon: 'fa-solid fa-user-group', text: 'Familias' },
              { icon: 'fa-solid fa-graduation-cap', text: 'Graduaciones' },
              { icon: 'fa-solid fa-ring', text: 'Bodas' },
              { icon: 'fa-solid fa-baby', text: 'Bebés' },
              { icon: 'fa-solid fa-champagne-glasses', text: 'Eventos' },
            ].map((specialty, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
                  <i className={`${specialty.icon} text-red-600 text-2xl`}></i>
                </div>
                <p className="font-medium">{specialty.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
