FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package.json ./
RUN yarn config set registry https://registry.npm.taobao.org -g
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn","start"]