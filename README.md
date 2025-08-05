# TravelQuest Adventures - Frontend Application

![TravelQuest Logo](public/vite.svg)

## 🌍 Overview

TravelQuest Adventures is a modern, responsive travel booking and exploration platform built with React, TypeScript, and cutting-edge UI components. This frontend application provides users with an intuitive interface to discover destinations, book tours, read travel blogs, and manage their travel experiences.

## ✨ Features

### 🎯 **Core User Features**
- **🏠 Home Page**: Hero section with featured destinations and quick search
- **🗺️ Destination Explorer**: Advanced search and filtering for travel destinations
- **🎫 Tour Booking**: Complete tour booking system with detailed information
- **📝 Travel Blogs**: Rich content management with reading and commenting
- **💾 Saved Destinations**: Personal wishlist functionality
- **👤 User Account**: Profile management and booking history
- **🔐 Authentication**: Secure login/signup with AWS Cognito

### 🛡️ **Admin Features**
- **📊 Admin Dashboard**: Comprehensive analytics and management interface
- **➕ Content Management**: Add/edit destinations, tours, and blogs
- **💬 Comment Moderation**: Advanced comment approval and spam detection
- **👥 User Management**: User roles and permission management
- **📈 Analytics**: Real-time platform metrics and insights

### 🎨 **UI/UX Features**
- **🌙 Dark/Light Mode**: Seamless theme switching
- **📱 Responsive Design**: Mobile-first responsive layout
- **🎭 Modern Components**: Shadcn/ui component library
- **⚡ Performance**: Optimized with Vite build system
- **🔄 Real-time Updates**: Live data synchronization
- **🎪 Animations**: Smooth transitions with Framer Motion

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### **UI & Styling**
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Production-ready motion library

### **State & Data Management**
- **React Hooks** - Modern state management
- **AWS Amplify & DynamoDB** - Serverless backend integration
- **Local Storage** - Client-side data persistence

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── figma/           # Figma-designed components
│   ├── Home.tsx         # Homepage component
│   ├── TravelListings.tsx
│   ├── DestinationDetail.tsx
│   ├── Auth.tsx
│   ├── AdminDashboard.tsx
│   └── ...
├── utils/               # Utility functions
│   ├── api.tsx          # API utilities
│   └── auth.tsx         # Authentication utilities
├── lib/                 # Library configurations
│   └── utils.ts         # General utilities
├── styles/              # Global styles
│   └── globals.css
├── assets/              # Static assets
└── guidelines/          # Development guidelines
    └── Guidelines.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArnoldKebaso/Travel_Quest_Adventures.git
   cd "Travel_Quest_Adventures/TravelQuest Adventures App/Starter/travelquest"
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using pnpm (recommended)
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**
   ```env
   # AWS Configuration
   VITE_API_BASE_URL=your_api_gateway_url
   
   # API Configuration (Backend)
   VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/Prod
   
   # AWS Cognito (if using backend)
   VITE_COGNITO_USER_POOL_ID=your_user_pool_id
   VITE_COGNITO_CLIENT_ID=your_client_id
   VITE_COGNITO_REGION=your_aws_region
   ```

### Development

```bash
# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview

# Lint code
npm run lint
# or
pnpm lint
```

## 🔧 Configuration

### **AWS Setup**
1. Configure an AWS Cognito user pool and any identity providers.
2. Deploy backend APIs (SAM/Amplify) and DynamoDB tables.
3. Update environment variables with your API base URL and Cognito details.

### **Theme Configuration**
The application supports light/dark themes with custom color schemes:

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ... more colors
      }
    }
  }
}
```

### **Component Customization**
Components are built with Shadcn/ui and can be customized:

```bash
# Add new components
npx shadcn-ui@latest add component-name

