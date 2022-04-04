const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    filename: 
    path: path.resolve(__dirname, 'dist'),
  }
}