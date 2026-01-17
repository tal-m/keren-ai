# Makefile for keren-ai (Maven Spring Boot project)
# Cross-platform: picks mvnw.cmd on Windows and ./mvnw on Unix, falls back to mvn if wrapper is missing.

ifeq ($(OS),Windows_NT)
	MVN := mvnw.cmd
else
	MVN := ./mvnw
endif

# If the selected MVN binary doesn't exist, fallback to system mvn
ifeq (,$(wildcard $(MVN)))
	MVN := mvn
endif

MVN_FLAGS ?= -B
SKIP_TESTS ?= true
PROFILE ?= dev
IMAGE_NAME ?= keren-ai:latest
DOCKER_COMPOSE ?= docker-compose.yaml

.PHONY: help build package test run run-dev clean docker-build docker-compose-up docker-compose-down logs

help:
	@echo "Makefile for keren-ai"
	@echo ""
	@echo "Targets:"
	@echo "  help                  Show this help"
	@echo "  build                 Clean & package (skips tests by default). Override: SKIP_TESTS=false"
	@echo "  package               Alias for build"
	@echo "  test                  Run tests"
	@echo "  run                   Run app using spring-boot:run"
	@echo "  run-dev               Run app with profile: PROFILE (default: dev)"
	@echo "  clean                 Clean build artifacts"
	@echo "  docker-build          Build Docker image (IMAGE_NAME)"
	@echo "  docker-compose-up     docker compose up -d --build"
	@echo "  docker-compose-down   docker compose down"
	@echo "  logs                  Tail compose logs"
	@echo ""
	@echo "Examples:"
	@echo "  make build"
	@echo "  make package SKIP_TESTS=false"
	@echo "  make run-dev PROFILE=dev"
	@echo "  make docker-build IMAGE_NAME=keren-ai:latest"

build:
	$(MVN) $(MVN_FLAGS) clean package -DskipTests=$(SKIP_TESTS)

package: build

test:
	$(MVN) $(MVN_FLAGS) test

run:
	$(MVN) $(MVN_FLAGS) spring-boot:run

run-dev:
	$(MVN) $(MVN_FLAGS) spring-boot:run -Dspring-boot.run.profiles=$(PROFILE)

clean:
	$(MVN) $(MVN_FLAGS) clean

docker-build:
	docker build -t $(IMAGE_NAME) .

docker-compose-up:
	docker compose -f $(DOCKER_COMPOSE) up -d --build

docker-compose-down:
	docker compose -f $(DOCKER_COMPOSE) down

logs:
	docker compose -f $(DOCKER_COMPOSE) logs -f

