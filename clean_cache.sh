docker stop bnfacade
rm -r server/cache/*
docker compose up -d --build beacon-network-facade