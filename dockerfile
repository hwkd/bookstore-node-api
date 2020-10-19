# Build builder image
FROM hwkd/nodebuilder:12.2.0 as builder
ENV IS_CONTAINERIZED=true
WORKDIR /app
COPY . .
RUN NODE_ENV=development npm install && NODE_ENV=production npm run build

# Build production image
FROM node:12-alpine as production
ENV NODE_ENV=production
ENV IS_CONTAINERIZED=true

ARG maintainer
ARG build_date
ARG commit
ARG version
ARG vendor
ARG vsc_url=https://github.com/hwkd/bookstore

LABEL bookstore.api.maintainer=${maintainer} \
  bookstore.api.build-date=${build_date} \
  bookstore.api.vsc-url=${vsc_url} \
  bookstore.api.vsc-ref=${commit} \
  bookstore.api.vendor=${vendor} \
  bookstore.api.version=${version}

# Copy compiled/transpiled server-side code to final image
COPY --from=builder /app/dist /app/dist
# Copy compiled/transpiled client-side code to final image
# COPY --from=builder /app/public /app/public
# Copy server's package.json and package-lock.json to final image
COPY --from=builder /app/package*.json /app/

# Make all files in /app belong to user:group `node:node`
RUN chown -R node:node /app

USER node
WORKDIR /app
EXPOSE 3000

# Install npm packages needed in production only.
RUN npm install --only=production && npm cache clean --force
# Start server.
CMD ["node", "./dist/main.js"]