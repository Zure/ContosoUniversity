# Lab 4: Dockerization (Optional)

## Overview

Use Spec-Kit and GitHub Copilot to containerize the Contoso University application, making it easy to deploy and run consistently across different environments. This lab focuses on using the spec-kit process to define, plan, and implement Docker containerization.

## Learning Objectives

- Apply Spec-Kit methodology to infrastructure tasks
- Let Copilot generate Dockerfiles from specifications
- Use spec-driven approach for container orchestration
- Learn to specify non-functional requirements (performance, security)
- Validate containerization against success criteria

## Prerequisites

- Docker Desktop installed (or Podman on Mac)
- Completed Lab 1 (spec-kit basics)
- GitHub Copilot enabled in your IDE
- Basic Docker concepts helpful but not required

## Duration

Approximately 60-90 minutes

---

## Part 1: Create the Specification

### Step 1: Start with Spec-Kit

Create your containerization specification:

```bash
/speckit.specify Dockerize the Contoso University application for consistent deployment across environments. Include multi-stage builds for optimization, docker-compose for orchestration with SQL Server, persistent volumes for data, health checks, and one-command startup.
```

Review the generated spec in `specs/004-**/spec.md`. It should include:

- Problem statement (why containerize)
- Technical requirements (multi-stage builds, compose, volumes)
- Success criteria (runs in container, data persists, etc.)

### Step 2: Plan the Implementation

```bash
/speckit.plan Create a detailed plan for Dockerization including: Dockerfile creation with multi-stage build, docker-compose configuration for app and SQL Server, volume management, networking setup, and health check implementation.
```

Review `specs/004-**/plan.md`. It should break down:

- Phase 1: Dockerfile for ASP.NET app
- Phase 2: docker-compose orchestration
- Phase 3: Configuration and optimization
- Phase 4: Testing and validation

### Step 3: Generate Tasks

```bash
/speckit.tasks
```

This creates a checklist in `specs/004-**/tasks.md` with actionable items.

---

## Part 2: Implement with Copilot

### Step 1: Start Implementation

```bash
/speckit.implement
```

Copilot will create:

- Multi-stage Dockerfile optimized for .NET
- docker-compose.yml with app and SQL Server
- .dockerignore file
- Volume configurations
- Health check setups
- Environment variable management

### Step 2: Guide the Implementation

As Copilot works, provide specific guidance:

```
Ensure the Dockerfile uses non-root user for security. Add health check endpoint to the ASP.NET app at /health.
```

Or:

```
Configure docker-compose so the webapp waits for SQL Server to be healthy before starting. Use appropriate restart policies.
```

---

## Part 3: Testing and Validation

### Step 1: Build and Run

```bash
# Build the images
docker-compose build

# Start the containers
docker-compose up -d

# Check container status
docker-compose ps
```

### Step 2: Verify Against Success Criteria

Test each criterion from your spec:

- [ ] Application runs in Docker container (check logs: `docker-compose logs webapp`)
- [ ] SQL Server runs in separate container (`docker-compose ps`)
- [ ] Containers communicate (`docker-compose exec webapp ping sqlserver`)
- [ ] Database persists data (stop/start containers, verify data remains)
- [ ] Application accessible from host (browse to `http://localhost:8080`)
- [ ] One-command startup works (`docker-compose up`)

### Step 3: Run Database Migrations

```bash
# Execute migrations in the running container
docker-compose exec webapp dotnet ef database update

# Or create an init script as specified in your plan
```

---

## Part 4: Optimization and Production Readiness

### Step 1: Add Production Configuration

Ask Copilot to enhance based on your spec:

```
Create a docker-compose.prod.yml override file with production optimizations: remove development-only settings, add restart policies, configure logging, set resource limits.
```

### Step 2: Add CI/CD Integration

```bash
/speckit.clarify Create a GitHub Actions workflow to build and push Docker images to GitHub Container Registry when code is pushed to main.
```

Copilot will generate `.github/workflows/docker-build.yml` based on the specification.

---

## Key Takeaways

1. **Spec-First Containerization**: Define requirements before implementation
2. **AI Implements Details**: Copilot handles Dockerfile syntax, compose config
3. **Validation-Driven**: Test against success criteria systematically
4. **Iterative Refinement**: Use `/speckit.clarify` to enhance as needed

## Challenge Extensions

