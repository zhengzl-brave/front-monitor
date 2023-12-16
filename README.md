# front-monitor

> 前端监控稳定性

如何能够提升前端的稳定性，一直是一个经久不衰、且永不会过时的前端话题。我们可以确保产品的正常运行和用户体验的稳定性，针对前端功能的异常情况可以做到及时发现，为后续的故障排查和复现提供有效的线索，有助于改善系统的性能和稳定性，以及提升前端的可用性和用户体验水平。同时，可以让团队把更多的时间用于改进程序的用户体验，同时节省开发维护成本。

技术上：

1. 前端稳定性监控的完整流程；
2. 前端稳定性监控统计指标的思路及无埋点的实现；
3. 前端稳定性监控指标的上传方式的实现；
4. Node 层作为数据清洗层，进行的常见的数据清洗规则及使用；
5. 使用 Node 进行持久化的数据存储，及稳定性指标的展示。

## 产物

1. 前端监控 npm 包
   1. [front-monitor-browser]：前端稳定性监控 页面监控；
   2. [front-monitor-core]：前端稳定性监控 核心功能；
   3. [front-monitor-react]：前端稳定性监控 React 监控；
   4. [front-monitor-vue]：前端稳定性监控 Vue 监控；
   5. [front-monitor-web]：前端稳定性监控 Web 监控；
   6. [front-monitor-web-performance]：前端稳定性监控 Web 性能监控；
   7. [front-monitor-wx-miniprogram]：前端稳定性监控 小程序监控；
   8. [front-monitor-wx-miniprogram-performance]：前端稳定性监控 小程序性能监控；
2. 监控异常收集 node 服务；
3. 前端监控异常告警&界面展示；

## 技术选型

- 包管理工具：pnpm；
- 构建工具：encode-bundle, 该构建工具是基于 ESBuild 和 swc 实现的前端构建工具；
- 数据清洗&存储：Node 生态；
