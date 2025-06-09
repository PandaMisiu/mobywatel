# Production Deployment Guide

This guide explains how to deploy the Mobywatel application in production using Docker Compose.

## Production Setup

### Files Overview

- `docker-compose.prod.yml` - Production Docker Compose configuration
- `Dockerfile.prod` - Production Spring Boot Docker image
- `nginx.prod.conf` - Production nginx configuration for load balancing
- `mobywatel-web/Dockerfile.prod` - Production frontend Docker image
- `mobywatel-web/nginx.prod.conf` - Frontend nginx configuration
- `src/main/resources/application-prod.properties` - Production backend configuration

### Key Production Features

#### Frontend (React)

- **Multi-stage Docker build** for optimized image size
- **Static file serving** with nginx for better performance
- **Gzip compression** enabled for faster loading
- **Browser caching** for static assets (1 year expiry)
- **Security headers** (X-Frame-Options, X-Content-Type-Options, etc.)
- **Health check endpoint** at `/health`
- **SPA routing support** with fallback to index.html

#### Backend (Spring Boot)

- **Production-optimized** database connection pooling
- **Validation-only** Hibernate DDL mode (no auto-creation)
- **Performance tuning** for Tomcat server
- **Health check** endpoint via Spring Actuator
- **Proper logging** configuration for production

#### Nginx Load Balancer

- **Rate limiting** to prevent abuse (10 req/s for API, 5 req/m for login)
- **Security headers** for enhanced security
- **Gzip compression** for API responses
- **Health checks** for all services
- **SSL/HTTPS ready** (commented configuration included)

### Deployment Steps

1. **Build and start the production environment:**

   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

2. **Check service status:**

   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

3. **View logs:**

   ```bash
   # All services
   docker-compose -f docker-compose.prod.yml logs -f

   # Specific service
   docker-compose -f docker-compose.prod.yml logs -f frontend
   ```

4. **Stop the production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

### Health Checks

- **Application:** http://localhost/health
- **Backend API:** http://localhost/api/actuator/health
- **Frontend:** http://localhost/ (should load the React app)

### SSL/HTTPS Setup (Optional)

To enable HTTPS:

1. Obtain SSL certificates and place them in an `ssl/` directory:

   - `ssl/cert.pem` - Certificate file
   - `ssl/private.key` - Private key file

2. Uncomment the SSL volume mounts in `docker-compose.prod.yml`:

   ```yaml
   volumes:
     - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
     - ./ssl/cert.pem:/etc/nginx/ssl/cert.pem:ro
     - ./ssl/private.key:/etc/nginx/ssl/private.key:ro
   ```

3. Uncomment the HTTPS server block in `nginx.prod.conf`

4. Update the ports mapping to include 443:
   ```yaml
   ports:
     - "80:80"
     - "443:443"
   ```

### Environment Variables

You can override configuration through environment variables in the Docker Compose file:

```yaml
environment:
  - SPRING_PROFILES_ACTIVE=prod
  - JAVA_OPTS=-Xmx2g -Xms1g
  - DATABASE_URL=your_production_database_url
```

### Monitoring

The setup includes:

- **Health checks** for all containers
- **Prometheus metrics** endpoint (if needed)
- **Structured logging** for better monitoring integration

### Security Considerations

1. **Change default passwords** in production
2. **Use environment variables** for sensitive data
3. **Enable SSL/HTTPS** for production deployment
4. **Configure firewall** to restrict access
5. **Regular security updates** for base images
6. **Monitor logs** for suspicious activity

### Scaling

To scale the frontend or backend:

```bash
docker-compose -f docker-compose.prod.yml up --scale frontend=3 --scale springboot-app=2 -d
```

Note: You'll need to update the nginx upstream configuration for proper load balancing across multiple instances.

### Troubleshooting

1. **Container not starting:** Check logs with `docker-compose logs [service-name]`
2. **Database connection issues:** Verify wallet files and connection string
3. **Frontend not loading:** Check nginx configuration and frontend build
4. **API not responding:** Verify backend health and nginx routing

### Development vs Production

| Feature         | Development              | Production                   |
| --------------- | ------------------------ | ---------------------------- |
| Frontend        | Vite dev server with HMR | Static files served by nginx |
| Database DDL    | create                   | validate                     |
| Logging         | DEBUG level              | INFO/WARN level              |
| Connection Pool | Small (5 max)            | Large (20 max)               |
| Caching         | Disabled                 | Enabled                      |
| Health Checks   | None                     | Enabled                      |
| Rate Limiting   | None                     | Enabled                      |
