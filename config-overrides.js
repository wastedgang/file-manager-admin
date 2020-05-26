const path = require('path')
const { override, addDecoratorsLegacy, addWebpackAlias, fixBabelImports, addLessLoader, addWebpackPlugin } = require('customize-cra')
const { getThemeVariables } = require('antd/dist/theme')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

module.exports = override(
  addDecoratorsLegacy(),

  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src"),
  }),

  fixBabelImports('antd', {
    libraryDirectory: 'es',
    style: true,
  }),

  addWebpackPlugin(new AntdDayjsWebpackPlugin()),

  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: getThemeVariables({ compact: true })
    }
  }),
)