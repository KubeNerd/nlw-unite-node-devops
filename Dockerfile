FROM node:20 as base

FROM base as devdependencies
WORKDIR /usr/src/app
COPY  package*.json tsconfig.json ./
RUN npm install

FROM devdependencies as builddependencies
WORKDIR /usr/src/app
COPY . .
COPY  --from=devdependencies /usr/src/app/node_modules ./node_modules

RUN npm run build:tsup


FROM node:20-alpine3.19 as deployapp
WORKDIR /usr/src/app

COPY --from=builddependencies /usr/src/app/dist ./dist
COPY --from=builddependencies /usr/src/app/node_modules ./node_modules
COPY --from=builddependencies /usr/src/app/package.json ./package.json
COPY --from=builddependencies /usr/src/app/prisma ./prisma
RUN npm run generate

EXPOSE 3333

CMD ["npm", "start"]
