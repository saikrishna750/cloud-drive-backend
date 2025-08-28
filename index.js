const express = require('express');
const supabase = require('./config/supabaseClient')
const path = require('path')
const cors = require('cors')
const authRoutes = require('./routes/auth');
const verifyToken = require('./middlewares/authMiddleware');
const upload = require('./middlewares/multerMiddleware');
const uploadFile = require('./controllers/fileController');
const { getFolders, createFolder, renameFoder, getStarredFolders, fetchStarredFolders} = require('./controllers/folderController');
const getUserData = require('./controllers/userDataController');

require("dotenv").config();
const app = express();
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173", "https://cloud-drive-frontend-three.vercel.app" ]// React frontend URL
    credentials: true
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Basic route
app.get('/', (req, res) => {
  res.send('backend server is running');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/profile',verifyToken, async (req, res) =>{
  const userDetails = req.user
  res.send({msg:"verified token", userDetails})
} )

app.use('/auth', authRoutes);

app.post('/files/upload', verifyToken, upload.single('file'), uploadFile);

app.get('/drive/user', verifyToken, getUserData);

app.post('/folders/create', verifyToken, createFolder );

app.get('/folders/', verifyToken, getFolders);

app.put('/folder/rename', verifyToken, renameFoder);

app.post('/folders/starred', verifyToken, getStarredFolders);

app.delete('/folders/unstarred', verifyToken, getStarredFolders);

app.get('/folders/getstarred', verifyToken, fetchStarredFolders);