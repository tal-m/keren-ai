FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml pom.xml

RUN mvn -f pom.xml dependency:go-offline -B

COPY src src

RUN mvn -f pom.xml -B clean package

FROM eclipse-temurin:21-jdk AS runner

WORKDIR /app

# Install curl for container healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/*.jar ./app.jar

EXPOSE 4002

ENTRYPOINT ["java", "-jar", "app.jar"]