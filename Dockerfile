FROM node:14

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./

RUN npm install

COPY config ./config
COPY ./src ./src

CMD [ "npm", "run", "start:prod" ]
