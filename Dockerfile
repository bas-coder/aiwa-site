# NOT currently used by the preview deploy. Kept because it is the missing piece if the lander is
# ever given its own builder.
#
# Today the preview service builds with the REPO-ROOT Dockerfile and simply starts this app instead
# of the API (`node /app/apps/lander/server/index.mjs`). That was the only configuration that would
# deploy: Railway resolves the root Dockerfile for every service in this repo, and a service created
# after 2026-08-28 cannot opt into a per-service config file, so neither a railway.json here nor this
# Dockerfile is ever read.
#
# The cost is exactly what the server header warns against: the lander's deploy is coupled to the
# api+web image. Decoupling it means changing repo-level build config, which affects production, so
# it is a deliberate decision rather than a tidy-up.
FROM node:22-alpine

WORKDIR /app
COPY . .

# server/index.mjs reads process.env.PORT and falls back to 4300.
EXPOSE 4300
CMD ["node", "server/index.mjs"]
