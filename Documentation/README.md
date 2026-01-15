# Knappens Brädspels-Portal

## Instructions on how to start and run project
You need to start by installing all dependencies since the node_modules aren't on the repo. 
Then start the server and start the client.
Open a terminal and run these commands:
cd server
npm install
npm run dev
Then open a second terminal and run these commands:
cd client
npm install
npm run dev

## Overview of project
This is a platform to register your results in different board games, card games and other games. 
This is a Swedish app, so all texts are in Swedish. 
Though it starts of as group project 4, the intent is to continue develop the project, 
with more features and expanded authentication. 

## tech stack
This is based on the classical MERN stack: MongoDB, Express, React and Node.js. 

### Authentication
Firebase is used for authentication. Right now, the authentication is only one level: users. 
They can register account and log in, POST some personal data, PATCH this personal data, POST their sessions and POST new games. 

### ERD and Wireframing
Wireframing, made in PowerPont and saved as four separate png files, can be found in /documentation/
ERD, made with drawio and saved as a png file, can be found in /documentation/

### Client 
Framework is Vite - React with TypeScript
ESLint
TypeScript

### Server
TypeScript
No Prisma - it didn’t work with Prisma, massive errors, so I compromised and went with only Mongoose. 
NoSQL database - MongoDB
ZOD - used in server/src/schemas/
ESLint

### Logging using Winston
The file for configuring Winston is found under server/src/config/logger.ts
The error and combined (all messages) logs are found under server/logs/combined.log and server/logs/error.log

### Testing and Github actions
Jest is used for testing. 
Test files can be found in /server/__tests__
GitHub Actions runs when pushing to main branch. 

### Deployment, Vercel
Feel free to register many fake users, ideally use @example.com, and input much fake data, 
but please only POST real games. 

## Releases and features 
### 1.0 Very First Deployment
This is the absolut minimum required project, it's only main goal is to pass my group project 4. 

### 2.0
Well, stay tuned for that... 
