const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Game = require("./models/game");
const Game2 = require("./models/game2");
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
const cookie = require("cookie");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://lerey:12345@ludogame.2sadj.mongodb.net/ludoGame?retryWrites=true&w=majority";
mongoose.connect(url).catch((err) => {
  console.log(err);
});

const port = process.env.PORT || 8080;

const connections4 = [null, null, null, null];
const connections2 = [null, null];

var idRoom = 0;

dotenv.config({ path: "./.env" });
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

io.on("connection", (socket) => {
  //console.log("client connected");

  socket.on("room", (room) => {
    socket.join(room);
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const verified = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
    var monId = verified.ids;
    User.findOne({ _id: monId }, (err, user) => {
      if (user == null) {
        res.render("login", { er: "Utilisateur non trouvé" });
      } else {
        for (const i in connections4) {
          if (connections4[i] === null) {
            connections4[i] = user.username;
            break;
          }
        }
        io.to(room).emit("id", connections4);
      }
    });
  });

  socket.on("room2", (room) => {
    socket.join(room);
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const verified = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
    var monId = verified.ids;
    User.findOne({ _id: monId }, (err, user) => {
      if (user == null) {
        res.render("login", { er: "Utilisateur non trouvé" });
      } else {
        for (const i in connections2) {
          if (connections2[i] === null) {
            connections2[i] = user.username;
            break;
          }
        }
        io.to(room).emit("id2", connections2);
      }
    });
  });

  socket.on("disconnect", () => {
    //console.log("player disconnected");
  });

  socket.on("randomNum", (color, player, roomid) => {
    var num = Math.floor(Math.random() * 6 + 1);
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const verified = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
    var monId = verified.ids;
    User.findOne({ _id: monId }, (err, user) => {
      if (user == null) {
        res.render("login", { er: "Utilisateur non trouvé" });
      } else {
        if (color == "red" && player[0] == user.username) {
          io.to(roomid).emit("randomNum", num, cookies.sound);
        } else if (color == "blue" && player[1] == user.username) {
          io.to(roomid).emit("randomNum", num, cookies.sound);
        } else if (color == "yellow" && player[2] == user.username) {
          io.to(roomid).emit("randomNum", num, cookies.sound);
        } else if (color == "green" && player[3] == user.username) {
          io.to(roomid).emit("randomNum", num, cookies.sound);
        }
      }
    });
  });

  socket.on("randomNum2", (color, player, roomid) => {
    var num = Math.floor(Math.random() * 6 + 1);
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const verified = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
    var monId = verified.ids;
    User.findOne({ _id: monId }, (err, user) => {
      if (user == null) {
        res.render("login", { er: "Utilisateur non trouvé" });
      } else {
        if (color == "red" && player[0] == user.username) {
          io.to(roomid).emit("randomNum2", num, cookies.sound);
        } else if (color == "yellow" && player[1] == user.username) {
          io.to(roomid).emit("randomNum2", num, cookies.sound);
        }
      }
    });
  });

  socket.on("step", (color, paw, idroom) => {
    io.to(idroom).emit("step", color, paw);
  });

  socket.on("stuck", (roomid) => {
    io.to(roomid).emit("stuck");
  });

  socket.on("winnner", (color, player) => {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const verified = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
    var monId = verified.ids;
    User.findOne({ _id: monId }, (err, user) => {
      if (user == null) {
        res.render("login", { er: "Utilisateur non trouvé" });
      } else {
        if (color == "red" && player[0] == user.username) {
          User.findOneAndUpdate(
            { _id: monId },
            {
              $set: {
                numRoom: 0,
                win: user.win + 1,
                total: user.total + 1,
              },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
              }
            }
          );
        } else if (color == "blue" && player[1] == user.username) {
          User.findOneAndUpdate(
            { _id: monId },
            {
              $set: {
                numRoom: 0,
                win: user.win + 1,
                total: user.total + 1,
              },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
              }
            }
          );
        } else if (color == "yellow" && player[2] == user.username) {
          User.findOneAndUpdate(
            { _id: monId },
            {
              $set: {
                numRoom: 0,
                win: user.win + 1,
                total: user.total + 1,
              },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
              }
            }
          );
        } else if (color == "green" && player[3] == user.username) {
          User.findOneAndUpdate(
            { _id: monId },
            {
              $set: {
                numRoom: 0,
                win: user.win + 1,
                total: user.total + 1,
              },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
              }
            }
          );
        } else {
          User.findOneAndUpdate(
            { _id: monId },
            {
              $set: {
                numRoom: 0,
                lose: user.lose + 1,
                total: user.total + 1,
              },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
              }
            }
          );
        }
      }
    });
  });

  socket.on("leave", (room) => {
    socket.leave(room);
    app.post("/leave");
    //socket.request.headers.referer = "http://localhos:8080/leave";
    //res.redirect("leave");
  });

  socket.on("chatMessage", (msg, roomid) => {
    io.to(roomid).emit("message", msg);
  });
});

