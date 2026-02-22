# 0. Run database

```shell
PG_LOCAL_DATA=PATH_TO_DATA_DIR docker compose up # replace PATH_TO_DATA_DIR with ./data to have same behaviour as was before introduction of dynamic data dir
```
# 1. Run app
```shell
mvn spring-boot:run
```