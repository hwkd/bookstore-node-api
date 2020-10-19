#!/usr/bin/env bash
version=0.0.0
vendor=hwkd
tag=${vendor}/bookstore:api-${version}
commit=somecommithash
build_date="01/01/20"
maintainer="maintainer@emaildomain.com"

if docker build -t "${tag}" \
  --build-arg build_date="${buid_date}" \
  --build-arg commit="${commit}" \
  --build-arg vendor="${vendor}" \
  --build-arg maintainer="${maintainer}" \
  --build-arg version="${version}" .; then
    docker push "${tag}"
fi