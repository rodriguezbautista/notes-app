#!/bin/bash

cleanup() {
    echo "Exiting script due to error..."

    kill -s SIGTERM $NODE_PID_4
    kill -s SIGTERM $NODE_PID_3
    kill -s SIGTERM $NODE_PID_2
    kill -s SIGTERM $NODE_PID_1
    # Additional cleanup tasks if needed
    exit 1
}

trap cleanup ERR
trap cleanup EXIT

# Navigate to the backend directory
cd ./backend

# Run npm install for backend
npm install
NODE_PID_1=$!

# Create .env file with specified content
echo "DATABASE_URL=\"postgresql://rodriguezbautista:yQY7MuiphBd4@ep-orange-fog-a5hu0nrc-pooler.us-east-2.aws.neon.tech/notesdb?sslmode=require&pgbouncer=true\"" > .env
echo "JWT_SECRET=\"efcf99d4-a220-4840-9f6c-4346cc61a39a\"" >> .env
echo "DIRECT_URL=\"postgresql://rodriguezbautista:yQY7MuiphBd4@ep-orange-fog-a5hu0nrc.us-east-2.aws.neon.tech/notesdb?sslmode=require\"" >> .env

# Run npm start for backend
npm run start:dev &
NODE_PID_2=$!

# Move back to the project root
cd ..

# Navigate to the frontend directory
cd ./frontend

npm install
NODE_PID_3=$!


# Create .env file with specified content
export REACT_APP_API_URL="http://localhost:8080"

npm run start
NODE_PID_4=$!
