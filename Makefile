# Variables
PROJECT_NAME = ft_transcendence
COMPOSE = docker compose -p $(PROJECT_NAME)
FILES = -f docker-compose.yml
VERBOSE = 0

# Verbosity
ifeq ($(VERBOSE),1)
	SILENT =
else
	SILENT = @
endif

# Use ngrok override
ifeq ($(USE_NGROK),1)
    FILES += -f docker-compose.override.yml
endif

# Colours
RESET := \033[0m
BOLD := \033[1m
BLACK := \033[30m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
BLUE := \033[34m

# Directories
DIR_SCRIPTS = scripts

######### Targets #########

# Default target: Show help
.PHONY: help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Variables:"
	@echo "  VERBOSE    - Set to 1 to show command output"
	@echo "  USE_NGROK  - Set to 1 to also create ngrok container using compose override file"
	@echo ""
	@echo "Targets:"
	@echo "  up       - Start the services defined in docker-compose.yml"
	@echo "  down     - Stop and remove the services"
	@echo "  build    - Build or rebuild the services"
	@echo "  buildnc  - Same build or rebuild the services"
	@echo "  start    - Start the services"
	@echo "  stop     - Stop the services"
	@echo "  logs     - View output from the services"
	@echo "  ps       - List the services"
	@echo "  clean    - Remove stopped containers, networks, and volumes"
	@echo "  restart  - Restart the services"
	@echo "  exec     - Execute a command in a running service container"
	@echo "  help     - Show this help message"

# Builds, (re)creates, starts, and attaches to containers for a service.
.PHONY: up
up: check-env
	$(SILENT) $(COMPOSE) $(FILES) up -d

.PHONY: check-env
check-env:
	$(SILENT)if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "📝 Created .env from .env.example"; \
	else \
		echo "✅ .env already exists, skipping"; \
	fi

# Watches for changes in files and rebuilds containers
PHONY: watch
watch:
	$(SILENT) $(COMPOSE) up --watch

# Stops containers and removes containers, networks, volumes, and images created by up
.PHONY: down
down:
	$(SILENT) $(COMPOSE) down

# Services are built once and then tagged
.PHONY: build
build:
	$(SILENT) $(COMPOSE) build

# Services are built once and then tagged without cache
.PHONY: buildnc
buildnc:
	$(SILENT) $(COMPOSE) build  --no-cache

# Starts existing containers for a service
.PHONY: start
start:
	$(SILENT) $(COMPOSE) start

# Stop the containers
.PHONY: stop
stop:
	$(SILENT) $(COMPOSE) stop

# View output from the services
.PHONY: logs
logs:
	$(SILENT) $(COMPOSE) logs -f

# List the services
.PHONY: ps
ps:
	$(SILENT) $(COMPOSE) ps

# Remove stopped containers, networks, and volumes
.PHONY: clean
clean:
	$(SILENT) $(COMPOSE) down -v --remove-orphans --rmi all

# Restart the services
.PHONY: restart
restart:
	$(SILENT) $(COMPOSE) restart

# Execute a command in a running service container
.PHONY: exec
exec:
	@read -p "Service name: " service; \
	read -p "Command: " cmd; \
	$(SILENT) $(COMPOSE) exec $$service $$cmd
