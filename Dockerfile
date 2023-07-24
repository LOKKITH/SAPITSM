FROM ubuntu:22.04

RUN mkdir -p /tmp/app/Flask_api
RUN mkdir -p /tmp/app/config

COPY /Flask_api /tmp/app/Flask_api
COPY /config /tmp/app/config


# Update and install required dependencies

RUN apt-get update && \
    apt-get install -y curl gnupg

RUN apt-get install -y python3 python3-pip

# Install Node.js and npm
# RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -

# Install Elasticsearch
RUN curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
RUN echo "deb https://artifacts.elastic.co/packages/oss-7.x/apt stable main" | tee /etc/apt/sources.list.d/elastic-7.x.list

# Install Elasticsearch and Kibana
RUN apt-get update && apt-get install -y elasticsearch-oss kibana-oss
RUN apt-get update && apt-get install -y nano
RUN apt install cron
RUN sudo systemctl start cron && sudo systemctl enable cron



# Install additional dependencies
RUN apt-get install -y nginx

# Install additional Node.js packages
# RUN npm install -g axios swagger-ui-express express

RUN pip3 install flask

RUN pip3 install pymongo pandas requests openpyxl ruamel.yaml flask apscheduler python-crontab flask_pymongo flask_cors

# Expose ports
EXPOSE 9200 5601 5000

# Set the entrypoint command
ENTRYPOINT service elasticsearch start && service kibana start && tail -f /dev/null && python3 /tmp/app/Flask_api/app.py