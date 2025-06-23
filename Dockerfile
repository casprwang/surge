FROM node:22-alpine

# Install curl, which is used in the script
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source
COPY . .

# Command to run the script
CMD ["npm", "run", "build"] 