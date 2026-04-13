# Use OpenJDK 17 as base image
#FROM eclipse-temurin:17
FROM maven:3.9-eclipse-temurin-17

# Set working directory
WORKDIR /app

# Copy the pom.xml file to the container
COPY pom.xml /app/

# Copy the JAR file from target directory
COPY . /app

# Expose the port your Spring Boot app runs on (usually 8080)
EXPOSE 8081

# Package your application
RUN mvn package

# Run the main class (assuming your application has a main class)
CMD ["java", "-jar", "target/attendance-backend.jar"]