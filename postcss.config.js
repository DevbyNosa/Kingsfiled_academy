// postcss.config.js
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  plugins: [
    postcssImport,
   
    isProduction && cssnano({ preset: 'default' }),
  ].filter(Boolean),
};