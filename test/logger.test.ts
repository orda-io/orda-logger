import { OrdaLoggerFactory } from "../src";

function generate_error(): Error {
  throw new Error("generated error");
}

describe("Test Orda Logger", () => {
  it("Can log with console logger", () => {
    const num = 1234;

    console.trace("trace message");
    console.debug("debug message");
    console.info(`log message:${num}`);
    console.warn("warn message");
    try {
      generate_error();
    } catch (e) {
      console.error("error message", e);
    }
    console.log("log withPos back");
  });

  it("Can log with Orda Logger", () => {
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
  });

});
