#!/bin/bash

cd server/
nohup node index.js &

cd ../client/
nohup python3 -m http.server &

cd ../arduino/
nohup python3 readData.py &
