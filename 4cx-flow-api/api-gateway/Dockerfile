FROM node:20-alpine

# Set the working directory
WORKDIR /api-gateway

# Copy only the package.json and package-lock.json (if available) for caching
COPY package*.json package-lock.json ./

# Install dependencies, including ts-node
RUN npm install -g ts-node nodemon && npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start"]
