FROM node:18
ENV APP_PORT 8080
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY --chown=node . .
EXPOSE 8080
CMD npm run start:prod
