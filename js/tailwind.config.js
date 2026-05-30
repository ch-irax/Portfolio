tailwind.config = {
  theme: {
    extend: {
      colors: {
        deep: '#0A0A0A',
        card: '#1A1A1A',
        accent: '#555555',
        muted: '#AAAAAA',
        brand: '#e4002b',
        'logo-grey': '#b8b8b8',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(255, 255, 255, 0.08)',
        'glow-lg': '0 0 40px rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};
