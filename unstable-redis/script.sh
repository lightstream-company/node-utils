redis-server &
sleep 2
kill -9 $!
sleep 2
redis-server

