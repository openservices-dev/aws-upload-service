FROM node:22-alpine AS build

RUN corepack enable
RUN yarn set version berry

USER node

RUN mkdir /home/node/aws-upload-service/ && chown -R node:node /home/node/aws-upload-service
WORKDIR /home/node/aws-upload-service

COPY --chown=node:node . .

RUN yarn install --immutable
RUN yarn build

FROM node:22-alpine

ARG USER_NAME=openservices
ARG GROUP_NAME=openservices
ARG PORT=3010

ENV NODE_ENV production

RUN apk update && \
  apk upgrade --no-cache && \
  apk add --no-cache ffmpeg exiftool && \
  corepack enable && \
  yarn set version berry && \
  addgroup --gid 3000 --system ${GROUP_NAME} && \
  adduser  --uid 2000 --system --ingroup ${GROUP_NAME} ${USER_NAME} && \
  mkdir /home/${USER_NAME}/aws-upload-service/

USER 2000:3000

WORKDIR /home/${USER_NAME}/aws-upload-service

COPY --chown=${USER_NAME}:${GROUP_NAME} --from=build /home/node/aws-upload-service/dist ./dist
COPY --chown=${USER_NAME}:${GROUP_NAME} --from=build /home/node/aws-upload-service/node_modules ./node_modules

EXPOSE $PORT

CMD [ "node", "dist/index.js" ]
