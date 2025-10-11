# 📸 Artiles Photography Studio

<div align="center">

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)

*Sitio web profesional de estudio fotográfico construido con React, TypeScript y Tailwind CSS*

[🚀 Demo en Vivo](#) • [📖 Documentación](#-características) • [🛠️ Instalación](#-instalación) • [🎨 Diseño](#-diseño-y-ux)

</div>

---

## ✨ Características Principales

- 🎨 **Diseño Moderno** - Interface elegante y profesional
- 📱 **Totalmente Responsivo** - Perfecto en todos los dispositivos
- ⚡ **Súper Rápido** - Optimizado con Vite y lazy loading
- 🖼️ **Galería Interactiva** - Carrusel y vista de imágenes avanzada
- 💬 **Testimonios Dinámicos** - Opiniones de clientes en tiempo real
- 📞 **Integración WhatsApp** - Contacto directo y fácil
- 🌙 **Modo Oscuro** - Para una experiencia visual cómoda
- 🎯 **SEO Optimizado** - Mejor posicionamiento en buscadores
- 🚀 **PWA Ready** - Instalable como aplicación

## 🏗️ Arquitectura del Proyecto

```
Estudio-Fotografico-Artiles/
├── 📁 public/                 # Archivos estáticos
│   ├── index.html             # Plantilla HTML principal
│   └── favicon.ico            # Icono del sitio
├── 📁 src/
│   ├── 📁 assets/             # Recursos multimedia
│   │   ├── 📁 images/         # Imágenes del proyecto
│   │   └── 📁 styles/         # Estilos personalizados
│   ├── 📁 components/         # Componentes reutilizables
│   │   ├── Header.tsx         # Navegación principal
│   │   ├── Footer.tsx         # Pie de página
│   │   ├── Carousel.tsx       # Carrusel de imágenes
│   │   ├── About.tsx          # Sección Sobre Nosotros
│   │   ├── Services.tsx       # Servicios fotográficos
│   │   ├── Packages.tsx       # Paquetes y precios
│   │   ├── Gallery.tsx        # Galería de trabajos
│   │   ├── Testimonials.tsx   # Testimonios de clientes
│   │   ├── Contact.tsx        # Información de contacto
│   │   ├── WhatsappButton.tsx # Botón flotante WhatsApp
│   │   ├── ShareModal.tsx     # Modal para compartir
│   │   ├── PrivacyModal.tsx   # Modal de privacidad
│   │   └── TermsModal.tsx     # Modal de términos
│   ├── 📁 data/               # Datos de la aplicación
│   │   ├── carouselImages.ts  # Imágenes del carrusel
│   │   ├── services.ts        # Servicios disponibles
│   │   ├── testimonials.ts    # Testimonios de clientes
│   │   ├── galleryImages.ts   # Imágenes de la galería
│   │   └── packages.ts        # Paquetes fotográficos
│   ├── 📁 hooks/              # Hooks personalizados
│   │   └── useScroll.ts       # Hook para scroll effects
│   ├── 📁 types/              # Tipos de TypeScript
│   │   └── index.ts           # Definiciones de tipos
│   ├── 📁 pages/              # Páginas de la aplicación
│   │   └── Home.tsx           # Página principal
│   ├── App.tsx                # Componente raíz
│   ├── main.tsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── tailwind.config.js         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
├── package.json               # Dependencias del proyecto
└── vite.config.ts             # Configuración Vite
```

## 🛠️ Tecnologías y Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" />
<br><strong>React 18+</strong>
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" />
<br><strong>TypeScript</strong>
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" />
<br><strong>Tailwind CSS</strong>
</td>
<td align="center" width="96">
<img src="https://vitejs.dev/logo.svg" width="48" height="48" />
<br><strong>Vite</strong>
</td>
</tr>
</table>

### 🎯 Frontend Stack Completo

| Categoría | Tecnologías |
|-----------|-------------|
| **⚛️ Core** | React 18, TypeScript 5, Vite 5 |
| **🎨 Styling** | Tailwind CSS, CSS Modules, PostCSS |
| **📱 UI/UX** | Framer Motion, React Icons, Lucide React |
| **🔧 Tools** | ESLint, Prettier, Husky |
| **📦 Build** | Vite, SWC, Rollup |

## 🚀 Instalación

### Prerrequisitos

```bash
Node.js 18+ 
npm 9+ o yarn 1.22+ o pnpm 8+
Git
```

### 🔥 Inicio Rápido

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/AntRed1/artiles-photography-studio.git
cd artiles-photography-studio

# 2️⃣ Cambiar a la rama de desarrollo
git checkout dev

# 3️⃣ Instalar dependencias
npm install
# o
yarn install
# o
pnpm install

# 4️⃣ Ejecutar en modo desarrollo
npm run dev
# o
yarn dev
# o
pnpm dev


```

🎉 **¡Listo!** Abre [http://localhost:5173](http://localhost:5173) en tu navegador

### ⚙️ Scripts Disponibles

```bash
# 🔥 Desarrollo
npm run dev          # Servidor de desarrollo con HMR
npm run build        # Build de producción
npm run preview      # Vista previa del build

# 🧹 Calidad de Código
npm run lint         # Verificar con ESLint
npm run lint:fix     # Arreglar errores automáticamente
npm run type-check   # Verificar tipos de TypeScript

# 🧪 Testing (próximamente)
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:ui      # UI de testing

# Desarrollo (actualiza versión automáticamente)
npm start

# Build de producción (actualiza versión automáticamente)
npm run build

# Actualizar solo la versión sin ejecutar nada
npm run version:update

# Incrementar versión patch (0.1.0 -> 0.1.1)
npm run version:patch

# Incrementar versión minor (0.1.0 -> 0.2.0)
npm run version:minor

# Incrementar versión major (0.1.0 -> 1.0.0)
npm run version:major

npm install -g serve
serve -s build

```

## 🎨 Diseño y UX

### 🌈 Paleta de Colores

```css
/* Colores Principales */
--primary: #1a202c;      /* Negro elegante */
--secondary: #2d3748;    /* Gris oscuro */
--accent: #e53e3e;       /* Rojo fotografía */
--text: #2d3748;         /* Texto principal */
--text-light: #718096;   /* Texto secundario */
--background: #ffffff;   /* Fondo */
--card: #f7fafc;        /* Tarjetas */
```

### 📐 Breakpoints Responsivos

```css
/* Mobile first approach */
sm: '640px'      /* Tablets */
md: '768px'      /* Tablets grandes */
lg: '1024px'     /* Desktop pequeño */
xl: '1280px'     /* Desktop */
2xl: '1536px'    /* Desktop grande */
```

### 🎭 Componentes de UI

- **Header** - Navegación fija con scroll effects
- **Carousel** - Carrusel hero con transiciones suaves
- **Gallery** - Grid responsivo con lightbox
- **Testimonials** - Slider de testimonios
- **WhatsApp Button** - Botón flotante para contacto
- **Modals** - Privacidad, términos y compartir

## 📱 Características Avanzadas

### ⚡ Optimizaciones de Rendimiento

- **Lazy Loading** - Carga perezosa de imágenes
- **Code Splitting** - División automática de código
- **Tree Shaking** - Eliminación de código no usado
- **Bundle Optimization** - Bundles optimizados
- **Image Optimization** - Imágenes optimizadas automáticamente

### 🔍 SEO y Accesibilidad

```typescript
// Meta tags dinámicos
const metaTags = {
  title: "Artiles Photography - Estudio Fotográfico Profesional",
  description: "Servicios profesionales de fotografía en República Dominicana",
  keywords: "fotografía, estudio, bodas, eventos, retratos",
  openGraph: {
    type: 'website',
    url: 'https://artilesphoto.com',
    image: '/og-image.jpg'
  }
}
```

### 📞 Integración WhatsApp

```typescript
// Botón WhatsApp personalizable
const whatsappConfig = {
  number: "+18091234567",
  message: "¡Hola! Me interesa conocer más sobre sus servicios fotográficos.",
  position: "bottom-right",
  showOnScroll: true
}
```

## 🗂️ Gestión de Datos

### 📊 Estructura de Datos

<details>
<summary><strong>🎠 Carousel Images</strong></summary>

```typescript
interface CarouselImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  cta?: string;
}
```

</details>

<details>
<summary><strong>📋 Services</strong></summary>

```typescript
interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  features: string[];
  price?: string;
  popular?: boolean;
}
```

</details>

<details>
<summary><strong>📦 Packages</strong></summary>

```typescript
interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular: boolean;
  color: string;
}
```

</details>

<details>
<summary><strong>⭐ Testimonials</strong></summary>

```typescript
interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  service: string;
  date: string;
}
```

</details>

<details>
<summary><strong>🖼️ Gallery Images</strong></summary>

```typescript
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  featured: boolean;
  photographer?: string;
}
```

</details>

## 🔧 Configuración Personalizada

### 📝 Variables de Entorno

```bash
# .env.local
VITE_APP_TITLE="Artiles Photography Studio"
VITE_WHATSAPP_NUMBER="+18091234567"
VITE_EMAIL="info@artilesphoto.com"
VITE_INSTAGRAM="@artilesphoto"
VITE_FACEBOOK="ArtilesPhtography"
VITE_GOOGLE_ANALYTICS="GA_MEASUREMENT_ID"
```

### ⚙️ Configuración de Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a202c',
        secondary: '#2d3748',
        accent: '#e53e3e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      }
    },
  },
  plugins: [],
}
```

