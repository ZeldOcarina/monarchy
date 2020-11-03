#!/bin/bash
#npm run build
#/home/Mattia/.nvm/versions/node/v12.18.2/bin/
tar czfv monarchy.io.tar.gz config/ content/ controller/ helpers/ models/ public/ routes/ src/ utils/ views/ .babelrc .env .gitignore app.js ecosystem.config.js package-lock.json package.json postcss.config.js server.js webpack.common.js webpack.dev.js webpack.prod.js
scp monarchy.io.tar.gz monarchy.io:~
rm monarchy.io.tar.gz

ssh monarchy.io << 'ENDSSH'

cd /home/Mattia/monarchy.io
/home/Mattia/.nvm/versions/node/v12.13.1/bin/pm2 stop ecosystem.config.js
rm -rf config/ content/ controller/ helpers/ models/ public/ routes/ src/ utils/ views/ .babelrc .env .gitignore app.js ecosystem.config.js package-lock.json package.json postcss.config.js server.js webpack.common.js webpack.dev.js webpack.prod.js node_modules
cd ~
tar xf monarchy.io.tar.gz -C /home/Mattia/monarchy.io
rm -f monarchy.io.tar.gz
cd /home/Mattia/monarchy.io/
npm install --production
/home/Mattia/.nvm/versions/node/v12.13.1/bin/pm2 reload ecosystem.config.js
exit
ENDSSH