FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package.json ./
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn","start"]