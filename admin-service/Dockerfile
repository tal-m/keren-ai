# Multi-stage Dockerfile for the keren-ai Spring Boot application
# Build stage: use Maven with Temurin 21 to build the fat JAR
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy only this service's POM first (for better layer caching)
COPY pom.xml pom.xml

# Download dependencies
RUN mvn -f pom.xml -B dependency:go-offline -U

# Copy sources and build
COPY src src
RUN mvn -f pom.xml -B -DskipTests clean package -U

# Runtime stage: use a small JRE image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Install curl for container healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy the built Java application JAR from the 'builder' stage
COPY --from=builder /app/target/*.jar ./app.jar

# Expose application port (adjust if needed)
EXPOSE 4000

# Allow overriding JVM options at runtime
ENV JAVA_OPTS="-Xms128m -Xmx512m"

# Run the application (includes the spring shell system properties from your reference)
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dspring.shell.interactive.enabled=true -Dspring.shell.interactive.force=true -jar /app/app.jar"]
