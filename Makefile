PROJECT_NAME=books-ai
DOCKER_IMAGE_APP=$(PROJECT_NAME):latest

build: 
	docker build -t $(DOCKER_IMAGE_APP) -f deployments/Dockerfile .

start: build 
	docker-compose -f deployments/docker-compose.yml up

stop: 
	docker compose -f deployments/docker-compose.yml down

clean: 
	docker rmi $(DOCKER_IMAGE_APP)