FROM maven:3.9.9-eclipse-temurin-21 AS builder

# Declare build arguments for GitHub credentials
ARG GITHUB_USERNAME
ARG GITHUB_TOKEN

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

RUN mvn -B -DskipTests clean package -pl auth-service -am

FROM eclipse-temurin:21-jre-jammy AS runner

WORKDIR /app

COPY --from=builder /app/auth-service/target/*.jar ./app.jar

EXPOSE 4000

ENTRYPOINT ["java", "-jar", "app.jar"]