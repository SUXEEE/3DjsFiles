
#!/bin/sh
cd $(cd $(dirname $0);pwd)
python -m http.server 8888 &
