const parallelShutdownActions = [];

function beforeShutdown(actionBeforeShutdown) {
  parallelShutdownActions.push(actionBeforeShutdown);
}

async function exitHandler(exitCode, event) {
  console.log(`handling event : "${event}"`);

  const promises = parallelShutdownActions.map((action) =>
    (async () => await action())()
  );
  await Promise.all(promises).then(() => originalExit(exitCode));
  setTimeout(() => {
    console.log("Failed to close gracefully. Exit handlers timed out.");
    console.log("Original Exit Code was " + exitCode);
    originalExit(1);
  }, 2000);
}

const originalExit = process.exit;
process.exit = (exitCode) => exitHandler(exitCode, "exit");
process.on("beforeExit", (exitCode) => exitHandler(exitCode, "beforeExit"));
process.on("uncaughtException", async (err, type) => {
  if (type === "uncaughtException") {
    console.log(`Uncaught Exception: ${err.stack ? err.stack : err}`);
    await exitHandler(1, "uncaughtException");
  } else if (type === "unhandledRejection") {
    console.log(`Unhandled Rejection: ${err.stack ? err.stack : err}`);
  }
});

module.exports = beforeShutdown;
