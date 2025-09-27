FROM node:22-alpine

WORKDIR /user/src/app

COPY . .

# RUN npm ci --omit=dev
RUN npm ci

RUN npm run build

USER node

CMD ["npm", "run", "start:prod"]