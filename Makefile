

COMPOSE = docker compose -f ./docker-compose.yml
# Use $(HOME) for reliable pathing across all developer machines
DB_PATH = $(HOME)/ft_dbs
DB_DIRS = $(DB_PATH)/auth_db $(DB_PATH)/boards_db $(DB_PATH)/chat_db $(DB_PATH)/dashboard_db


all: setup
	$(COMPOSE) up --build gateway frontend-dev


# --- Infrastructure Setup ---
setup:
	@mkdir -p $(DB_DIRS)
	@chmod -R 777 $(DB_PATH)

# --- Development & Production ---
prod: setup
	$(COMPOSE) up --build gateway frontend


down:
	$(COMPOSE) down

# --- Cleanup Rules ---

# Clean: Stops containers and removes the DB data (The "Reset" button)
clean:
	$(COMPOSE) down --remove-orphans
	@echo "⚠️ Removing database data..."
	@sudo rm -rf $(DB_PATH)/
	@echo "✅ Cleanup complete."

# Fclean: The "Nuclear" option - removes everything + docker cache + local volumes
fclean: clean
	$(COMPOSE) down --volumes --remove-orphans
	@echo "🧹 Pruning Docker builder cache..."
	@docker builder prune -af
	@echo "✨ System is deep-cleaned."

re: fclean all