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

Proceed to **Lab 5: Advanced UI Patterns** to add sophisticated UI features using spec-driven development.

## Resources

- [Spec-Kit Quickstart Guide](https://github.github.io/spec-kit/quickstart.html)
- [Spec-Kit Documentation](https://github.com/github/spec-kit)
- [Docker Documentation](https://docs.docker.com/)
- [ASP.NET Core Docker](https://learn.microsoft.com/aspnet/core/host-and-deploy/docker)
