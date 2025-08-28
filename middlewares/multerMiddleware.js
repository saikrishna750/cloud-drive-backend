const multer = require('multer');

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;



