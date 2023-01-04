// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: {
//     port: 8080,
//     host: 'localhost',
//     https: false,
//     open: false,
//     proxy: {
//       '/api/v1': {
//         target: 'http://192.168.56.12:9999',
//         changeOrigin: true,
//         ws: true,
//         pathRewrite: {
//           '^/api/v1': ''
//         }
//       }
//     }
//   }
// })
// const { defineConfig } = require('@vue/cli-service')
// module.export = defineConfig({
// const { defineConfig } = require('@vue/cli-service')
module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production',
      config => {
      // 生产环境配置
        config.plugin('html').tap(args => {
          args[0].title = 'OneManDevOpsSystem'
          return args
        })
      },
      config => {
      // 开发环境配置
        // config.transpileDependencies(true)
        config.devServer
          .port(8080)
          .host('localhost')
          .https(false)
          .open(false)
          .proxy({
            '/api/v1': {
              target: 'http://192.168.56.12:9999',
              changeOrigin: true,
              ws: true,
              pathRewrite: {
                '^/api/v1': ''
              }
            }
          })
        config.plugin('html').tap(args => {
          args[0].title = 'OneManDevOpsSystem-Dev'
          console.log(args)
          return args
        })
      })
  }
}
