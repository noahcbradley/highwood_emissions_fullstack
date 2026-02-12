# Use official Node.js 18 image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lockfile first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server source code
COPY . ./ 

# Accept DATABASE_URL as a build argument
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Debug: print the variable at build time
RUN echo "DATABASE_URL at build time: $DATABASE_URL"

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package.json & lockfile
COPY package*.json ./

# Install only production deps
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Set environment variable for Prisma
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "run", "start:prod"]