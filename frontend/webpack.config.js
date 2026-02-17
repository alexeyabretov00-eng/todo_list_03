const dotenv = require('dotenv');
const { DefinePlugin } = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WorkboxPlugin } = require('workbox-webpack-plugin');

const getEnvs = (file = '.env') => {
  const env = dotenv.config({ path: path.join(process.cwd(), file) }).parsed || {};

  return env;
};

module.exports = () => {
  const env = getEnvs('.env');
  const isDevelopment = env.NODE_ENV === 'development';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: isDevelopment,
                getCustomTransformers: () => ({
                  before: [
                    require('typescript-plugin-styled-components').default({
                      ssr: false,
                      displayName: isDevelopment,
                      fileName: isDevelopment,
                    }),
                  ],
                }),
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@containers': path.resolve(__dirname, 'src/containers'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@slices': path.resolve(__dirname, 'src/slices'),
        '@selectors': path.resolve(__dirname, 'src/selectors'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@theme': path.resolve(__dirname, 'src/styles/theme'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
    plugins: [
      new DefinePlugin({
        ...Object.entries(env).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: JSON.stringify(value),
          }),
          {},
        ),
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      !isDevelopment && new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      }),
    ].filter(Boolean),
    devServer: {
      port: 8080,
      hot: true,
      open: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      ],
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  };
};
