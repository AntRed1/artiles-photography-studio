import React, { useEffect, useState } from 'react';
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import Packages from '../components/Packages';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import WhatsAppButton from '../components/WhatsAppButton';
import {
  Information,
  Service,
  PhotographyPackage,
  Gallery as GalleryType,
  Testimonial,
  Configuration,
} from '../types';
import { getTestimonials } from '../services/testimonialService';
import { getActivePackages } from '../services/packageService';
import { getGallery } from '../services/galleryService';
import { getConfiguration } from '../services/configService';

const Home: React.FC = () => {
  const [information, setInformation] = useState<Information | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<PhotographyPackage[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryType[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packageData, galleryData, testimonialData, configData] = await Promise.all([
          getActivePackages(),
          getGallery(),
          getTestimonials(),
          getConfiguration(),
        ]);
        setPackages(packageData);
        setGalleryImages(galleryData);
        setTestimonials(testimonialData);
        setConfiguration(configData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <div>
      <header className="bg-gray-900 text-white py-16" style={{ backgroundImage: `url(${configuration?.heroBackgroundImage})` }}>
        <div className="container mx-auto px-4 text-center">
          <img src={configuration?.logoUrl} alt="Artiles Photography" className="mx-auto mb-4 h-24" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Artiles Photography Studio</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Capturamos tus momentos más especiales con creatividad y profesionalismo.
          </p>
        </div>
      </header>
      <AboutUs />
      <Services />
      <Packages />
      <Gallery />
      <Testimonials />
      <WhatsAppButton />
    </div>
  );
};

export default Home;