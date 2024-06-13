import {element, triggerWhenElementsExist} from '../../../static/helper.js';

const notificationList = element('#notification-list');

triggerWhenElementsExist([
  '#notification-toggle',
  '#notification-list-close',
  '#notification-dark',
  '#notification-icon'
], 'click', () => {
  notificationList.classList.toggle('active');
});

/**
 * Asynchronously fetches notifications from the server and logs them to the console.
 * If an error occurs during the fetch operation, it logs the error to the console.
 *
 * Summary
 * - Fetch notifications from the server.
 * - Convert the response to JSON.
 * - Select the current list of notifications on the client.
 * - Compare the IDs of current notifications with the new ones received from the server.
 * - Remove notifications from the client that no longer exist on the server.
 * - Add new notifications to the client that are not already displayed.
 * - Handle any potential errors during this process.
 *
 * @async
 * @function updateNotifications
 * @return {Promise<void>} A promise that resolves when the notifications have been fetched and logged, or rejects if an error occurs.
 */
export const updateNotifications = async () => {
  fetch('/notifications')
      .then(response => response.json())
      .then(newNotificationObjects => {
        const notificationParentElement = element('#notification-list');
        const notificationParentElementIds = Array.from(notificationParentElement.children).map(item => item.dataset.id);
        const newNotificationObjectsIds = Array.from(newNotificationObjects).map(notification => notification.id);

        const removedNotificationsIds = [];

        // Removes newNotificationObjects already removed from database but still in the client side
        Array.from(notificationParentElement.children).forEach(notificationElement => {
          const id = notificationElement.dataset.id;
          const idInNewNotifications = newNotificationObjectsIds.includes(id);

          if (idInNewNotifications) {
            return;
          }

          notificationElement.remove();
          removedNotificationsIds.push(id);
        });

        // The filtered version of notificationParentElementIds which doesn't contain elements removed from the previous loop
        const filteredNotificationParentElementIds = notificationParentElementIds.filter(id => !removedNotificationsIds.includes(id));

        // Adds the new notification only if that notification doesn't currently exist
        newNotificationObjects.forEach(notification => {
          const notificationExists = filteredNotificationParentElementIds.includes(notification.id);

          if (!notificationExists) {
            notificationParentElement.innerHTML += makeNewNotification(notification);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
};

/**
 * Creates an HTML string for a new notification list item.
 * Depending on the type of the notification, it includes either confirmation buttons or a message.
 *
 * @function makeNewNotification
 * @param {string} title - The title of the notification.
 * @param {string} message - The message content of the notification.
 * @param {string} type - The type of the notification. If the type is 'Confirm', confirmation buttons are included.
 * @return {string} An HTML string representing the notification list item.
 */
function makeNewNotification(title, message, type) {
  return /* html */`
    <li class="notification-list__item">
      <p class="notification-list__item__title">${title}</p>
      ${
        type == 'Confirm' ? /* html */`
          <div class="notification-list__item__buttons">
            <button class="notification-list__item__buttons__approve">Approve</button>
            <button class="notification-list__item__buttons__deny">Deny</button>
          </div>
        ` : /* html */`
          <p class="notification-list__item__message">${message}</p>
        `
}
    </li>
  `;
};

/**
 * Asynchronously fetches notifications from the server and logs them to the console.
 * If an error occurs during the fetch operation, it logs the error to the console.
 *
 * @async
 * @function updateNotifications
 * @return {Promise<void>} A promise that resolves when the notifications have been fetched and logged, or rejects if an error occurs.
 */
async function updateNotifications() {
  fetch('/notifications')
      .then(response => response.json())
      .then(notifications => {
        console.log(notifications);
      })
      .catch(error => {
        console.log(error);
      });
}
