FROM node:20 as build

WORKDIR /build

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

FROM node:20 as stage

WORKDIR /stage

COPY package.json .
COPY package-lock.json .
RUN npm ci --omit-dev

FROM gcr.io/distroless/nodejs20-debian11 as final

ENV NODE_ENV production

WORKDIR /app

COPY --from=stage /stage/node_modules node_modules
COPY --from=build /build/dist dist

EXPOSE 8080

CMD ["dist/main"]
