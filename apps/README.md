
# DataFed Applications

DataFed has been modularized such that it is split into different applications.

1. worker   - this is task worker and should run on the DataFed server.
2. queue    - this is the queue for the tasking and should also be run on the
DataFed server.
3. database - this is the backend database code and includes the foxx
microservice files.
4. web      - this is where the web server files are contained. 
