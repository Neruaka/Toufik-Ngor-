FROM mongo:7.0

COPY mongo-keyfile /etc/mongo/mongo-keyfile
RUN chmod 400 /etc/mongo/mongo-keyfile && chown mongodb:mongodb /etc/mongo/mongo-keyfile