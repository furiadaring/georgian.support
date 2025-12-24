#!/bin/bash
cd /var/www/visitgeorgia
git stash
git pull origin master
npm install
npm run build
pm2 restart visitgeorgia
echo "Visit Georgia deployed successfully at $(date)"
