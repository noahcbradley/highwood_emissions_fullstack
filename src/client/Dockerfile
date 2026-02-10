# Use a small Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port Next.js dev server uses
EXPOSE 3000

# Start the Next.js dev server
CMD ["npm", "run", "dev"]