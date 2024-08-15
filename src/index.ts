import CustomClient from "./base/classes/CustomClient";

new CustomClient().Init();

process.on("unhandledRejection", async (reason, promise) => {
    console.log("Unhandled Rejection at :", promise, "reason :", reason);
});

process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception :", error);
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
    console.log("Uncaught Exception (Monitor) :", error, origin);
});
