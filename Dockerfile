FROM node AS dependencies

COPY ./package-lock.json /app/package-lock.json
COPY ./package.json /app/package.json
WORKDIR /app
RUN npm ci



FROM dependencies AS builder
COPY . /app
RUN npm run build



FROM nginx AS host
COPY --from=builder /app/dragon-fractals /usr/share/nginx/html/dragon-fractals
