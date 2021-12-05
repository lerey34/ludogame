const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Game = require("./models/game");
const { toNamespacedPath } = require("path");
const http = require("http");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://lerey:12345@ludogame.2sadj.mongodb.net/ludoGame?retryWrites=true&w=majority";
mongoose.connect(url).catch((err) => {
  console.log(err);
});

const connections = [null, null, null, null];

var idRoom = 0;

dotenv.config({ path: "./.env" });
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

io.on("connection", (socket) => {
  //console.log("client connected");

  socket.on("room", (room) => {
    socket.join(room);
    for (const i in connections) {
      if (connections[i] === null) {
        connections[i] = socket.id;
        break;
      }
    }
    io.to(room).emit("id", connections);
  }); //

  socket.on("disconnect", () => {
    //console.log("player disconnected");
  });

  socket.on("leave", (room) => {
    socket.leave(room);
  });

  socket.on("move", (color, num, roomid) => {
    io.to(roomid).emit("move", color, num);
  });

  socket.on("randomNum", (color, player, roomid) => {
    var num = Math.floor(Math.random() * 6 + 1);
    if (color == "red" && player[0] == socket.id) {
      io.to(roomid).emit("randomNum", num);
    } else if (color == "blue" && player[1] == socket.id) {
      io.to(roomid).emit("randomNum", num);
    } else if (color == "yellow" && player[2] == socket.id) {
      io.to(roomid).emit("randomNum", num);
    } else if (color == "green" && player[3] == socket.id) {
      io.to(roomid).emit("randomNum", num);
    }
  });

  socket.on("step", (color, paw, idroom) => {
    io.to(idroom).emit("step", color, paw);
  });
});

