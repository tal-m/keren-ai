# Multi-stage Dockerfile for the keren-ai Spring Boot application
# Build stage: use Maven with Temurin 21 to build the fat JAR
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Download dependencies ahead of copying sources to improve layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build
COPY src ./src
RUN mvn -B -DskipTests clean package

# Runtime stage: use a small JRE image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built Java application JAR from the 'builder' stage
ARG JAR_FILE=/app/target/*.jar
COPY --from=builder ${JAR_FILE} ./app.jar

# Expose application port (adjust if needed)
EXPOSE 4000

# Allow overriding JVM options at runtime
ENV JAVA_OPTS="-Xms128m -Xmx512m"

# Run the application (includes the spring shell system properties from your reference)
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dspring.shell.interactive.enabled=true -Dspring.shell.interactive.force=true -jar /app/app.jar"]
