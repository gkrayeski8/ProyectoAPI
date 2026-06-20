# ── Stage 1: Build ──────────────────────────────────────────────────────────────
FROM maven:3.8.5-openjdk-17-slim AS build

WORKDIR /app

# Copiar descriptor de dependencias primero (mejor cache de layers)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y compilar
COPY src/ src/
RUN mvn package -DskipTests -B

# ── Stage 2: Run ────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar solo el JAR generado en el stage anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
