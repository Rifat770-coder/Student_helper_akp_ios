# Student Sphere

An all-in-one academic companion for students.

## Features

- **CGPA Calculator** - Track courses and calculate GPA per semester
- **Notes** - Create, edit, and categorize study notes
- **To-Do List** - Manage tasks with priority levels and due dates
- **Class Routine** - Organize your weekly class schedule
- **Study Chatbot** - Get quick study tips and guidance

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/) component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React Router](https://reactrouter.com/) for client-side routing
- [Capacitor](https://capacitorjs.com/) for mobile packaging

## Getting Started

**Requirements:** Node.js 18+ and npm

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app runs at `http://localhost:8080`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Deployment

Build the project and deploy the `dist/` folder to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.):

```sh
npm run build
```
