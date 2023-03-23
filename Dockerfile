FROM node:16.13.1-alpine3.14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Copies package.json, package-lock.json, tsconfig.json to the root of WORKDIR
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]

# Copies everything in the src directory to WORKDIR/src
COPY ./src ./src

# Installs all packages
RUN npm install

# Make this port accessible from outside the container
EXPOSE 8080

# Start the server
CMD npm run tsc && npm run start
