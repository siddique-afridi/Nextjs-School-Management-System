const express = require('express');
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');
const cors = require ('cors');
const http = require('http');
const {Server} = require('socket.io');
const apiLogger = require('./middleware/apiLogger');
const uploadProfile = require('./controllers/uploadProfile');
const passport = require('passport')
require('./config/passport');
const limiter = require("./middleware/rateLimiter")


// const authroutes = require ('./controllers/auth');
const app = express();

dotenv.config();
if (process.env.NODE_ENV !== 'production') {
  console.log("⚠️  Running in development mode");
}


console.log("🌍 Environment Mode:", process.env.NODE_ENV);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lixschool.vercel.app",
    "https://www.lixschool.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ],
  exposedHeaders: ['Authorization'],
}));

// creating http server and attaching socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin:[ "http://localhost:5173", "https://lixschool.vercel.app"], methods: ["GET", "POST"] },
})

// Storing the io instance globally so routes can use it
app.set("io", io);

// Basic socket connection log
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});



app.use((req, res, next) => {
  console.log("🌍 Request Origin:", req.headers.origin);
  next();
});

app.use(apiLogger);

app.use(express.json());
app.use(passport.initialize());
// app.use(limiter);  
app.use("/limit-check", limiter, async(req,res)=>{
  
  res.json({ message: "limit check route", data:{name: "khan", city: "kohat", contact: 23445234}})
})

// important if sending token in header instead of body
app.use((_, res, next) => {
    res.header("Access-Control-Expose-Headers", "Authorization");
    next();
  });


app.get('/health/check', (req,res,next) =>{
  return res.json({
    success: 1,
    message: 'Yes i am running!',
    response: 200,
    data:{}
  })
})


app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/admin", require("./routes/adminRoutes")); 
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/dashboard-stats', require('./routes/dashboard-stats'))
app.use('/api/results', require('./routes/ResultRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))
app.use('/api/result-data', require('./routes/result-dataRoute'))
app.use('/api/chatbot', require("./routes/chatbotRoutes"))

app.use('/aggregation', require('./routes/aggroute'))
// app.use('/api/dashboard', require('./routes/adminRoutes'));




// making it public , to be accessed by URL and photo can be viewed on request
app.use('/uploads', express.static("uploads"));

app.use((err, req, res, next) => {
  console.log('errrrrrrrrrrrrrrr', err);
  // console.error(err.stack)
  res.status(500).send('Something broke!')
})

// app.get('/', async(req,res,next) => {
//   res.json('Hello')
// })

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
});


  // Connect after server starts (non-blocking)
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB connected'))
.catch(err=> console.error(err));



// socket.io integration
// 1 install packages frontend, backend both
// 2 import http from http, and Server from socket.io
// 3 create http server and attach socket.io   means both will run on same server
// 4 app.set()   make it global so every file can use it
// 5 replace app.listen   >>to   server.listen 
// 6 now just get the setted server (point 4) in a file where you want to emit some event