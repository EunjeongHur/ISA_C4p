# 1. Use Node.js as the base image
FROM node:18

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy package.json and package-lock.json to the container
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your application files to the container
COPY . .

# 6. Expose the port your app will run on
EXPOSE 3000

# 7. Command to run your app
CMD ["node", "index.js"]
