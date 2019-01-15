#制作node镜像的版本
FROM node:8.9-alpine

#声明作者
MAINTAINER Jerry.X.Wang

#移动当前目录下面的文件到app目录下
ADD . /app/

#进入到app目录下，类似 CD
WORKDIR /app

#安装依赖
RUN npm install
# 对外暴露的接口
EXPOSE 3000

#程序启动的脚本
CMD ["npm", "start"]

