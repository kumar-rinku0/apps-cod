FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}

EXPOSE 3000

CMD ["npm", "run", "preview"]
