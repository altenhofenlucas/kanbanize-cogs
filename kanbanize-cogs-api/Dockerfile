## BUILD
FROM node:16-alpine
WORKDIR /usr
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN yarn install
RUN yarn build
## RUNNING
FROM node:16-alpine
WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./
RUN mkdir /usr/tmp
RUN yarn install --only=production
COPY --from=0 /usr/dist .
RUN yarn global add pm2 -g
EXPOSE 4549
CMD ["pm2-runtime","server.js"]