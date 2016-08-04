redis-server --protected-mode no &
sleep 3
redis-cli SHUTDOWN
echo 'redis killed'
sleep 3
redis-server

