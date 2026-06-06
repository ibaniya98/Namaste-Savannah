PROJECT_NAME=namaste-savannah
SERVICE_NAME=main-website
REPOSITORY=main
REGION=us-east1

HOSTNAME=$(REGION)-docker.pkg.dev
IMAGE_NAME=node-web-app

# Docker Image Setup
TAG=$(shell git rev-parse --short HEAD)
DOCKER_IMAGE=$(HOSTNAME)/$(PROJECT_NAME)/$(REPOSITORY)/$(IMAGE_NAME):$(TAG)

auth:
	gcloud auth configure-docker $(HOSTNAME)

build:
	docker image build -f Dockerfile.prod . -t $(DOCKER_IMAGE)

publish:
	docker push $(DOCKER_IMAGE)

update-service:
	gcloud run deploy $(SERVICE_NAME) --image $(DOCKER_IMAGE)
