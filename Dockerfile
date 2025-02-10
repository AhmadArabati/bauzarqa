FROM ghcr.io/puppeteer/puppeteer:24.2.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXCUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Ensure the directory for storing PDFs exists and set permissions
RUN mkdir -p /usr/src/app/public/services/cv-maker/cvs && chmod -R 777 /usr/src/app/public/services/cv-maker/cvs

CMD [ "node", "index.js" ]