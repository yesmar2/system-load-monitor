const checkNotificationThreshold = require("../utils/checkNotificationThreshold.js");

test("high load alert occurs above 70% utilization 2 minute average", () => {
    const cpuHistory2 = [
        { cpu: 90, timestamp: 1525179479171 },
        { cpu: 90, timestamp: 1525179489254 },
        { cpu: 90, timestamp: 1525179499249 },
        { cpu: 90, timestamp: 1525179509249 },
        { cpu: 90, timestamp: 1525179519249 },
        { cpu: 90, timestamp: 1525179529249 },
        { cpu: 90, timestamp: 1525179539249 },
        { cpu: 90, timestamp: 1525179549249 },
        { cpu: 90, timestamp: 1525179559249 },
        { cpu: 90, timestamp: 1525179569249 },
        { cpu: 90, timestamp: 1525179579249 },
        { cpu: 90, timestamp: 1525179589249 },
        { cpu: 90, timestamp: 1525179599249 }
    ];

    const lastNotification = null;

    const threshold = 70;

    const notification = checkNotificationThreshold(
        cpuHistory2,
        lastNotification,
        threshold
    );

    const expectedNotification = {
        cpu: 90,
        isThresholdAlert: true,
        timestamp: 1525179599249
    };

    expect(notification).toEqual(expectedNotification);
});

test("high load alert does not occur if previous alert was high load alert", () => {
    const cpuHistory2 = [
        { cpu: 90, timestamp: 1525179479171 },
        { cpu: 90, timestamp: 1525179489254 },
        { cpu: 90, timestamp: 1525179499249 },
        { cpu: 90, timestamp: 1525179509249 },
        { cpu: 90, timestamp: 1525179519249 },
        { cpu: 90, timestamp: 1525179529249 },
        { cpu: 90, timestamp: 1525179539249 },
        { cpu: 90, timestamp: 1525179549249 },
        { cpu: 90, timestamp: 1525179559249 },
        { cpu: 90, timestamp: 1525179569249 },
        { cpu: 90, timestamp: 1525179579249 },
        { cpu: 90, timestamp: 1525179589249 },
        { cpu: 90, timestamp: 1525179599249 }
    ];

    const lastNotification = {
        cpu: 90,
        isThresholdAlert: true,
        timestamp: 1525179599249
    };

    const threshold = 70;

    const notification = checkNotificationThreshold(
        cpuHistory2,
        lastNotification,
        threshold
    );

    expect(notification).toEqual(null);
});

test("recovered alert occurs when previous alert was high alert", () => {
    const cpuHistory2 = [
        { cpu: 40, timestamp: 1525179479171 },
        { cpu: 40, timestamp: 1525179489254 },
        { cpu: 40, timestamp: 1525179499249 },
        { cpu: 40, timestamp: 1525179509249 },
        { cpu: 40, timestamp: 1525179519249 },
        { cpu: 40, timestamp: 1525179529249 },
        { cpu: 40, timestamp: 1525179539249 },
        { cpu: 40, timestamp: 1525179549249 },
        { cpu: 40, timestamp: 1525179559249 },
        { cpu: 40, timestamp: 1525179569249 },
        { cpu: 40, timestamp: 1525179579249 },
        { cpu: 40, timestamp: 1525179589249 },
        { cpu: 40, timestamp: 1525179599249 }
    ];

    const lastNotification = {
        cpu: 90,
        isThresholdAlert: true,
        timestamp: 1525179589249
    };

    const threshold = 70;

    const notification = checkNotificationThreshold(
        cpuHistory2,
        lastNotification,
        threshold
    );

    const expectedNotification = {
        cpu: 40,
        isThresholdAlert: false,
        timestamp: 1525179599249
    };

    expect(notification).toEqual(expectedNotification);
});
