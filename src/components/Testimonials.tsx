/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';
import { getTestimonials } from '../services/testimonialService';
import { Testimonial } from '../types';

interface TestimonialsProps {
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  autoSlideInterval?: number;
  itemsPerView?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
}

// Enhanced animation configurations
const ANIMATION_CONFIG = {
  stagger: 0.15,
  duration: {
    fast: 0.3,
    medium: 0.5,
    slow: 0.8,
  },
  spring: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

// Animation variants with improved performance
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger,
      delayChildren: 0.1,
      duration: ANIMATION_CONFIG.duration.medium,
    },
  },
};

const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_CONFIG.duration.slow,
      ease: ANIMATION_CONFIG.ease,
    },
  },
};

const testimonialVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      ...ANIMATION_CONFIG.spring,
      duration: ANIMATION_CONFIG.duration.medium,
    } as Transition,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -400 : 400,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? -15 : 15,
    transition: {
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.ease,
    } as Transition,
  }),
};

const starVariants: Variants = {
  initial: {
    scale: 0,
    rotate: -180,
  },
  animate: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  }),
  hover: {
    scale: 1.2,
    rotate: 15,
    transition: { duration: 0.2 },
  },
};

// Enhanced loading component with skeleton
const LoadingSpinner: React.FC = React.memo(() => (
  <motion.div
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-rose-100"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: ANIMATION_CONFIG.duration.medium }}
  >
    <div className="text-center space-y-8">
      {/* Enhanced spinner */}
      <div className="relative">
        <div className="w-20 h-20 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto shadow-lg"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-rose-400 rounded-full animate-pulse"></div>
        <div
          className="absolute inset-2 w-16 h-16 border-2 border-transparent border-l-rose-300 rounded-full animate-spin"
          style={{ animationDirection: 'reverse' }}
        ></div>
      </div>

      {/* Loading text with typewriter effect */}
      <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          Cargando testimonios
        </h3>
        <div className="flex justify-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-rose-600 rounded-full"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton preview */}
      <div className="max-w-2xl mx-auto p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/50">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-slate-300 rounded-full" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-300 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-slate-300 rounded w-1/2 mx-auto" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-1/3 mx-auto" />
        </div>
      </div>
    </div>
  </motion.div>
));

// Enhanced error state with retry functionality
interface ErrorStateProps {
  error: string | null;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = React.memo(
  ({ error, onRetry }) => (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-rose-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_CONFIG.duration.medium }}
    >
      <div className="text-center max-w-md mx-auto px-6">
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 300,
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.h3
          className="text-2xl font-bold text-slate-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Oops! Algo salió mal
        </motion.h3>

        <motion.p
          className="text-red-600 mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {error || 'No hay testimonios disponibles en este momento'}
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="w-full px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl hover:from-slate-800 hover:to-slate-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Intentar nuevamente
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('contacto');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full px-6 py-3 bg-transparent border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-medium"
          >
            Ir a contacto
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
);

// Enhanced section header with improved typography
const SectionHeader: React.FC = React.memo(() => (
  <motion.div className="text-center mb-20 lg:mb-24" variants={headerVariants}>
    <motion.div
      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/50 rounded-full text-rose-700 text-sm font-bold tracking-wider uppercase mb-10 shadow-sm backdrop-blur-sm"
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-2 h-2 bg-rose-500 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      Testimonios
    </motion.div>

    <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 mb-10 leading-[0.9]">
      <motion.span
        className="block bg-gradient-to-r from-slate-900 via-rose-700 to-slate-900 bg-clip-text text-transparent"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Lo Que Dicen
      </motion.span>
      <motion.span
        className="block text-rose-600 mt-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Nuestros Clientes
      </motion.span>
    </h2>

    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 leading-relaxed font-light mb-8">
        La satisfacción de nuestros clientes es nuestra mejor carta de
        presentación y el testimonio de nuestro compromiso con la excelencia.
      </p>
      <motion.div
        className="w-32 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 rounded-full mx-auto shadow-sm"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      />
    </motion.div>
  </motion.div>
));

// Enhanced star rating with better animations
interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = React.memo(
  ({ rating, totalStars = 5, size = 'md', readonly = true }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div
        className="flex justify-center mb-8 space-x-1"
        role="img"
        aria-label={`${rating} de ${totalStars} estrellas`}
      >
        {Array.from({ length: totalStars }, (_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={starVariants}
            initial="initial"
            animate="animate"
            whileHover={readonly ? 'hover' : undefined}
            className={`${sizeClasses[size]} cursor-default`}
          >
            <svg
              className={`w-full h-full fill-current transition-colors duration-300 ${
                i < rating ? 'text-rose-500 drop-shadow-sm' : 'text-slate-300'
              }`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>
        ))}
      </div>
    );
  }
);

