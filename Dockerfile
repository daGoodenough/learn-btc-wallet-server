FROM node:16
WORKDIR /server
COPY package*.json ./
RUN npm install
CMD npm run dev