################################################################################
# Setup
################################################################################

# Start from a rust base image
FROM rust:1.56.1

# Set the current directory
WORKDIR /app

# Copy everthing that is not dockerignored to the image
COPY . .

################################################################################
# Install Yarn & NPM dependencies
################################################################################

RUN apt-get --yes update
RUN apt-get --yes upgrade
RUN apt-get install --yes nodejs npm
RUN npm install --global yarn
RUN make install

################################################################################
# Install Docker
# see: https://www.how2shout.com/linux/install-docker-ce-on-debian-11-bullseye-linux/
################################################################################

RUN apt-get install --yes \
    apt-transport-https ca-certificates curl gnupg lsb-release

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | \
    gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

RUN echo \
    "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
    https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt --yes update

RUN apt-get --yes install docker-ce docker-ce-cli containerd.io

################################################################################
# Prepare
################################################################################

RUN rustup toolchain install nightly-2021-11-04
RUN rustup toolchain install stable
RUN rustup component add rust-src --toolchain nightly-2021-11-04-x86_64-unknown-linux-gnu
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

################################################################################
# Build
################################################################################

RUN rustup default stable
RUN cargo clean
RUN make generate

RUN rustup default nightly
RUN make playground-build

RUN rustup default stable
RUN make backend-build-prod

################################################################################
# Entrypoint
################################################################################

ENTRYPOINT [ \
    "./target/release/backend", \
    "--port", "4000", \
    "--host", "0.0.0.0", \
    "--frontend_folder", "packages/playground/dist" \
    ]
