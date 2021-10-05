#!/bin/bash
#/home/Mattia/.nvm/versions/node/v12.18.2/bin/
#npm run build
#tar czfv monarchy.io.tar.gz config/ content/ controller/ helpers/ middleware/ models/ public/ routes/ src/ utils/ views/ .babelrc .env .gitignore app.js ecosystem.config.js package.json package-lock.json postcss.config.js server.js webpack.common.js webpack.dev.js webpack.prod.js
tar czfv monarchy.io.tar.gz config/ content/ controller/ helpers/ middleware/ models/ routes/ src/ utils/ views/ .babelrc .env .gitignore app.js ecosystem.config.js package.json postcss.config.js server.js webpack.common.js webpack.dev.js webpack.prod.js
scp monarchy.io.tar.gz ubuntu@monarchy.io:~
rm monarchy.io.tar.gz

ssh ubuntu@monarchy.io << 'ENDSSH'

cd /home/Mattia/monarchy.io
/home/Mattia/.nvm/versions/node/v12.13.1/bin/pm2 stop ecosystem.config.js
sudo rm -rf config/ content/ controller/ helpers/ middleware/ models/ node_modules/ routes/ src/ utils/ views/ .babelrc .env .gitignore app.js ecosystem.config.js package.json postcss.config.js server.js webpack.common.js webpack.dev.js webpack.prod.js node_modules
cd ~
sudo tar xf monarchy.io.tar.gz -C /home/Mattia/monarchy.io
sudo rm -f monarchy.io.tar.gz
cd /home/Mattia/monarchy.io/
sudo su Mattia
npm install --production
/home/Mattia/.nvm/versions/node/v12.13.1/bin/pm2 reload ecosystem.config.js
exit
ENDSSH