// Enhanced testimonial card with improved design
interface TestimonialCardProps {
  testimonial: Testimonial;
  direction?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(
  ({ testimonial, direction = 0 }) => (
    <motion.div
      className="w-full flex-shrink-0 px-6"
      variants={testimonialVariants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={direction}
      layout
    >
      <div className="group relative bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-3xl p-10 lg:p-14 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/20 hover:bg-white">
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 to-pink-50/80 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

        {/* Decorative elements */}
        <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-rose-100/50 to-pink-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

        {/* Quote icon with enhanced styling */}
        <div className="relative mb-8">
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/60 rounded-3xl flex items-center justify-center group-hover:from-rose-100 group-hover:to-pink-100 group-hover:border-rose-300/60 transition-all duration-500 shadow-lg group-hover:shadow-rose-200/60"
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            <svg
              className="w-10 h-10 text-rose-600 group-hover:text-rose-700 transition-all duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-label="Icono de comillas"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute -top-3 -right-3 w-5 h-5 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Star Rating */}
          <StarRating rating={testimonial.rating} size="lg" />

          {/* Testimonial Message with better typography */}
          <motion.blockquote
            className="text-slate-700 mb-10 text-xl lg:text-2xl leading-relaxed text-center font-light italic min-h-[6rem] flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="relative">
              &quot;{testimonial.message}&quot;
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>
          </motion.blockquote>

          {/* Enhanced Author Info */}
          <motion.div
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-8 border-t border-slate-200/60"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="font-bold text-slate-900 text-xl mb-1">
                {testimonial.name}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                  ✓ Cliente Verificado
                </span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-slate-500 text-sm font-medium bg-slate-50 px-3 py-1 rounded-lg">
                {testimonial.createdAt
                  ? new Date(testimonial.createdAt).toLocaleDateString(
                      'es-ES',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }
                    )
                  : 'Fecha no disponible'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
);

// Enhanced navigation controls
interface NavigationControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onSlideSelect: (index: number) => void;
  disabled?: boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = React.memo(
  ({
    currentSlide,
    totalSlides,
    onPrevious,
    onNext,
    onSlideSelect,
    disabled = false,
  }) => (
    <div className="relative">
      {/* Navigation Arrows with enhanced styling */}
      <motion.button
        onClick={onPrevious}
        disabled={disabled}
        className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-20 lg:-translate-x-24 w-14 h-14 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center group transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
        whileHover={{ x: -4, scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Testimonio anterior"
      >
        <svg
          className="w-6 h-6 text-rose-600 group-hover:text-rose-700 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      <motion.button
        onClick={onNext}
        disabled={disabled}
        className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-20 lg:translate-x-24 w-14 h-14 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center group transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
        whileHover={{ x: 4, scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Testimonio siguiente"
      >
        <svg
          className="w-6 h-6 text-rose-600 group-hover:text-rose-700 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.button>

      {/* Enhanced Slide Indicators */}
      <div className="flex justify-center mt-12 space-x-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <motion.button
            key={index}
            onClick={() => !disabled && onSlideSelect(index)}
            disabled={disabled}
            className={`relative h-3 rounded-full transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:cursor-not-allowed ${
              index === currentSlide
                ? 'bg-rose-600 shadow-lg shadow-rose-500/40 w-8'
                : 'bg-slate-300 hover:bg-slate-400 w-3'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Ir al testimonio ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full"
                layoutId="active-indicator"
                transition={{ duration: 0.4, ease: ANIMATION_CONFIG.ease }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6 w-full max-w-xs mx-auto bg-slate-200 rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5, ease: ANIMATION_CONFIG.ease }}
        />
      </div>
    </div>
  )
);

// Enhanced call to action
interface CallToActionProps {
  onShareClick: () => void;
}

const CallToAction: React.FC<CallToActionProps> = React.memo(
  ({ onShareClick }) => (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.8, ease: ANIMATION_CONFIG.ease }}
    >
      {/* Enhanced background with better gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-rose-600/40 via-transparent to-pink-600/40 rounded-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent rounded-3xl"></div>

      {/* Content with improved spacing and typography */}
      <div className="relative z-10 p-12 lg:p-20 text-center text-white">
        <div className="max-w-5xl mx-auto">
          <motion.h3
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            ¿Listo para compartir tu{' '}
            <span className="text-transparent bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text">
              experiencia
            </span>
            ?
          </motion.h3>

          <motion.p
            className="text-slate-300 text-xl lg:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            Tu opinión es muy valiosa para nosotros y ayuda a otros clientes a
            conocer la calidad de nuestro trabajo y servicio.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <motion.button
              onClick={onShareClick}
              className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-500 text-white font-bold text-lg rounded-2xl hover:from-rose-600 hover:via-rose-700 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-rose-500/50 transform hover:-translate-y-1 min-w-[280px] justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Abrir formulario para compartir experiencia"
            >
              <svg
                className="w-6 h-6 mr-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Compartir Mi Experiencia
            </motion.button>

            <motion.button
              onClick={() => {
                const element = document.getElementById('contacto');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center px-10 py-5 bg-transparent border-2 border-white/40 text-white font-bold text-lg rounded-2xl hover:bg-white/10 hover:border-white/60 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[280px] justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Ir a la sección de contacto"
            >
              <svg
                className="w-6 h-6 mr-4 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contáctanos
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
);

// Enhanced testimonials stats component
interface TestimonialsStatsProps {
  testimonials: Testimonial[];
}

const TestimonialsStats: React.FC<TestimonialsStatsProps> = React.memo(
  ({ testimonials }) => {
    const stats = useMemo(() => {
      const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
      const avgRating =
        testimonials.length > 0 ? totalRating / testimonials.length : 0;
      const fiveStarCount = testimonials.filter(t => t.rating === 5).length;
      const satisfactionRate =
        testimonials.length > 0
          ? (fiveStarCount / testimonials.length) * 100
          : 0;

      return {
        total: testimonials.length,
        avgRating: Number(avgRating.toFixed(1)),
        satisfactionRate: Math.round(satisfactionRate),
      };
    }, [testimonials]);

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {[
          { label: 'Testimonios Totales', value: stats.total, suffix: '' },
          {
            label: 'Calificación Promedio',
            value: stats.avgRating,
            suffix: '/5',
          },
          { label: 'Satisfacción', value: stats.satisfactionRate, suffix: '%' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <motion.div
              className="text-3xl lg:text-4xl font-black text-rose-600 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 1 + index * 0.1,
                type: 'spring',
                stiffness: 300,
              }}
            >
              {stat.value}
              {stat.suffix}
            </motion.div>
            <p className="text-slate-600 font-medium text-sm uppercase tracking-wide">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

// Main enhanced testimonials component
const Testimonials: React.FC<TestimonialsProps> = ({
  setShowShareModal,
  autoSlideInterval = 7000,
  showNavigation = true,
  showIndicators = true,
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Memoized testimonials data
  const memoizedTestimonials = useMemo(() => testimonials, [testimonials]);

  // Enhanced fetch function with retry logic
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestimonials();

      if (!data || data.length === 0) {
        throw new Error('No se encontraron testimonios');
      }

      setTestimonials(data);
      setRetryCount(0);
    } catch (err) {
      console.error('Error al cargar testimonios:', err);
      setError(
        err instanceof Error ? err.message : 'Error al cargar los testimonios'
      );

      // Auto-retry logic
      if (retryCount < 3) {
        setTimeout(
          () => {
            setRetryCount(prev => prev + 1);
            void fetchTestimonials();
          },
          2000 * (retryCount + 1)
        );
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  // Initial data fetch
  useEffect(() => {
    void fetchTestimonials();
  }, [fetchTestimonials]);

  // Enhanced auto-slide with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying, autoSlideInterval]);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : testimonials.length - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentSlide(prev => (prev < testimonials.length - 1 ? prev + 1 : 0));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, [testimonials.length]);

  const handleSlideSelect = useCallback(
    (index: number) => {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    },
    [currentSlide]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  // Loading state
  if (loading) return <LoadingSpinner />;

  // Error state with retry functionality
  if (error || testimonials.length === 0) {
    return <ErrorState error={error} onRetry={fetchTestimonials} />;
  }

  return (
    <section
      id="testimonios"
      className="relative py-24 lg:py-36 bg-gradient-to-br from-slate-100 via-white to-rose-100 overflow-hidden"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100/60 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/20 to-transparent rounded-full blur-3xl transform -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-pink-200/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-rose-300/30 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeader />

          {/* Statistics */}
          <TestimonialsStats testimonials={memoizedTestimonials} />

          {/* Enhanced testimonials carousel */}
          <div className="relative max-w-6xl mx-auto mb-20">
            <div className="overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait" custom={direction}>
                <TestimonialCard
                  key={currentSlide}
                  testimonial={memoizedTestimonials[currentSlide]}
                  direction={direction}
                />
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {showNavigation && testimonials.length > 1 && (
              <NavigationControls
                currentSlide={currentSlide}
                totalSlides={testimonials.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSlideSelect={handleSlideSelect}
                disabled={loading}
              />
            )}
          </div>

          {/* Enhanced Call to Action */}
          <CallToAction onShareClick={() => setShowShareModal(true)} />
        </motion.div>
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && testimonials.length > 1 && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200/50">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-slate-600">Auto</span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Testimonials;
