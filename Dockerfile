FROM node:12.18.1-slim
EXPOSE 3000
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
CMD ["bash", "env.sh"]