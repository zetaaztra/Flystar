# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the project files into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install http-server

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run a simple HTTP server to serve the HTML file
CMD ["npx", "http-server", "src", "-p", "8080"]

