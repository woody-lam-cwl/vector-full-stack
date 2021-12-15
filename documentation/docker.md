# Docker documentations

Two custom images are built for the React Web App and Python Server using the two `Dockerfile` and `.dockerignore` in their folders.

Both images can be found on DockerHub with image names `woodylamcwl/full-stack-react` and `woodylamcwl/full-stack-python`.

In the container, the components are run as follows:

| Container | Image                         | PORT |
| --------- | ----------------------------- | ---- |
| frontend  | woodylamcwl/full-stack-react  | 3000 |
| backend   | woodylamcwl/full-stack-python | 8000 |
| database  | postgres                      | 5432 |

A named volume of `db-data` is also used to preserve database data on restarts (which will be reset on Python server restarts currently but it can be removed on production).
