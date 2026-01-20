FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy only this service's POM first (for better layer caching)
COPY pom.xml pom.xml

# Download dependencies
RUN mvn -f pom.xml -B dependency:go-offline -U

# Copy sources and build
COPY src src
RUN mvn -f pom.xml -B -DskipTests clean package -U

FROM eclipse-temurin:21-jre-jammy AS runner

WORKDIR /app

# Install curl for container healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/*.jar ./app.jar

EXPOSE 4001

ENTRYPOINT ["java", "-jar", "app.jar"]