const {
  override,
  addLessLoader,
  addWebpackPlugin,
  fixBabelImports,
} = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { default: darkTheme } = require('@ant-design/dark-theme');

module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: darkTheme,
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addWebpackPlugin(new AntdDayjsWebpackPlugin()),
);
