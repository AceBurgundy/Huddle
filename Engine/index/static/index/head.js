window.onclick = event => {
  if (!event.target.id) return;

  const notToggledNotification = !['notification-toggle', 'notification-dark', 'notification-icon'].includes(event.target.id);

  if (notToggledNotification) {
    document.getElementById('notification-list').classList.toggle('active');
  }
};
