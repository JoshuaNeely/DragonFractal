FROM node:latest

WORKDIR /home/dragon-fractal

COPY src /home/dragon-fractal/src/
COPY package.json /home/dragon-fractal/
COPY package-lock.json /home/dragon-fractal/
COPY bower.json /home/dragon-fractal/

RUN npm install

ENTRYPOINT npm run start 8080
