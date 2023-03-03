import {Constants} from "../values.js"

export function consoleLogging(message, severity) {
    if (!Constants.validLogSeverities.includes(severity)) {
        console.error("Invalid Severity! Message follows as a log");
        console.log(`Nickles Shop Generator | ${message}`);
    } else if (severity === "info") {
        console.info(`Nickles Shop Generator | ${message}`);
    } else if (severity === "log") {
        console.log(`Nickles Shop Generator | ${message}`);
    } else if (severity === "warn") {
        console.warn(`Nickles Shop Generator | ${message}`);
    } else if (severity === "error") {
        console.error(`Nickles Shop Generator | ${message}`);
    }
}

export function uiLogging(message, severity) {
    if (!Constants.validLogSeverities.includes(severity)) {
        ui.notifications.log(`Nickles Shop Generator | ${message}`);
    } else if (severity === "info") {
        ui.notifications.info(`Nickles Shop Generator | ${message}`);
    } else if (severity === "log") {
        ui.notifications.log(`Nickles Shop Generator | ${message}`);
    } else if (severity === "warn") {
        ui.notifications.warn(`Nickles Shop Generator | ${message}`);
    } else if (severity === "error") {
        ui.notifications.error(`Nickles Shop Generator | ${message}`);
    }
}