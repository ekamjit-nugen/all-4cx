FROM node:20-alpine

# Set working directory
WORKDIR /4cx-flow

# Copy only package.json and pnpm-lock.yaml for efficient caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "dev"]
