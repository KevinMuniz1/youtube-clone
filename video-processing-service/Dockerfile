# Use an official Node runtime as a parent Image
FROM node:18 AS buidler

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=buidler /app/dist ./dist

EXPOSE 3000

CMD ["npm","run","serve"]