FROM node

EXPOSE 3000/tcp

WORKDIR /app
ADD ./package.json /app
RUN npm install

ADD . /app

CMD npm start

