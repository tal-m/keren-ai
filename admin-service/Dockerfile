# Multi-stage Dockerfile for the keren-ai Spring Boot application
# Build stage: use Maven with Temurin 21 to build the fat JAR
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml .

# Copy the auth-common module (The dependency)
COPY auth-common/pom.xml auth-common/
COPY auth-common/src auth-common/src

# Copy the admin-service module (The app)
COPY admin-service/pom.xml admin-service/
COPY admin-service/src admin-service/src

# Copy Auth Service (Maven needs to see it to start)
COPY auth-service/pom.xml auth-service/
COPY auth-service/src auth-service/src

RUN mvn -B -DskipTests clean package

# Runtime stage: use a small JRE image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built Java application JAR from the 'builder' stage
ARG JAR_FILE=/app/admin-service/target/*.jar
COPY --from=builder ${JAR_FILE} ./app.jar

# Expose application port (adjust if needed)
EXPOSE 4000

# Allow overriding JVM options at runtime
ENV JAVA_OPTS="-Xms128m -Xmx512m"

# Run the application (includes the spring shell system properties from your reference)
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dspring.shell.interactive.enabled=true -Dspring.shell.interactive.force=true -jar /app/app.jar"]