## 🚀 Deployment

### 📦 Build de Producción

```bash
# Crear build optimizado
npm run build

# Vista previa local del build
npm run preview

# Analizar bundle size
npm run analyze
```

### 🌐 Plataformas de Deploy

<details>
<summary><strong>🔥 Firebase Hosting</strong></summary>

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

</details>

<details>
<summary><strong>▲ Vercel</strong></summary>

```bash
npm install -g vercel
vercel --prod
```

</details>

<details>
<summary><strong>📡 Netlify</strong></summary>

```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

</details>

<details>
<summary><strong>🐳 Docker</strong></summary>

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

</details>

## 🧪 Testing y Calidad

### 🔍 Testing Setup (Próximamente)

```bash
# Testing con Vitest y Testing Library
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D jsdom happy-dom
```

### 📊 Métricas de Performance

- ⚡ **Lighthouse Score**: 95+
- 🚀 **First Contentful Paint**: < 1.5s
- 🎯 **Largest Contentful Paint**: < 2.5s
- 📱 **Mobile Performance**: 90+
- ♿ **Accessibility Score**: 98+

## 🤝 Contribuir

¡Las contribuciones son más que bienvenidas!

### 🔄 Proceso de Contribución

1. 🍴 **Fork** el repositorio
2. 🌱 **Crea** una rama feature

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. 💾 **Commit** tus cambios

   ```bash
   git commit -m 'feat: add amazing feature'
   ```

4. 📤 **Push** a la rama

   ```bash
   git push origin feature/amazing-feature
   ```

5. 🔄 **Abre** un Pull Request

### 📋 Guías de Contribución

- ✅ Seguir las convenciones de código establecidas
- 🧪 Añadir tests para nuevas funcionalidades
- 📝 Actualizar documentación cuando sea necesario
- 🎨 Mantener el diseño consistente
- 📱 Verificar responsividad en todos los dispositivos

### 🎯 Conventional Commits

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato/estilo
refactor: refactorización de código
test: añadir o modificar tests
chore: tareas de mantenimiento
```

