# Use official Node.js 20 image (alpine)
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (leverage cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Accept NEXT_PUBLIC_API_URL as a build argument
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Debug: print the variable at build time
RUN echo "NEXT_PUBLIC_API_URL at build time: $NEXT_PUBLIC_API_URL"

# Build the Next.js app for production
RUN npm run build

# -------------------------
# Production image
# -------------------------
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port Next.js listens on
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]