app.get("/leave", (req, res) => {
  if (req.cookies.jwt) {
    try {
      const verified = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      var monId = verified.ids;
      User.findOne({ _id: monId }, (err, user) => {
        if (user == null) {
          res.render("login", { er: "Utilisateur non trouvé" });
        } else {
          Game.findOne({ rooms: user.numRoom }, (err, game) => {
            room = user.numRoom;
            if (game == null) {
              res.redirect("/play");
            } else {
              if (game.u1 == user.username) {
                Game.findOneAndUpdate(
                  { rooms: room },
                  {
                    $set: {
                      u1: game.u2,
                      u2: game.u3,
                      u3: game.u4,
                      u4: " ",
                      nbUser: game.nbUser - 1,
                    },
                  },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      User.findOneAndUpdate(
                        { _id: monId },
                        { $set: { numRoom: 0 } },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect("play");
                          }
                        }
                      );
                    }
                  }
                );
              } else if (game.u2 == user.username) {
                Game.findOneAndUpdate(
                  { rooms: room },
                  {
                    $set: {
                      u2: game.u3,
                      u3: game.u4,
                      u4: " ",
                      nbUser: game.nbUser - 1,
                    },
                  },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      User.findOneAndUpdate(
                        { _id: monId },
                        { $set: { numRoom: 0 } },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect("play");
                          }
                        }
                      );
                    }
                  }
                );
              } else if (game.u3 == user.username) {
                Game.findOneAndUpdate(
                  { rooms: room },
                  { $set: { u3: game.u4, u4: " ", nbUser: game.nbUser - 1 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      User.findOneAndUpdate(
                        { _id: monId },
                        { $set: { numRoom: 0 } },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect("play");
                          }
                        }
                      );
                    }
                  }
                );
              } else if (game.u4 == user.username) {
                Game.findOneAndUpdate(
                  { rooms: room },
                  { $set: { u4: " ", nbUser: game.nbUser - 1 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      User.findOneAndUpdate(
                        { _id: monId },
                        { $set: { numRoom: 0 } },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect("play");
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.cookies.iduser) {
    User.findOne({ _id: req.cookies.iduser }, (err, user) => {
      if (user == null) {
        res.render("login", { er: "Utilisateur non trouvé" });
      } else {
        if (game.u1 == user.username) {
          Game.findOneAndUpdate(
            { rooms: room },
            {
              $set: {
                u1: game.u2,
                u2: game.u3,
                u3: game.u4,
                u4: " ",
                nbUser: game.nbUser - 1,
              },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
                User.findOneAndUpdate(
                  { _id: monId },
                  { $set: { numRoom: 0 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect("play");
                    }
                  }
                );
              }
            }
          );
        } else if (game.u2 == user.username) {
          Game.findOneAndUpdate(
            { rooms: room },
            {
              $set: {
                u2: game.u3,
                u3: game.u4,
                u4: " ",
                nbUser: game.nbUser - 1,
              },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
                User.findOneAndUpdate(
                  { _id: monId },
                  { $set: { numRoom: 0 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect("play");
                    }
                  }
                );
              }
            }
          );
        } else if (game.u3 == user.username) {
          Game.findOneAndUpdate(
            { rooms: room },
            { $set: { u3: game.u4, u4: " ", nbUser: game.nbUser - 1 } },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
                User.findOneAndUpdate(
                  { _id: monId },
                  { $set: { numRoom: 0 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect("play");
                    }
                  }
                );
              }
            }
          );
        } else if (game.u4 == user.username) {
          Game.findOneAndUpdate(
            { rooms: room },
            { $set: { u4: " ", nbUser: game.nbUser - 1 } },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
                User.findOneAndUpdate(
                  { _id: monId },
                  { $set: { numRoom: 0 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect("play");
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  }
});

app.post("/leave", (req, res) => {
  res.redirect("leave");
});

app.get("/wait4", (req, res) => {
  if (req.cookies.jwt) {
    try {
      const verified = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      var monId = verified.ids;
      User.findOne({ _id: monId }, (err, user) => {
        if (user == null) {
          res.render("login", { er: "Utilisateur non trouvé" });
        } else {
          Game.findOne({ rooms: user.numRoom }, (err, game) => {
            if (game == null) {
              res.redirect("/play");
            } else {
              if (game.nbUser == 4) {
                res.render("game", {
                  numRoom: game.rooms,
                  user1: game.u1,
                  user2: game.u2,
                  user3: game.u3,
                  user4: game.u4,
                });
              } else {
                res.render("wait4", {
                  numRoom: game.rooms,
                  user1: game.u1,
                  user2: game.u2,
                  user3: game.u3,
                  user4: game.u4,
                });
              }
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.cookies.iduser) {
    User.findOne({ _id: req.cookies.iduser }, (err, user) => {
      if (user == null) {
        res.render("login", { er: "Utilisateur non trouvé" });
      } else {
        Game.findOne({ rooms: user.numRoom }, (err, game) => {
          if (game == null) {
            res.redirect("/play");
          } else {
            if (game.nbUser == 4) {
              res.render("game", {
                numRoom: game.rooms,
                user1: game.u1,
                user2: game.u2,
                user3: game.u3,
                user4: game.u4,
              });
            } else {
              res.render("wait4", {
                numRoom: game.rooms,
                user1: game.u1,
                user2: game.u2,
                user3: game.u3,
                user4: game.u4,
              });
            }
          }
        });
      }
    });
  }
});

app.post("/wait4", (req, res) => {
  idRoom = Math.floor(Math.random() * 9999 + 1000);
  if (idRoom != 0) {
    Game.findOne({ rooms: idRoom }, (err, game) => {
      if (game == null) {
        //create room
        if (req.cookies.jwt) {
          try {
            const verified = jwt.verify(
              req.cookies.jwt,
              process.env.JWT_SECRET
            );
            var monId = verified.ids;
            User.findOne({ _id: monId }, (err, user) => {
              if (user == null) {
                res.render("login", { er: "Utilisateur non trouvé" });
              } else {
                const games = new Game({
                  rooms: idRoom,
                  nbUser: 1,
                  u1: user.username,
                  u2: " ",
                  u3: " ",
                  u4: " ",
                });
                games
                  .save()
                  .then((result) => {
                    res.send(result);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                User.findOneAndUpdate(
                  { _id: monId },
                  { $set: { numRoom: idRoom } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect("wait4");
                    }
                  }
                );
              }
            });
          } catch (err) {
            console.log(err);
          }
        } else if (req.cookies.iduser) {
          User.findOne({ _id: req.cookies.iduser }, (err, user) => {
            if (user == null) {
              res.render("login", { er: "Utilisateur non trouvé" });
            } else {
              const games = new Game({
                rooms: idRoom,
                nbUser: 1,
                u1: user.username,
                u2: " ",
                u3: " ",
                u4: " ",
              });
              games
                .save()
                .then((result) => {
                  res.send(result);
                })
                .catch((err) => {
                  console.log(err);
                });
              User.findOneAndUpdate(
                { _id: monId },
                { $set: { numRoom: idRoom } },
                { new: true },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.redirect("wait4");
                  }
                }
              );
            }
          });
        }
      } else {
        //relance le num de la room
        //idRoom = Math.floor(Math.random() * 9999 + 1000);
        app.post("/wait4");
      }
    });
  } else {
    app.post("/wait4");
  }
});

app.get("/goWait4", (req, res) => {});

app.post("/goWait4", (req, res) => {
  room = req.body.idroom;
  Game.findOne({ rooms: room }, (err, game) => {
    if (game != null) {
      //create room
      if (req.cookies.jwt) {
        try {
          const verified = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
          var monId = verified.ids;
          User.findOne({ _id: monId }, (err, user) => {
            if (user == null) {
              res.render("login", { er: "Utilisateur non trouvé" });
            } else {
              if (game.u2 === " ") {
                Game.findOneAndUpdate(
                  { rooms: room },
                  { $set: { u2: user.username, nbUser: 2 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      User.findOneAndUpdate(
                        { _id: monId },
                        { $set: { numRoom: room } },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect("wait4");
                          }
                        }
                      );
                    }
                  }
                );
              } else if (game.u3 === " ") {
                Game.findOneAndUpdate(
                  { rooms: room },
                  { $set: { u3: user.username, nbUser: 3 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      User.findOneAndUpdate(
                        { _id: monId },
                        { $set: { numRoom: room } },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect("wait4");
                          }
                        }
                      );
                    }
                  }
                );
              } else if (game.u4 === " ") {
                Game.findOneAndUpdate(
                  { rooms: room },
                  { $set: { u4: user.username, nbUser: 4 } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      User.findOneAndUpdate(
                        { _id: monId },
                        { $set: { numRoom: room } },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.redirect("wait4");
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          });
        } catch (err) {
          console.log(err);
        }
      } else if (req.cookies.iduser) {
        User.findOne({ _id: req.cookies.iduser }, (err, user) => {
          if (user == null) {
            res.render("login", { er: "Utilisateur non trouvé" });
          } else {
            if (game.u2 === " ") {
              Game.findOneAndUpdate(
                { rooms: room },
                { $set: { u2: user.username, nbUser: 2 } },
                { new: true },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    User.findOneAndUpdate(
                      { _id: monId },
                      { $set: { numRoom: room } },
                      { new: true },
                      (err, doc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.redirect("wait4");
                        }
                      }
                    );
                  }
                }
              );
            } else if (game.u3 === " ") {
              Game.findOneAndUpdate(
                { rooms: room },
                { $set: { u3: user.username, nbUser: 3 } },
                { new: true },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    User.findOneAndUpdate(
                      { _id: monId },
                      { $set: { numRoom: room } },
                      { new: true },
                      (err, doc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.redirect("wait4");
                        }
                      }
                    );
                  }
                }
              );
            } else if (game.u4 === " ") {
              Game.findOneAndUpdate(
                { rooms: room },
                { $set: { u4: user.username, nbUser: 4 } },
                { new: true },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    User.findOneAndUpdate(
                      { _id: monId },
                      { $set: { numRoom: room } },
                      { new: true },
                      (err, doc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.redirect("wait4");
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        });
      }
    } else {
      //relance le num de la room
      //idRoom = Math.floor(Math.random() * 9999 + 1000);
      app.post("/wait4");
    }
  });
});

app.get("/join4", (req, res) => {
  Game.find({ nbUser: { $lt: 4 } }, (err, game) => {
    if (game == null) {
      res.redirect("/play");
    } else {
      res.render("join4", { games: game });
    }
  });
});

app.post("/join4", (req, res) => {
  res.redirect("join4");
});

//first website page
app.get("/", (req, res) => {
  res.redirect("/login");
});

//get logout to delete cookies
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.redirect("/");
});

//index page
app.get("/index", (req, res) => {
  res.render("index");
});

app.post("/index", (req, res) => {
  res.redirect("index");
});

//play page
app.get("/play", (req, res) => {
  Game.deleteOne({ nbUser: 0 }, (game) => {
    res.render("play");
  });
});

app.post("/play", (req, res) => {
  res.redirect("play");
});

//profile page thanks to cookies
app.get("/profile", (req, res) => {
  if (req.cookies.jwt) {
    try {
      const verified = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      var monId = verified.ids;
      User.findOne({ _id: monId }, (err, user) => {
        if (user == null) {
          res.render("login", { er: "Utilisateur non trouvé" });
        } else {
          res.render("profile", { users: user });
        }
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.cookies.iduser) {
    User.findOne({ _id: req.cookies.iduser }, (err, user) => {
      if (user == null) {
        res.render("login", { er: "Utilisateur non trouvé" });
      } else {
        res.render("profile", { users: user });
      }
    });
  } else {
    res.render("login", { er: "Probleme Utilisateur" });
  }
});

app.post("/profile", (req, res) => {
  res.redirect("profile");
});

//settings page
app.get("/settings", (req, res) => {
  res.render("settings");
});

app.post("/settings", (req, res) => {
  res.redirect("settings");
});

app.get("/join2", (req, res) => {
  res.render("join2");
});

app.post("/join2", (req, res) => {
  res.redirect("join2");
});

//register page connect to database
app.get("/register", (req, res) => {
  res.render("register", { er: "" });
});

app.post("/register", (req, res) => {
  var pseu = req.body.username;
  var eml = req.body.email;
  var pass = req.body.password;
  var confPass = req.body.confPassword;
  if (pass === confPass) {
    bcrypt.hash(pass, 10).then((hash) => {
      const user = new User({
        username: pseu,
        password: hash,
        email: eml,
        win: 0,
        lose: 0,
        total: 0,
        numRoom: 0,
      });
      user
        .save()
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
      res.redirect("/login");
    });
  } else {
    res.render("register", { er: "Password error" });
  }
});

//login page connect to database
app.get("/login", (req, res) => {
  if (req.cookies.jwt) {
    try {
      const verified = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      var monId = verified.ids;
      User.findOne({ _id: monId }, (err, user) => {
        if (user == null) {
          res.render("login", { er: "Utilisateur non trouvé" });
        } else {
          res.redirect("/index");
        }
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.cookies.iduser) {
    res.cookie("iduser", "", {
      expires: new Date(Date.now() + 2 * 1000),
      httpOnly: true,
    });
    res.render("login", { er: "" });
  } else {
    res.render("login", { er: "" });
  }
});

app.post("/login", (req, res) => {
  var pseu = req.body.username;
  var pass = req.body.password;
  User.findOne({ username: pseu }, (err, user) => {
    if (!user) {
      res.render("login", { er: "Wrong user or password" });
    } else {
      bcrypt.compare(pass, user.password, (err, response) => {
        if (response === false) {
          res.render("login", { er: "Wrong user or password" });
        } else {
          if (req.body.stay) {
            const ids = user.id;
            const token = jwt.sign({ ids }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });
            const cookieOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookieOptions);
          } else {
            res.cookie("iduser", user.id);
          }
          res.redirect("/index");
        }
      });
    }
  });
});

server.listen(8080, () => {
  console.log("server on 8080");
});
