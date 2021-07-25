# Orda Logger
---------
Orda Logger is a very tiny logger written in TypeScript, which is used in [Orda-js](https://github.com/orda-io/orda-js)
project. The size of Orda-logger is about 4KB.

## Install

```shell
$ npm i @orda-io/orda-logger
```

## Features

You can use orda-logger as follows:

```typescript
const logFactory = new OrdaLoggerFactory("trace");
const logger = logFactory.getLogger("test logging");
logger.trace("trace message");
logger.debug("debug message");
const num = 1234;
logger.info(`info message:${num}`);
logger.warn("warn message");
try {
  generate_error();
} catch (e) {
  logger.error("error message", e);
}
logger.log("log withPos back");
```

- For nodejs, logging messages accompany by the file positions and the tags.

![image](https://user-images.githubusercontent.com/3905310/126910254-c4c1b4cb-e315-4b6f-836e-6316a6dae267.png)

- In the chrome console, logging messages accompany only by the tags.

![image](https://user-images.githubusercontent.com/3905310/126910265-1d7666e4-e9bb-4055-9d74-0567eccfe9f7.png)
