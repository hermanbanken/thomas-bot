#!/bin/sh

# Upgrading nodejs from 0.10.38-r0 to 0.12.7-r1 on root.
# source: http://jeanbrito.com/2016/03/06/updating-intel-edisons-nodejs-to-0-12-7/
cat <<EOF > /etc/opkg/base-feeds.conf
src/gz all http://repo.opkg.net/edison/repo/all
src/gz edison http://repo.opkg.net/edison/repo/edison
src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32
EOF
opkg update && opkg install nodejs