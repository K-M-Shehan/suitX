# Multi-stage build for optimized production image
# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Set Maven options to reduce memory usage and speed up build
ENV MAVEN_OPTS="-Xmx1024m -Xms512m -XX:+UseSerialGC"

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
# Use fewer threads to reduce memory usage
RUN mvn clean package -DskipTests -T 1C

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-jammy

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Set Java options for production
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
