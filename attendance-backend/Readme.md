## Backend Setup and Run

Prerequisites:
- Java 17 (or the version used by your project)
- Maven
- A local database compatible with `schema.sql`
- Docker (optional, for running PostgreSQL locally)

Steps:
1. From the repo root, go to `attendance-backend`.
2. Configure your database connection in `src/main/resources/application.properties`.
3. Initialize the database using `src/main/resources/schema.sql`.
4. Run the app:
   - `mvn spring-boot:run`

Notes:
- The server runs on the port configured in `application.properties`.

## Docker (Compose)

Use the existing compose file for the database:
1. From `attendance-backend`, run:
   - `docker compose -f compose.yaml up -d`
2. Ensure `src/main/resources/application.properties` matches the DB name, user, and password in `compose.yaml`.

Stop containers when done:
- `docker compose -f compose.yaml down`
