# Use an official Node.js runtime as the base image
FROM node:16 as builder

# Set the working directory in the builder stage to /build
WORKDIR /build

# Copy package.json and package-lock.json into the root directory of your builder stage
# COPY package*.json ./
COPY package*.json pnpm-lock.yaml ./

# Install your dependencies
# RUN npm install

# Install pnpm and your dependencies
RUN npm install -g pnpm
RUN pnpm install

# Set the working directory in the final stage to /app
FROM node:16 as final

WORKDIR /app

# Copy the node_modules from the builder stage
COPY --from=builder /build/node_modules ./node_modules

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Make port 3000 available to the outside world
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "server.mjs" ]