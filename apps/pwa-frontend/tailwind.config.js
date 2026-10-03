/** 
 * @file tailwind.config.js
 * @description Tailwind CSS configuration. Maps utility classes to dynamic CSS variables 
 * to support the multi-tenant white-label theming strategy.
 * @type {import('tailwindcss').Config} 
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Dynamic color mapping using CSS variables injected at runtime
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
    },
  },
  plugins: [],
}