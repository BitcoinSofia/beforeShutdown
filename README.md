# beforeShutdown

Used to trigger an async action before the shutdown of a process, via 'exit', 'beforeExit' or 'uncaughtException'.
The main purpose is to cleanup resources used by test automation or any app that spanws processes.
