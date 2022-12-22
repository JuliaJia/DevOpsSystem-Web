const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    host: 'localhost',
    https: false,
    open: false,
    proxy: {
      '/api/v1': {
        target: 'http://192.168.56.12:9999',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api/v1': ''
        }
      }
    }
  }
})
