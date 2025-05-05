import { useEffect, useState } from 'react';

export const useScroll = () => {
  const [activeSection, setActiveSection] = useState('inicio');

  const handleScroll = () => {
    const sections = document.querySelectorAll('section');
    let currentActiveSection = 'inicio';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (
        window.scrollY >= sectionTop - 200 &&
        window.scrollY < sectionTop + sectionHeight - 200
      ) {
        currentActiveSection = section.id;
      }
    });
    setActiveSection(currentActiveSection);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return { activeSection, setActiveSection, scrollToSection };
};
