// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      colors: {
        brand: {
          mint: "#98FF98", // Mint tươi (hoặc #A0E7E5 tùy sở thích)
          beige: "#F5F5DC", // Beige vàng cát
          dark: "#2D3436", // Màu chữ tối cho độ tương phản cao
          accent: "#FF7675", // Màu nhấn cho nút CTA hoặc giá tiền
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'], // Cần config font trong layout.tsx
      },
    },
  },
  plugins: [],
};
export default config;