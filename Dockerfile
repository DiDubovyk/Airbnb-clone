FROM node 

WORKDIR /app 

COPY package*.json ./

RUN npm install 

COPY . .

RUN npx prisma generate
RUN npm run build -- --no-lint

EXPOSE 3000

CMD ["npm", "run", "start"]