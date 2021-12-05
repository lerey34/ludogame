document.addEventListener("DOMContentLoaded", () => {
  const roomId = document.querySelectorAll(".room");

  var socket = io();

  socket.on("connect", () => {
    //socket.emit("list");
  });

  /*roomId.forEach((room) => {
    room.addEventListener("click", () => {
      //socket.emit("idRoom", room.innerHTML);
      console.log(room.value);
    });
  });*/

  socket.on("list", (data) => {
    //data.forEach((element) => {
    console.log(data);
    //});
  });
});
