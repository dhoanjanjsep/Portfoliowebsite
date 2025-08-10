# Overview

This is a full-stack portfolio website for a game developer, built with a modern TypeScript tech stack. The application showcases games, projects, and blog posts, with an interactive Unity game player and a comprehensive content management system. The site features a gaming-inspired dark theme with neon colors and supports both Korean and English content.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **Styling**: Tailwind CSS with custom gaming-themed color variables and dark mode support
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API endpoints
- **File Upload**: Multer middleware for handling Unity WebGL build uploads (50MB limit)
- **Development**: Custom Vite integration for hot module replacement in development
- **Error Handling**: Centralized error middleware with structured JSON responses
- **Logging**: Request/response logging with performance timing for API routes

## Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Separate shared schema file defining users, blog posts, games, and projects tables
- **Storage**: Abstracted storage interface with in-memory implementation for development
- **Migrations**: Drizzle Kit for database schema migrations and management

## API Design
- **Blog Posts**: Full CRUD operations with category filtering and tagging support
- **Games**: Upload management for Unity WebGL builds with metadata storage
- **Projects**: Portfolio showcase with technology tags and platform information
- **Contact**: Form submission handling for client inquiries

## Content Management
- **Unity Integration**: Built-in Unity WebGL player with file upload capabilities
- **Blog System**: Rich content creation with categories, tags, and image support
- **Project Gallery**: Filterable portfolio display with technology categorization
- **Media Handling**: Image URL storage with support for external CDN integration

## Development Features
- **Hot Reload**: Integrated Vite development server with Express backend
- **Type Safety**: End-to-end TypeScript with shared types between frontend and backend
- **Code Organization**: Monorepo structure with shared schema and utilities
- **Component Library**: Comprehensive UI component system with consistent theming

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI Framework
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Consistent icon library for UI elements
- **Embla Carousel**: Touch-friendly carousel component for media galleries

## Development Tools
- **Vite**: Fast build tool with HMR support and optimized production builds
- **TanStack Query**: Server state synchronization and caching layer
- **React Hook Form**: Performant form library with validation integration
- **Zod**: Runtime type validation for API requests and form data

## File Handling
- **Multer**: Express middleware for multipart/form-data file uploads
- **File System**: Local storage for Unity WebGL builds and static assets

## Utilities
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional CSS class name utility
- **class-variance-authority**: Type-safe variant API for component styling