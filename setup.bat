@echo off
REM ================================
REM ResumeNest Quick Setup Script (Windows)
REM ================================

echo ================================
echo ResumeNest Docker Setup
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop: https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

REM Check Docker Compose
docker compose version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Compose is not available!
    echo Please ensure Docker Desktop is running.
    pause
    exit /b 1
)

echo Docker found: 
docker --version
echo Docker Compose found:
docker compose version
echo.

REM Ask for environment
echo Select environment:
echo 1) Development (with hot-reload)
echo 2) Production
set /p env_choice="Enter choice [1-2]: "

if "%env_choice%"=="2" (
    set COMPOSE_FILE=docker-compose.prod.yml
    set ENV_FILE=.env.production
    set ENV_SAMPLE=.env.production.sample
    echo Production mode selected
) else (
    set COMPOSE_FILE=docker-compose.yml
    set ENV_FILE=.env
    set ENV_SAMPLE=.env.sample
    echo Development mode selected
)

echo.

REM Check if .env exists
if not exist "%ENV_FILE%" (
    echo WARNING: Environment file not found!
    if exist "%ENV_SAMPLE%" (
        echo Creating %ENV_FILE% from %ENV_SAMPLE%...
        copy "%ENV_SAMPLE%" "%ENV_FILE%"
        echo Created %ENV_FILE%
        echo.
        echo IMPORTANT: Please edit %ENV_FILE% with your settings!
        echo Required changes:
        echo   - MONGO_ROOT_PASSWORD ^(change from default^)
        echo   - JWT_SECRET ^(use strong random string^)
        echo   - OPENAI_API_KEY ^(if using AI features^)
        echo.
        pause
    ) else (
        echo ERROR: %ENV_SAMPLE% not found!
        pause
        exit /b 1
    )
)

echo.
echo Building Docker images...
docker compose -f %COMPOSE_FILE% build

echo.
echo Starting services...
docker compose -f %COMPOSE_FILE% up -d

echo.
echo Waiting for services to be ready...
timeout /t 5 /nobreak >nul

echo.
echo Service Status:
docker compose -f %COMPOSE_FILE% ps

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.

if "%env_choice%"=="2" (
    echo Frontend: http://localhost
    echo Backend API: http://localhost:3000/api/health
) else (
    echo Frontend: http://localhost:5173
    echo Backend API: http://localhost:3000/api/health
)

echo MongoDB: localhost:27017
echo.
echo Useful commands:
echo   View logs:       docker compose -f %COMPOSE_FILE% logs -f
echo   Stop services:   docker compose -f %COMPOSE_FILE% down
echo   Restart:         docker compose -f %COMPOSE_FILE% restart
echo.
echo For more information, see:
echo   - DEPLOYMENT.md
echo   - DOCKER_GUIDE.md
echo   - DOCKER_CICD_README.md
echo.
echo Happy coding!
echo.
pause
