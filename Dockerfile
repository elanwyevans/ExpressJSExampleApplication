#### SHARED DOCKER STAGES ##############

# The OS setup
FROM ubuntu as developer-os
MAINTAINER mike <michael.dacey@uwtsd.ac.uk>
ENV DEBIAN_FRONTEND    noninteractive
RUN apt-get update --fix-missing && \
apt-get install -y software-properties-common && \
apt-get install -y --no-install-recommends apt-utils && \
apt-get install -y curl \
wget
RUN apt-get install -y sudo
RUN echo "export SERVER_IP_ADDRESS='0.0.0.0'" >> /etc/profile
RUN apt-get clean

# Setup for node.js
FROM developer-os as nodeenv
MAINTAINER mike <michael.dacey@uwtsd.ac.uk>
# Create and change the working directory
WORKDIR /var/www/node
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && \
apt-get install -y nodejs
RUN apt-get install -y npm
#NPM and NPX are now built into node install
#RUN npm install -g npm && \
#npm install -g npx --force
RUN npm config set strict-ssl false

RUN apt-get install inotify-tools -y
RUN sudo npm install -g nodemon
RUN apt-get clean


#### THE WEB SERVER ##############

FROM nodeenv as webserver
# Expose our webservers port number
EXPOSE 80
# Change to the working directory
WORKDIR /var/www/node
# Execute the application
ENTRYPOINT ["npm", "run", "start-mount"]

#### THE WEB SERVICE ##############

FROM nodeenv as webservice
# Expose our webservices port number
EXPOSE 1339
# Change to the working directory
WORKDIR /var/www/node
# Execute the application
ENTRYPOINT ["npm", "run", "start-mount"]
