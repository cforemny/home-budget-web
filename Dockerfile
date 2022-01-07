FROM node:alpine
WORKDIR '/frontend'
EXPOSE 8090
COPY package.json .
COPY yarn.lock .
RUN npm install
COPY . .
CMD [ "npm", "start" ]