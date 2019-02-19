# Specify a base image
FROM node:10-stretch

# Specify the working app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
RUN npm install
COPY . .

# Default command
CMD npm start