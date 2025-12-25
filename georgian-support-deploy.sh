#!/bin/bash
cd /var/www/georgian.support
git stash
git pull origin master
npm install
npm run build
pm2 restart georgian-support || pm2 start npm --name "georgian-support" -- start
echo "Georgian Support deployed successfully at $(date)"
