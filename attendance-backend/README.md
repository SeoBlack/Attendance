# Prerequisites:
- Java 17 (or the version used by your project)
- Maven
- A local database compatible with `schema.sql`
- Docker (optional, for running PostgreSQL locally)


# 1. Run app

Configure your database connection and app port in `src/main/resources/application.properties`.<br/>
Make sure `src/main/resources/application.properties` matches the DB name, user, and password in `compose.yaml`.<br/>
Then run the app
```shell
mvn spring-boot:run
```