//register page connect to database
app.get("/register", (req, res) => {
  res.render("register", { er: "" });
});

//first website page
app.get("/", (req, res) => {
  res.redirect("/login");
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
          res.cookie("sound", 1);
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
          res.cookie("sound", 1);
          res.redirect("/index");
        }
      });
    }
  });
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
    Game2.deleteOne({ nbUser: 0 }, (game2) => {
      res.render("play");
    });
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

//get logout to delete cookies
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.redirect("/");
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
                res.render("game4", {
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
              res.render("game4", {
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
        app.redirect("/wait4");
      }
    });
  } else {
    app.post("/wait4");
  }
});

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

app.get("/wait2", (req, res) => {
  if (req.cookies.jwt) {
    try {
      const verified = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      var monId = verified.ids;
      User.findOne({ _id: monId }, (err, user) => {
        if (user == null) {
          res.render("login", { er: "Utilisateur non trouvé" });
        } else {
          Game2.findOne({ rooms: user.numRoom }, (err, game) => {
            if (game == null) {
              res.redirect("/play");
            } else {
              if (game.nbUser == 2) {
                res.render("game2", {
                  numRoom: game.rooms,
                  user1: game.u1,
                  user2: game.u2,
                });
              } else {
                res.render("wait2", {
                  numRoom: game.rooms,
                  user1: game.u1,
                  user2: game.u2,
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
        Game2.findOne({ rooms: user.numRoom }, (err, game) => {
          if (game == null) {
            res.redirect("/play");
          } else {
            if (game.nbUser == 2) {
              res.render("game2", {
                numRoom: game.rooms,
                user1: game.u1,
                user2: game.u2,
              });
            } else {
              res.render("wait2", {
                numRoom: game.rooms,
                user1: game.u1,
                user2: game.u2,
              });
            }
          }
        });
      }
    });
  }
});

app.post("/wait2", (req, res) => {
  idRoom = Math.floor(Math.random() * 9999 + 1000);
  if (idRoom != 0) {
    Game2.findOne({ rooms: idRoom }, (err, game) => {
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
                const games = new Game2({
                  rooms: idRoom,
                  nbUser: 1,
                  u1: user.username,
                  u2: " ",
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
                      res.redirect("wait2");
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
              const games = new Game2({
                rooms: idRoom,
                nbUser: 1,
                u1: user.username,
                u2: " ",
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
                    res.redirect("wait2");
                  }
                }
              );
            }
          });
        }
      } else {
        //relance le num de la room
        //idRoom = Math.floor(Math.random() * 9999 + 1000);
        app.post("/wait2");
      }
    });
  } else {
    app.post("/wait2");
  }
});

app.post("/goWait2", (req, res) => {
  room = req.body.idroom;
  Game2.findOne({ rooms: room }, (err, game) => {
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
                Game2.findOneAndUpdate(
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
                            res.redirect("wait2");
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
              Game2.findOneAndUpdate(
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
                          res.redirect("wait2");
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
      app.post("/wait2");
    }
  });
});

app.get("/join2", (req, res) => {
  Game2.find({ nbUser: { $lt: 2 } }, (err, game) => {
    if (game == null) {
      res.redirect("/play");
    } else {
      res.render("join2", { games: game });
    }
  });
});

app.post("/join2", (req, res) => {
  res.redirect("join2");
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

server.listen(port, () => {
  console.log("server on " + port);
});
