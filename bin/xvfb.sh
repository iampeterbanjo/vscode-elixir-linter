#!/bin/bash

# https://gist.github.com/jterrace/2911875
# install xvfb (e.g. Through apt-get if you're using a Debian system)
# copy the contents of this file to
#   /etc/init.d/xvfb.sh
# you'll probably need to make it executable
#   sudo chmod +x /etc/init.d/xvfb.sh
# and then you can start it with
#  /etc/init.d/xvfb.sh start

# if you get start-stop-daemon: unable to open pidfile
# '/var/run/xvfb.pid' for writing (Permission denied) then
#   sudo mkdir /var/run/xvfb
#   sudo chown `whoami`` /var/run/xvfb/ #bash
#   sudo chown (whoami) /var/run/xvfb/ #fish shell


XVFB=/usr/bin/Xvfb
XVFBARGS=":99 -screen 0 1024x768x24 -fbdir /var/run -ac"
PIDFILE=/var/run/xvfb/xvfb.pid
case "$1" in
  start)
    echo -n "Starting virtual X frame buffer: Xvfb"
    start-stop-daemon --start --quiet --pidfile $PIDFILE --make-pidfile --background --exec $XVFB -- $XVFBARGS
    echo "."
    ;;
  stop)
    echo -n "Stopping virtual X frame buffer: Xvfb"
    start-stop-daemon --stop --quiet --pidfile $PIDFILE
    echo "."
    ;;
  restart)
    $0 stop
    $0 start
    ;;
  *)
        echo "Usage: /etc/init.d/xvfb {start|stop|restart}"
        exit 1
esac

exit 0
