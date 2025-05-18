FROM eclipse-temurin:21-alpine

RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

RUN mkdir -p /app/wallet

COPY target/*.jar app.jar

RUN chown -R spring:spring /app

USER spring:spring

ENTRYPOINT ["java", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Doracle.net.wallet_location=/app/wallet", \
    "-Doracle.net.tns_admin=/app/wallet", \
    "-jar", \
    "app.jar"]

EXPOSE 8080