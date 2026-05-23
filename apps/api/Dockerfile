FROM node:22-alpine

WORKDIR /app

COPY .output/package.json ./
COPY .output/ ./

EXPOSE 9002

CMD ["node", "--enable-source-maps", "index.js"]
