import { ref } from 'vue';
import Swal from 'sweetalert2';

const notifications = ref([]);

export function useNotifications() {
  const showInAppNotification = (title, text, icon = 'info') => {
    Swal.fire({
      title,
      text,
      icon,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  };

  const playSoundNotification = () => {
    const audio = new Audio('/notification.mp3');
    audio.play();
  };

  const sendPushNotification = (title, options = {}) => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options);
        }
      });
    }
  };

  return {
    notifications,
    showInAppNotification,
    playSoundNotification,
    sendPushNotification
  };
} 