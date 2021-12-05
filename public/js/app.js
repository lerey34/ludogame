document.addEventListener("DOMContentLoaded", () => {
  var dice = document.getElementById("dice");
  var badtext = document.getElementById("badtext");
  var text = document.getElementById("player");
  var roomid = document.getElementById("roomId");
  const red1 = document.getElementById("redpawn1");
  const red2 = document.getElementById("redpawn2");
  const red3 = document.getElementById("redpawn3");
  const red4 = document.getElementById("redpawn4");
  const yellow1 = document.getElementById("yellowpawn1");
  const yellow2 = document.getElementById("yellowpawn2");
  const yellow3 = document.getElementById("yellowpawn3");
  const yellow4 = document.getElementById("yellowpawn4");
  const green1 = document.getElementById("greenpawn1");
  const green2 = document.getElementById("greenpawn2");
  const green3 = document.getElementById("greenpawn3");
  const green4 = document.getElementById("greenpawn4");
  const blue1 = document.getElementById("bluepawn1");
  const blue2 = document.getElementById("bluepawn2");
  const blue3 = document.getElementById("bluepawn3");
  const blue4 = document.getElementById("bluepawn4");
  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");
  const player3 = document.getElementById("player3");
  const player4 = document.getElementById("player4");

  var connections = [null, null, null, null];
  var i = 0;

  var currPos = 0;
  var step = 56.84;
  var currcolor = "";
  var NumOfPaw = "";
  var num = 0;
  var clicked = false;
  var currpawn = "";
  var allcolor = ["red", "blue", "green", "yellow"];
  var pawnOut = { red: 0, blue: 0, green: 0, yellow: 0 };

  var socket = io();

  socket.on("connect", () => {
    var room = roomId.innerText;
    socket.emit("room", room);
  });

  socket.on("id", (id) => {
    console.log("p0 : " + id[0]);
    console.log("p1 : " + id[1]);
    console.log("p2 : " + id[2]);
    console.log("p3 : " + id[3]);
    connections[0] = id[0];
    connections[1] = id[1];
    connections[2] = id[2];
    connections[3] = id[3];
    console.log("c0 : " + connections[0]);
    console.log("c1 : " + connections[1]);
    console.log("c2 : " + connections[2]);
    console.log("c3 : " + connections[3]);
  });

  socket.on("randomNum", (nums) => {
    num = nums;
    console.log(num);
    if (!clicked) {
      dice.style.backgroundImage = "url(/img/" + num + ".png)";
      clicked = true;
    }
    if (num != 6 && DontHaveOtherFree()) {
      badtext.innerText = "Unfortunatlly you stuck";
      window.setTimeout(changePlayer, 1000);
      clicked = false;
    }
  });

  socket.on("move", (color, num) => {
    console.log(color, num);
    randomMove(color, num);
  });

  socket.on("step", (Color, paw) => {
    NumOfPaw = paw;
    currcolor = Color;
    currpawn = currcolor + "pawn" + NumOfPaw;
    currPos = positions[currpawn];
    if (num + currPos > 43) {
      Stuck();
    } else {
      if (clicked) {
        var position = currPos;
        console.log("move1");
        if (text.innerText == currcolor) {
          console.log("move2");
          if (onboard[currpawn] === 1 || num === 6) {
            console.log("move3");
            if (onboard[currpawn] === 0) {
              var doc = document.getElementById(currpawn);
              var curr = Number(doc.style.left.replace(/[a-z]/g, ""));
              console.log("move4");
              switch (Color) {
                case "red":
                  doc.style.left = 365.4 + "px";
                  doc.style.top = 81.2 + "px";
                  break;

                case "yellow":
                  doc.style.left = 251.72 + "px";
                  doc.style.top = 535.92 + "px";
                  break;

                case "blue":
                  doc.style.left = 535.92 + "px";
                  doc.style.top = 365.4 + "px";
                  break;

                case "green":
                  doc.style.left = 81.2 + "px";
                  doc.style.top = 251.72 + "px";
                  break;
              }
              onboard[currpawn] = 1;
            } else {
              console.log("move5");
              switch (Color) {
                case "red":
                  for (i = currPos; i < position + num; i++) {
                    stepsRed[i]();
                  }
                  break;

                case "yellow":
                  for (i = currPos; i < position + num; i++) {
                    stepsYellow[i]();
                  }
                  break;

                case "blue":
                  for (i = currPos; i < position + num; i++) {
                    stepsBlue[i]();
                  }
                  break;

                case "green":
                  for (i = currPos; i < position + num; i++) {
                    stepsGreen[i]();
                  }
                  break;
              }
              positions[currpawn] = currPos;
              var victim = HaveHover();
              if (victim != false) {
                ResetPawn(victim);
              }
              if (currPos == 43) {
                pawnOut[currcolor]++;
                onboard[currpawn] = 0;
                positions[currpawn] = 0;
                document.getElementById(currpawn).style.visibility = "hidden";
              }
              CheckForWinner();
              changePlayer();
            }
            num = 0;
            clicked = false;
            dice.style.backgroundImage = "url(/img/dice.gif)";
          } else Stuck();
        }
      }
    }
  });

  dice.addEventListener("click", randomNum);

  red1.addEventListener("click", () => {
    socket.emit("move", "red", 1, roomid.innerHTML);
  });
  red2.addEventListener("click", () => {
    socket.emit("move", "red", 2, roomid.innerHTML);
  });
  red3.addEventListener("click", () => {
    socket.emit("move", "red", 3, roomid.innerHTML);
  });
  red4.addEventListener("click", () => {
    socket.emit("move", "red", 4, roomid.innerHTML);
  });

  yellow1.addEventListener("click", () => {
    socket.emit("move", "yellow", 1, roomid.innerHTML);
  });
  yellow2.addEventListener("click", () => {
    socket.emit("move", "yellow", 2, roomid.innerHTML);
  });
  yellow3.addEventListener("click", () => {
    socket.emit("move", "yellow", 2, roomid.innerHTML);
  });
  yellow4.addEventListener("click", () => {
    socket.emit("move", "yellow", 2, roomid.innerHTML);
  });

  green1.addEventListener("click", () => {
    socket.emit("move", "green", 1, roomid.innerHTML);
  });
  green2.addEventListener("click", () => {
    socket.emit("move", "green", 2, roomid.innerHTML);
  });
  green3.addEventListener("click", () => {
    socket.emit("move", "green", 3, roomid.innerHTML);
  });
  green4.addEventListener("click", () => {
    socket.emit("move", "green", 4, roomid.innerHTML);
  });

  blue1.addEventListener("click", () => {
    socket.emit("move", "blue", 1, roomid.innerHTML);
  });
  blue2.addEventListener("click", () => {
    socket.emit("move", "blue", 2, roomid.innerHTML);
  });
  blue3.addEventListener("click", () => {
    socket.emit("move", "blue", 3, roomid.innerHTML);
  });
  blue4.addEventListener("click", () => {
    socket.emit("move", "blue", 4, roomid.innerHTML);
  });

  function HaveHover() {
    var count = 0;
    var toKill = "";
    for (var i = 0; i < allcolor.length; i++) {
      for (var n = 1; n <= 4; n++) {
        var firstPawn = document.getElementById(allcolor[i] + "pawn" + n);
        var secondPawn = document.getElementById(currpawn);
        if (
          firstPawn.style.top == secondPawn.style.top &&
          firstPawn.style.left == secondPawn.style.left &&
          currcolor != allcolor[i] &&
          currPos + num < 43
        ) {
          count++;
          toKill = allcolor[i] + "pawn" + n;
          return toKill;
        }
      }
    }
    return false;
  }
  function Stuck() {
    if (onboard[currpawn] == 0 || currPos + num > 43) {
      if (DontHaveOtherFree() || currPos + num > 43) {
        badtext.innerText = "Unfortunatlly you stuck";
        clicked = false;
        dice.style.backgroundImage = "url(/img/dice.gif)";
        window.setTimeout(changePlayer, 1000);
      }
    }
  }
  function changePlayer() {
    if (num != 6) {
      switch (text.innerText) {
        case "red":
          text.innerText = text.style.color = "blue";
          break;
        case "blue":
          text.innerText = text.style.color = "yellow";
          break;
        case "yellow":
          text.innerText = text.style.color = "green";
          break;
        case "green":
          text.innerText = text.style.color = "red";
          break;
      }
    }
    badtext.innerText = "";
    dice.style.backgroundImage = "url(/img//dice.gif)";
  }
  var positions = {
    redpawn1: 0,
    redpawn2: 0,
    redpawn3: 0,
    redpawn4: 0,
    bluepawn1: 0,
    bluepawn2: 0,
    bluepawn3: 0,
    bluepawn4: 0,
    greenpawn1: 0,
    greenpawn2: 0,
    greenpawn3: 0,
    greenpawn4: 0,
    yellowpawn1: 0,
    yellowpawn2: 0,
    yellowpawn3: 0,
    yellowpawn4: 0,
  };
  var onboard = {
    redpawn1: 0,
    redpawn2: 0,
    redpawn3: 0,
    redpawn4: 0,
    bluepawn1: 0,
    bluepawn2: 0,
    bluepawn3: 0,
    bluepawn4: 0,
    greenpawn1: 0,
    greenpawn2: 0,
    greenpawn3: 0,
    greenpawn4: 0,
    yellowpawn1: 0,
    yellowpawn2: 0,
    yellowpawn3: 0,
    yellowpawn4: 0,
  };
  function DontHaveOtherFree() {
    for (var i = 1; i <= 4; i++) {
      if (
        onboard[text.innerText + "pawn" + i] == 1 ||
        positions[text.innerText + "pawn" + i] + num >= 43
      )
        return false;
    }
    return true;
  }
  function CheckForWinner() {
    if (pawnOut[currcolor] == 4) {
      var player = document.getElementById("player");
      var uselesstext1 = document.getElementById("uselesstext1");
      var uselesstext2 = document.getElementById("uselesstext2");
      dice.innerText = "";
      dice.style.visibility = "hidden";
      uselesstext1.innerText = "";
      uselesstext2.innerText = "";
      player.innerText = "The Winner is the " + currcolor + " player";
    }
  }
  function stepDown() {
    var doc = document.getElementById(currcolor + "pawn" + NumOfPaw);
    var curr = Number(doc.style.top.replace(/[a-z]/g, ""));
    doc.style.top = curr + step + "px";
    currPos++;
  }
  function stepUp() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.top.replace(/[a-z]/g, ""));
    doc.style.top = curr - step + "px";
    currPos++;
  }
  function stepLeft() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.left.replace(/[a-z]/g, ""));
    doc.style.left = curr - step + "px";
    currPos++;
  }
  function stepRight() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.left.replace(/[a-z]/g, ""));
    doc.style.left = curr + step + "px";
    currPos++;
  }
  var stepsRed = [];
  var stepsYellow = [];
  var stepsBlue = [];
  var stepsGreen = [];
  function pushSteps(value, steps, count) {
    for (i = 0; i < count; i++) steps.push(value);
  }
  //Red pawns path
  pushSteps(stepDown, stepsRed, 3);
  pushSteps(stepRight, stepsRed, 4);
  pushSteps(stepDown, stepsRed, 2);
  pushSteps(stepLeft, stepsRed, 4);
  pushSteps(stepDown, stepsRed, 4);
  pushSteps(stepLeft, stepsRed, 2);
  pushSteps(stepUp, stepsRed, 4);
  pushSteps(stepLeft, stepsRed, 4);
  pushSteps(stepUp, stepsRed, 2);
  pushSteps(stepRight, stepsRed, 4);
  pushSteps(stepUp, stepsRed, 4);
  pushSteps(stepRight, stepsRed, 1);
  pushSteps(stepDown, stepsRed, 5);
  //Yellow pawns path

  pushSteps(stepUp, stepsYellow, 3);
  pushSteps(stepLeft, stepsYellow, 4);
  pushSteps(stepUp, stepsYellow, 2);
  pushSteps(stepRight, stepsYellow, 4);
  pushSteps(stepUp, stepsYellow, 4);
  pushSteps(stepRight, stepsYellow, 2);
  pushSteps(stepDown, stepsYellow, 4);
  pushSteps(stepRight, stepsYellow, 4);
  pushSteps(stepDown, stepsYellow, 2);
  pushSteps(stepLeft, stepsYellow, 4);
  pushSteps(stepDown, stepsYellow, 4);
  pushSteps(stepLeft, stepsYellow, 1);
  pushSteps(stepUp, stepsYellow, 5);

  //Blue pawns path
  pushSteps(stepLeft, stepsBlue, 3);
  pushSteps(stepDown, stepsBlue, 4);
  pushSteps(stepLeft, stepsBlue, 2);
  pushSteps(stepUp, stepsBlue, 4, 2);
  pushSteps(stepLeft, stepsBlue, 4);
  pushSteps(stepUp, stepsBlue, 2);
  pushSteps(stepRight, stepsBlue, 4);
  pushSteps(stepUp, stepsBlue, 4);
  pushSteps(stepRight, stepsBlue, 2);
  pushSteps(stepDown, stepsBlue, 4);
  pushSteps(stepRight, stepsBlue, 4);
  pushSteps(stepDown, stepsBlue, 1);
  pushSteps(stepLeft, stepsBlue, 5);

  //Green pawns path
  pushSteps(stepRight, stepsGreen, 3);
  pushSteps(stepUp, stepsGreen, 4);
  pushSteps(stepRight, stepsGreen, 2);
  pushSteps(stepDown, stepsGreen, 4);
  pushSteps(stepRight, stepsGreen, 4);
  pushSteps(stepDown, stepsGreen, 2);
  pushSteps(stepLeft, stepsGreen, 4);
  pushSteps(stepDown, stepsGreen, 4);
  pushSteps(stepLeft, stepsGreen, 2);
  pushSteps(stepUp, stepsGreen, 4);
  pushSteps(stepLeft, stepsGreen, 4);
  pushSteps(stepUp, stepsGreen, 1);
  pushSteps(stepRight, stepsGreen, 5);
  function ResetPawn(victim) {
    onboard[victim] = 0;
    positions[victim] = 0;
    var pawnToMove = document.getElementById(victim);
    switch (victim) {
      case "redpawn1":
        pawnToMove.style.top = 81.2 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "redpawn2":
        pawnToMove.style.top = 81.2 + "px";
        pawnToMove.style.left = 535.92 + "px";
        break;
      case "redpawn3":
        pawnToMove.style.top = 138.04 + "px";
        pawnToMove.style.left = 535.92 + "px";
        break;
      case "redpawn4":
        pawnToMove.style.top = 138.04 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "bluepawn1":
        pawnToMove.style.top = 479.08 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "bluepawn2":
        pawnToMove.style.top = 479.08 + "px";
        pawnToMove.style.left = 535.92 + "px";
        break;
      case "bluepawn3":
        pawnToMove.style.top = 535.92 + "px";
        pawnToMove.style.left = 535.92 + "px";
        break;
      case "bluepawn4":
        pawnToMove.style.top = 535.92 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "greenpawn1":
        pawnToMove.style.top = 81.02 + "px";
        pawnToMove.style.left = 138.04 + "px";
        break;
      case "greenpawn2":
        pawnToMove.style.top = 81.02 + "px";
        pawnToMove.style.left = 81.02 + "px";
        break;
      case "greenpawn3":
        pawnToMove.style.top = 138.04 + "px";
        pawnToMove.style.left = 81.02 + "px";
        break;
      case "greenpawn4":
        pawnToMove.style.top = 138.04 + "px";
        pawnToMove.style.left = 138.04 + "px";
        break;
      case "yellowpawn1":
        pawnToMove.style.top = 479.8 + "px";
        pawnToMove.style.left = 138.04 + "px";
        break;
      case "yellowpawn2":
        pawnToMove.style.top = 479.2 + "px";
        pawnToMove.style.left = 81.2 + "px";
        break;
      case "yellowpawn3":
        pawnToMove.style.top = 535.92 + "px";
        pawnToMove.style.left = 81.2 + "px";
        break;
      case "yellowpawn4":
        pawnToMove.style.top = 535.92 + "px";
        pawnToMove.style.left = 138.04 + "px";
        break;
    }
  }
  function randomNum() {
    socket.emit("randomNum", text.innerText, connections, roomid.innerHTML);
  }
  function randomMove(Color, paw) {
    socket.emit("step", Color, paw, roomid.innerHTML);
  }
});
