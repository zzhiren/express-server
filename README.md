# Server

# 功能和配置
- express4框架
- mongodb数据库
- 阿里云ECS服务器debian系统
- 使用mongoose操作mongodb进行数据的增删改查
- Axios进行代理请求，将前端请求转发至npm接口，然后将npm返回的数据在返回给前端
- jsonwebtoken实现token验证
- scheduleJob实现定时任务
- 阿里云配置域名解析到ECS主机IP
- nginx进行端口转发，将请求转发至node服务
- 配置iptables规则，允许/限制一些类型和来自某些端口的请求
- 阿里云安全组限制外网对mongodb端口的访问。pm2让nodejs服务常驻。