# Update existing components
npx shadcn-ui@latest update
```

## 📱 Pages & Features

### **Public Pages**
- **`/`** - Homepage with hero section and featured content
- **`/listings`** - Browse all destinations with filters
- **`/destination/:id`** - Detailed destination view
- **`/tours`** - Tour listings and booking
- **`/blogs`** - Travel blog articles
- **`/about`** - About us page
- **`/contact`** - Contact information

### **User Pages**
- **`/auth`** - Login/Register
- **`/account`** - User profile and settings
- **`/saved`** - Saved destinations and bookings

### **Admin Pages**
- **`/admin`** - Admin dashboard
- **`/admin/add-guide`** - Content management
- **`/admin/comments`** - Comment moderation
- **`/admin/users`** - User management

## 🔌 API Integration

### **Backend Integration**
The frontend integrates with the TravelQuest backend API:

```typescript
// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Example API calls
const fetchDestinations = async () => {
  const response = await fetch(`${API_BASE_URL}/destinations`);
  return response.json();
};
```

### **Authentication Flow**
```typescript
// AWS Amplify Auth Integration
import { Auth } from 'aws-amplify';

const signIn = async (email: string, password: string) => {
  await Auth.signIn(email, password);
};
```

## 🎨 Styling Guide

### **Tailwind Classes**
Common utility classes used throughout the application:

```css
/* Layout */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Typography */
.heading-primary {
  @apply text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight;
}

/* Components */
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:scale-105;
}
```

### **Component Patterns**
```typescript
// Standard component structure
interface ComponentProps {
  title: string;
  description?: string;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  description,
  className
}) => {
  return (
    <div className={cn("base-classes", className)}>
      <h2 className="heading-primary">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};
```

## 🧪 Testing

### **Component Testing**
```bash
# Run tests (when test suite is added)
npm test

# Test coverage
npm run test:coverage
```

### **Manual Testing Checklist**
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] Search and filtering functional
- [ ] Responsive design on mobile/tablet
- [ ] Dark/light theme switching
- [ ] Form submissions work
- [ ] Admin features accessible

## 📦 Build & Deployment

### **Production Build**
```bash
# Create optimized build
npm run build

# Build output will be in 'dist/' directory
```

### **Deployment Options**

#### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### **Netlify**
```bash
# Build command: npm run build
# Publish directory: dist
```

#### **AWS S3 + CloudFront**
```bash
# Build the application
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔒 Security Features

- **Input Sanitization** - XSS protection
- **Authentication** - Secure user sessions
- **Route Protection** - Private route guards
- **HTTPS Only** - Secure data transmission
- **Environment Variables** - Sensitive data protection

## 🚀 Performance Optimizations

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - WebP format and lazy loading
- **Bundle Analysis** - Optimized build sizes
- **Caching** - Browser and API response caching
- **Prefetching** - Strategic data prefetching

## 📊 Browser Support

- **Chrome** (last 2 versions)
- **Firefox** (last 2 versions)
- **Safari** (last 2 versions)
- **Edge** (last 2 versions)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow the coding guidelines in `src/guidelines/Guidelines.md`
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### **Code Standards**
- Use TypeScript for all new files
- Follow ESLint configuration
- Write meaningful component names
- Add proper type definitions
- Include error handling

## 🐛 Troubleshooting

### **Common Issues**

#### **Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Environment Variables Not Loading**
```bash
# Ensure .env.local is in project root
# Prefix variables with VITE_
# Restart dev server after changes
```

#### **AWS Connection Issues**
Ensure your `VITE_API_BASE_URL` matches the deployed API Gateway and that Cognito credentials are valid.

## 📞 Support & Contact

- **Project Repository**: [GitHub](https://github.com/ArnoldKebaso/Travel_Quest_Adventures)
- **Documentation**: [Project Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](https://github.com/ArnoldKebaso/Travel_Quest_Adventures/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** - For the amazing component library
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Vite** - For the lightning-fast build tool
- **AWS Amplify** - For the serverless tooling

---

**Built with ❤️ by the TravelQuest Team**

*Last updated: August 2025*

---

## Technical Notes (React + TypeScript + Vite)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
