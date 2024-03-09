# Start with the Node.js base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies, including Puppeteer
RUN npm install

# Copy the rest of the application code
COPY . .

# Specify the default command to run your application
CMD ["node", "app.js"]
