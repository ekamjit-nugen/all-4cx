FROM node:20-alpine

# Set working directory
WORKDIR /4cx-main

# Copy only package.json and package-lock.yaml for efficient caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 9002

# Start the application
CMD ["npm", "run", "dev"]
