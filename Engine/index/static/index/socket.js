import {socket, baseURL} from "../../../static/socket.js";

socket.on('connect', async () => {
  console.log("socket started");
});

socket.on('update_notification', async () => {
  await updateNotifications();
});
