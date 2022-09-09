module.exports = {
  context: __dirname,
  target: 'webworker',
  entry: '../dist/worker.js',
  mode: 'development',
  devtool: 'cheap-module-source-map',
};
