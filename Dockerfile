FROM node:6

RUN mkdir /projects
WORKDIR /projects

COPY package.json ./package.json

RUN npm install

COPY db/ ./db/
COPY test/ ./test/

CMD npm test

