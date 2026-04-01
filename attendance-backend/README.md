# Prerequisites:
- Java 17 (or the version used by your project)
- Maven
- A local database compatible with `schema.sql`
- Docker (optional, for running PostgreSQL locally)


# Database note (placeholder students)

Users created by teacher enrollment may have `password_hash` set to NULL until the student completes signup. With `spring.jpa.hibernate.ddl-auto=update`, Hibernate keeps that column nullable. If you have an older database where `password_hash` was created as `NOT NULL`, run:

```sql
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

# 1. Run app

Configure your database connection and app port in `src/main/resources/application.properties`.<br/>
Make sure `src/main/resources/application.properties` matches the DB name, user, and password in `compose.yaml`.<br/>
Then run the app
```shell
mvn spring-boot:run
```