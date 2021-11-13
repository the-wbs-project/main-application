module.exports = {
  context: __dirname,
  target: 'webworker',
  entry: './worker.js',
  mode: 'development',
  devtool: 'cheap-module-source-map',
};
