// Requiring every modules
const express = require("express");
const app = express(); // instance of express func
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const { isLoggedIn } = require("./middleware");
const flash = require("connect-flash");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const Chat = require("./models/chat");

mongoose
	.connect("mongodb://localhost:27017/twitter-clone", {
		useNewUrlParser: true, // it allow users to fall back to the old parser if they find a bug in the new parser.
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log("DB connected !"))
	.catch((err) => console.log(err));

// Method to set ejs as template Engine
app.set("view engine", "ejs");

// Path for views | dirname is the current working path
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// Form data parse
app.use(express.urlencoded({ extended: true }));

// To get the json data
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");

// APIs
const postsApiRoutes = require("./routes/api/posts");

// Middleware to use session for authentication
app.use(
	session({
		secret: "dontshareit",
		resave: false,
		saveUninitialized: true,
	})
);

app.use(flash());

// To use passport and Login session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to get the user details
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currentUser = req.user;
	next();
})


// Use the Routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(chatRoutes);

// Use the APIs
app.use(postsApiRoutes);

// Socket.io configuration
io.on("connection", (socket) => {
	console.log("Connection established");

	socket.on("send-msg", async(data) => {
		
		io.emit('received-msg', {
			user: data.user,
			msg: data.msg,
			createdAt: new Date()
		});

		await Chat.create({content: data.msg, user: data.user});
	});
});

app.get("/", isLoggedIn, (req, res) => {
	res.render("home");
});

server.listen(3000, () => {
	console.log("Listening on port 3000 ");
});
