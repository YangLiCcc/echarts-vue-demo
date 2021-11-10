// 服务器的入口文件
// 1、创建KOA的实例对象
const Koa = require('koa')
const app = new Koa()
// 2、绑定中间件
// 绑定第一层中间件 - 总耗时中间件
const DurationMiddleware = require('./middleware/koa_response_duration')
app.use(DurationMiddleware)
// 绑定第二层中间件 - 响应头中间件
const HeaderMiddleware = require('./middleware/koa_response_header')
app.use(HeaderMiddleware)
// 绑定第三层中间件 - 业务逻辑中间件
const DataMiddleware = require('./middleware/koa_response_data')
app.use(DataMiddleware)
// 3、绑定端口号 8888
app.listen(8888)