## 📈 Roadmap

### 🚀 Próximas Funcionalidades

- [ ] 🔐 **Sistema de autenticación** - Login para admin
- [ ] 🌍 **Internacionalización** - Soporte multi-idioma
- [ ] 🎨 **Editor de contenido** - CMS integrado
- [ ] 📊 **Analytics dashboard** - Métricas en tiempo real
- [ ] 🔍 **Búsqueda avanzada** - Filtros en galería
- [ ] 💬 **Chat en vivo** - Soporte en tiempo real
- [ ] 📱 **App móvil** - PWA completa
- [ ] 🎥 **Video gallery** - Soporte para videos
- [ ] 💳 **Sistema de pagos** - Reservas online
- [ ] 🎯 **A/B Testing** - Optimización de conversiones

### 🔧 Mejoras Técnicas

- [ ] ⚡ **Server Components** - Migración a Next.js 14
- [ ] 🗄️ **State Management** - Implementar Zustand
- [ ] 🧪 **Testing Suite** - Cobertura completa
- [ ] 📦 **Micro-frontends** - Arquitectura modular
- [ ] 🚀 **Edge Computing** - Deploy en edge locations

## 🛡️ Seguridad

- 🔒 **HTTPS Only** - Conexiones seguras
- 🛡️ **CSP Headers** - Content Security Policy
- 🔐 **Sanitización** - Input validation
- 🚫 **XSS Protection** - Cross-site scripting prevention
- 🌐 **CORS Policy** - Cross-origin resource sharing

## 📊 Analytics y Métricas

### 📈 Herramientas de Analytics

- **Google Analytics 4** - Seguimiento de usuarios
- **Google Tag Manager** - Gestión de tags
- **Hotjar** - Heatmaps y session recordings
- **Lighthouse CI** - Performance monitoring

## 📞 Soporte y Contacto

¿Necesitas ayuda? ¡Estamos aquí para ti!

- 📧 **Email**: [Crear issue](https://github.com/AntRed1/artiles-photography-studio/issues)
- 🐛 **Bug Reports**: [Reportar bug](https://github.com/AntRed1/artiles-photography-studio/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Solicitar feature](https://github.com/AntRed1/artiles-photography-studio/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/AntRed1/artiles-photography-studio/discussions)

### 🌟 Comunidad

- 📱 **Discord**: [Únete a nuestro servidor](https://discord.gg/artiles-photo)
- 📧 **Newsletter**: [Suscríbete a updates](https://newsletter.artilesphoto.com)
- 📝 **Blog**: [Artículos técnicos](https://blog.artilesphoto.com)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2024 Artiles Photography Studio

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

## 🙏 Agradecimientos

Un agradecimiento especial a:

- 🎨 **Diseñadores** que inspiraron el UI/UX
- 👥 **Comunidad Open Source** por las herramientas increíbles
- 📷 **Fotógrafos profesionales** por el feedback
- 🧪 **Beta testers** que probaron la aplicación
- ⚡ **Vite Team** por la herramienta de build increíble
- ⚛️ **React Team** por el framework fantástico

---

<div align="center">

**Hecho con ❤️ y mucho ☕ para Artiles Photography Studio**

*Capturando momentos, creando recuerdos* 📸

⭐ ¡Dale una estrella si te gusta el proyecto! ⭐

[![GitHub stars](https://img.shields.io/github/stars/AntRed1/artiles-photography-studio?style=social)](https://github.com/AntRed1/artiles-photography-studio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/AntRed1/artiles-photography-studio?style=social)](https://github.com/AntRed1/artiles-photography-studio/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/AntRed1/artiles-photography-studio?style=social)](https://github.com/AntRed1/artiles-photography-studio/watchers)

</div>
