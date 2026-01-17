import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configure Echo
declare global {
    interface Window {
        Pusher: any;
        Echo: any;
    }
}

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
});
