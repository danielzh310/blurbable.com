FROM node:20-alpine
WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm install --production=false

# copy source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]