Create new specs for:

1. **Multi-Stage Optimization**: Further reduce image size
2. **Kubernetes Deployment**: Convert docker-compose to K8s manifests
3. **Monitoring**: Add Prometheus and Grafana containers
4. **Redis Caching**: Integrate Redis for distributed caching

For each, use the full spec-kit process!

## Troubleshooting

Ask Copilot with context:

```
The webapp container exits immediately with error. Check the logs at docker-compose logs webapp and help me debug based on our spec in specs/004-**/spec.md.
```

## Next Steps

Proceed to **Lab 5: UI Enhancement** to modernize the application's design using spec-driven development.

## Resources

- [Spec-Kit Documentation](https://github.com/github/spec-kit)
- [Docker Documentation](https://docs.docker.com/)
- [ASP.NET Core Docker](https://learn.microsoft.com/aspnet/core/host-and-deploy/docker)

Expected result (Copilot should provide something like):

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["ContosoUniversity/ContosoUniversity.csproj", "ContosoUniversity/"]
RUN dotnet restore "ContosoUniversity/ContosoUniversity.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/ContosoUniversity"
RUN dotnet build "ContosoUniversity.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ContosoUniversity.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ContosoUniversity.dll"]
```

---

## Part 2: Docker Compose Configuration

### Step 1: Create docker-compose.yml

In the repository root, create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: contoso-sqlserver
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=YourStrong@Passw0rd123
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql
    healthcheck:
      test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd123" -Q "SELECT 1" || exit 1
      interval: 10s
      timeout: 3s
      retries: 10
      start_period: 10s
    networks:
      - contoso-network

  webapp:
    build:
      context: .
      dockerfile: ContosoUniversity/Dockerfile
    container_name: contoso-webapp
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:80
      - ConnectionStrings__SchoolContext=Server=sqlserver;Database=ContosoUniversity;User Id=sa;Password=YourStrong@Passw0rd123;TrustServerCertificate=True;MultipleActiveResultSets=true
    ports:
      - "8080:80"
    depends_on:
      sqlserver:
        condition: service_healthy
    networks:
      - contoso-network

networks:
  contoso-network:
    driver: bridge

volumes:
  sqlserver-data:
```

### Step 2: Create .dockerignore

In repository root, create `.dockerignore`:

```
# Ignore build artifacts
**/bin/
**/obj/
**/out/

# Ignore IDE files
**/.vs/
**/.vscode/
**/.idea/
**/*.user
**/*.suo

# Ignore OS files
.DS_Store
Thumbs.db

# Ignore git
.git/
.gitignore
.gitattributes

# Ignore documentation
*.md
LICENSE

# Ignore Docker files
**/Dockerfile
**/docker-compose*.yml
**/.dockerignore

# Ignore node modules if React app
**/node_modules/
**/dist/
```

---

## Part 3: Building and Running

### Step 1: Build the Images

```bash
# From repository root
docker-compose build
```

This builds the ASP.NET Core application image.

### Step 2: Start the Application

```bash
docker-compose up -d
```

This starts both containers in detached mode.

### Step 3: Check Container Status

```bash
docker-compose ps
```

Expected output:

```
NAME                  IMAGE                                        STATUS
contoso-sqlserver     mcr.microsoft.com/mssql/server:2022-latest  Up 30 seconds (healthy)
contoso-webapp        contoso-university-webapp                    Up 15 seconds
```

### Step 4: View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs webapp
docker-compose logs sqlserver
```

### Step 5: Run Database Migrations

```bash
# Execute migrations in the running container
docker-compose exec webapp dotnet ef database update
```

Or create a migration initialization script:

Create `scripts/init-db.sh`:

```bash
#!/bin/bash
echo "Waiting for SQL Server to be ready..."
sleep 10

echo "Running database migrations..."
docker-compose exec -T webapp dotnet ef database update

echo "Database initialized successfully!"
```

Make it executable and run:

```bash
chmod +x scripts/init-db.sh
./scripts/init-db.sh
```

### Step 6: Access the Application

Open browser to `http://localhost:8080`

---

## Part 4: Production Optimizations

### Step 1: Multi-Environment Configuration

Create `docker-compose.prod.yml`:

```yaml
version: "3.8"

services:
  webapp:
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=https://+:443;http://+:80
      - ASPNETCORE_Kestrel__Certificates__Default__Password=YourCertPassword
      - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./certs:/https:ro
    restart: unless-stopped

  sqlserver:
    restart: unless-stopped
```

Run with production config:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Step 2: Optimize Dockerfile

Add caching layers for better build performance:

```dockerfile
# Build stage with layer caching
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy and restore in separate layer for better caching
COPY ["ContosoUniversity/ContosoUniversity.csproj", "ContosoUniversity/"]
RUN dotnet restore "ContosoUniversity/ContosoUniversity.csproj"

# Copy source code
COPY ["ContosoUniversity/", "ContosoUniversity/"]
WORKDIR "/src/ContosoUniversity"

# Build with ReadyToRun for better startup performance
RUN dotnet publish "ContosoUniversity.csproj" \
    -c Release \
    -o /app/publish \
    -p:PublishReadyToRun=true \
    -p:PublishSingleFile=false \
    -p:PublishTrimmed=false \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Security: non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

COPY --from=build /app/publish .

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

ENTRYPOINT ["dotnet", "ContosoUniversity.dll"]
```

### Step 3: Add Health Check Endpoint

In `Program.cs`, add:

```csharp
app.MapHealthChecks("/health");
```

Requires package:

```xml
<PackageReference Include="Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore" Version="8.0.0" />
```

---

## Part 5: Container Management

### Common Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Stop and remove volumes (deletes data!)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# View resource usage
docker stats

# Execute command in container
docker-compose exec webapp bash

# Copy files from container
docker cp contoso-webapp:/app/logs ./logs
```

**Note:** If using Podman, replace `docker` with `podman` and `docker-compose` with `podman-compose`.

### Debugging in Containers

Ask GitHub Copilot to help with debugging:

```
I need to debug my containerized application. Help me with commands to:
1. Access the running container shell
2. Check environment variables
3. View application logs
4. Test network connectivity between containers
```

Common debugging commands:

```bash
# Attach to running container
docker-compose exec webapp bash

# Check environment variables
docker-compose exec webapp env

# View app logs
docker-compose logs -f webapp

# Test network connectivity
docker-compose exec webapp ping sqlserver
```

---

## Part 6: CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/docker-build.yml`:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./ContosoUniversity/Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          tags: ghcr.io/${{ github.repository }}/contoso-university:latest
          cache-from: type=registry,ref=ghcr.io/${{ github.repository }}/contoso-university:buildcache
          cache-to: type=registry,ref=ghcr.io/${{ github.repository }}/contoso-university:buildcache,mode=max
```

---

## Best Practices Checklist

- [ ] Multi-stage build to minimize image size
- [ ] .dockerignore to exclude unnecessary files
- [ ] Non-root user for security
- [ ] Health checks for reliability
- [ ] Named volumes for data persistence
- [ ] Environment-specific configurations
- [ ] Proper logging configuration
- [ ] Resource limits (optional)

### Add Resource Limits

In `docker-compose.yml`:

```yaml
services:
  webapp:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

---

## Key Takeaways

1. **Consistency**: Containers ensure identical environments across dev/staging/production
2. **Isolation**: Each service runs independently
3. **Portability**: Run anywhere Docker is available
4. **Scalability**: Easy to scale horizontally
5. **CI/CD Ready**: Perfect for automated deployments

## Challenge Extensions

1. **Add React Frontend**: Dockerize the React app from Lab 2 and add to docker-compose
2. **NGINX Reverse Proxy**: Add NGINX as reverse proxy in front of the app
3. **Redis Caching**: Add Redis container for distributed caching
4. **Monitoring**: Add Prometheus and Grafana containers for monitoring
5. **Kubernetes**: Convert docker-compose to Kubernetes manifests

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs webapp

# Check if port is already in use
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows
```

### Database Connection Fails

- Ensure SQL Server health check passes: `docker-compose ps`
- Verify connection string uses service name `sqlserver`, not `localhost`
- Check network: `docker-compose exec webapp ping sqlserver`

### Permission Errors

If running as non-root user causes issues:

```dockerfile
# Temporarily remove USER directive to debug
# USER appuser
```

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [ASP.NET Core Docker Documentation](https://learn.microsoft.com/aspnet/core/host-and-deploy/docker)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

Return to main labs or continue to **Lab 5: UI Enhancement** to modernize the application's appearance.
