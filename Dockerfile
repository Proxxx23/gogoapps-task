FROM node:18
WORKDIR /usr/src/app
COPY --chown=node package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV 'production'
ENV PORT 8080
ENV CONCURRENT_REQUESTS 5
ENV API_KEY 'DEMO_KEY'
CMD npm run start:prod
