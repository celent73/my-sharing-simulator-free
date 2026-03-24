export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return false;
    }

    if (Notification.permission === 'granted') return true;

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const sendLocalNotification = async (title: string, body: string) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        // Try to send via Service Worker if available for better mobile support
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title, {
                body,
                icon: '/logo_v2_main.png',
                vibrate: [200, 100, 200],
                badge: '/logo_v2_main.png',
                tag: 'habit-reminder',
                renotify: true
            } as any);
        } else {
            // Fallback to simple Notification
            new Notification(title, { body, icon: '/logo_v2_main.png' });
        }
    }
};
