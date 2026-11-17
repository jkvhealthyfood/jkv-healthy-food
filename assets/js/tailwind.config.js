tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2E7D32',
          dark: '#1B5E20',
          forest: '#1A2E1A',
          mint: '#E8F5E9',
          sage: '#C8E6C9',
          cream: '#FAF8F2',
          sand: '#F3EFE6',
          gold: '#D97706'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Fraunces"', 'serif']
      },
      boxShadow: {
        soft: '0 10px 35px -5px rgba(26, 46, 26, 0.06)',
        card: '0 15px 40px -10px rgba(46, 125, 50, 0.10)',
        float: '0 20px 45px -12px rgba(27, 94, 32, 0.18)'
      }
    }
  }
};
