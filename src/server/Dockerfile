# Use a small Node image
FROM node:20-alpine

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 3001

# Start NestJS dev server
CMD ["npm", "run", "start:dev"]