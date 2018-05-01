const checkNotificationThreshold = (
    cpuHistory2,
    lastNotification,
    threshold
) => {
    let notification = null;

    sum = cpuHistory2.reduce((a, b) => {
        return a + parseInt(b.cpu);
    }, 0);

    avg = sum / cpuHistory2.length;

    const isThresholdAlert = avg > threshold;

    // Emit notification only if it's an alert or recovery
    if (
        (isThresholdAlert &&
            (!lastNotification ||
                (!!lastNotification && !lastNotification.isThresholdAlert))) ||
        (!isThresholdAlert &&
            !!lastNotification &&
            lastNotification.isThresholdAlert)
    ) {
        notification = {
            cpu: avg,
            isThresholdAlert: isThresholdAlert,
            timestamp: cpuHistory2[cpuHistory2.length - 1].timestamp
        };
    }
    return notification;
};

module.exports = checkNotificationThreshold;
