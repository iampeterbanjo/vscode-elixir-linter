#!/bin/bash

platform='unknown'
unamestr=$(uname)
if [ "$unamestr" == 'Linux' ]; then
   platform='linux'
elif [ "$unamestr" == 'FreeBSD' ]; then
   platform='freebsd'
fi

if [ $platform == "linux" ]; then
  export CXX="g++-4.9" CC="gcc-4.9" DISPLAY=:99.0;
  sh -e /etc/init.d/xvfb.sh start;
  sleep 3;
fi
