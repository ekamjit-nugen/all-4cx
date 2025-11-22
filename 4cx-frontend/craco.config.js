// craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // '@/component': path.resolve(__dirname, 'src/pages/flowies/component/'),
      '@/App': path.resolve(__dirname, 'src/pages/flowies/app'),
      '@/api': path.resolve(__dirname, 'src/pages/flowies/api/'),
      '@/views': path.resolve(__dirname, 'src/pages/flowies/views'),
      '@/store': path.resolve(__dirname, 'src/pages/flowies/store'),
      '@/hooks': path.resolve(__dirname, 'src/pages/flowies/hooks/'),
      '@/themes': path.resolve(__dirname, 'src/pages/flowies/themes/'),
      '@/utils': path.resolve(__dirname, 'src/pages/flowies/utils/'),
      '@/assets': path.resolve(__dirname, 'src/pages/flowies/assets/'),
      '@/config': path.resolve(__dirname, 'src/pages/flowies/config/'),
      '@/routes': path.resolve(__dirname, 'src/pages/flowies/routes/'),
      '@/layout': path.resolve(__dirname, 'src/pages/flowies/layout/'),
      '@/ErrorBoundary': path.resolve(__dirname, 'src/pages/flowies/ErrorBoundary/'),
      '@/menu-items': path.resolve(__dirname, 'src/pages/flowies/menu-items/'),
      '@/ui-component': path.resolve(__dirname, 'src/pages/flowies/ui-component/'),
    },
  },
};
