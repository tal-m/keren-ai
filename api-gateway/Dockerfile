FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .

COPY api-gateway/pom.xml api-gateway/

RUN mvn -f api-gateway/pom.xml dependency:go-offline -B

COPY api-gateway/src api-gateway/src

RUN mvn -f api-gateway/pom.xml clean package

FROM eclipse-temurin:21-jdk AS runner

WORKDIR /app

COPY --from=builder /app/api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar ./app.jar

EXPOSE 4002

ENTRYPOINT ["java", "-jar", "app.jar"]