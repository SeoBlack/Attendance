# Prerequisites:
- Java 17 (or the version used by your project)
- Maven
- A local database compatible with `schema.sql`
- Docker (optional, for running PostgreSQL locally)


# 0. Run database

Replace PATH_TO_DATA_DIR with ./data to have same behaviour as was before introduction of dynamic data dir.<br/>
Otherwise provide a path on your machine where Postgres data should be persisted
```shell
PG_LOCAL_DATA=PATH_TO_DATA_DIR docker compose -f compose.yaml up -d
```
Then initialize it using `src/main/resources/schema.sql`.

# 1. Run app

Configure your database connection and app port in `src/main/resources/application.properties`.<br/>
Make sure `src/main/resources/application.properties` matches the DB name, user, and password in `compose.yaml`.<br/>
Then run the app
```shell
mvn spring-boot:run
```