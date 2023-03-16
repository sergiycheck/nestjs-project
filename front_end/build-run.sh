#!/bin/sh

docker build . -t client_app_container

docker run -it -p 3005:3005 \
--name client_app \
-e GENERATE_SOURCEMAP=false \
-e PORT=3005 \
-e REACT_APP_WEB_API_HOST=localhost \
client_app_container