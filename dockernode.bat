
docker run -it --workdir=/mnt -v %~dp0:/mnt -e PROXY_PORT=8181 -p 8181:8181 -p 5858:5858 mhart/alpine-node:4.4.5 node %*
