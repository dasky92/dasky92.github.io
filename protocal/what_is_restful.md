# What is Restful Protocal ?

> rest, full name is `Representational State Transfer (表现层状态转化)`.

## 重要的约束

- CS架构
- 无状态
- 缓存
- 统一接口
- 分层系统,(应用层，服务层，数据访问层)

## Feature

1. 用名词表示资源

Bad:
```text
GET /getusers/1
POST /users/1/delete
POST /users/1/create
```

Good:
```text
GET /users/1/
POST /users/1/
PUT /users/1/
```

这样写起来更加简单清晰，更容易扩展。

2. 合理使用请求方法和状态码



3. 合理使用请求头
4. 合理返回数据结构

