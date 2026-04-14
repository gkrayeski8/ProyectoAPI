# Etapa 1: Build (Construcción del JAR con Maven)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos el pom.xml y descargamos dependencias (optimiza la cache de Docker)
COPY pom.xml .
# Hacemos descargar dependencias de manera offline para agilizar futuras builds (opcional)
RUN mvn dependency:go-offline -B

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Run (Ejecución del JAR en una imagen ligera)
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copiamos solo el JAR compilado de la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto de la aplicación (8080 por defecto en Spring Boot)
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
