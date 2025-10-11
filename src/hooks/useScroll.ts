import { useEffect, useState } from 'react';

const useScroll = () => {
  const [activeSection, setActiveSection] = useState('inicio');

  const scrollToSection = (sectionId: string) => {
    // Primero, intentar encontrar el elemento
    const element = document.getElementById(sectionId);

    if (element) {
      // Ajuste para el header fijo
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      // Si no encuentra el elemento, hacer un log para debugging
      console.warn(
        `Sección "${sectionId}" no encontrada. Verifica que el ID existe en el DOM.`
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      let currentActiveSection = 'inicio';

      sections.forEach(section => {
        const sectionTop =
          section.getBoundingClientRect().top + window.pageYOffset - 100;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentActiveSection = section.id;
        }
      });

      setActiveSection(currentActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Llamar inmediatamente para establecer la sección activa inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { activeSection, setActiveSection, scrollToSection };
};

export default useScroll;
