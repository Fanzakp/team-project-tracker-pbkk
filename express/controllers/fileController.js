const { File, Task } = require("../models");
const multer = require("multer");
const fs = require('fs');
const path = require("path");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pastikan folder 'uploads' ada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = {
  // Upload file ke task
  uploadFile: [
      upload.single('file'),
      async (req, res) => {
          try {
              if (!req.file) {
                  return res.status(400).json({ message: "No file uploaded" });
              }

              const { taskId } = req.body;
              
              // Validate taskId
              if (!taskId) {
                  return res.status(400).json({ message: "Task ID is required" });
              }

              // Check if task exists
              const task = await Task.findByPk(taskId);
              if (!task) {
                  return res.status(404).json({ message: "Task not found" });
              }

              // Create file record
              const file = await File.create({
                  name: req.file.originalname,
                  path: req.file.path,
                  taskId: taskId
              });

              res.status(201).json({ 
                  message: "File uploaded successfully",
                  file: {
                      id: file.id,
                      name: file.name,
                      path: file.path
                  }
              });
          } catch (error) {
              console.error('File upload error:', error);
              res.status(500).json({ 
                  message: "Failed to upload file", 
                  error: error.message 
              });
          }
      }
  ],

  // Mendapatkan file berdasarkan ID
  getFileById: async (req, res) => {
    try {
      const { id } = req.params;
      const file = await File.findByPk(id);
      if (!file) {
        return res.status(404).json({ message: "File tidak ditemukan" });
      }
      res.download(file.path, file.name);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal mendapatkan file", error: error.message });
    }
  },

  // Menghapus file
  deleteFile: async (req, res) => {
    try {
      const { id } = req.params;
      const file = await File.findByPk(id);
      if (!file) {
        return res.status(404).json({ message: "File tidak ditemukan" });
      }
      await file.destroy();
      res.status(200).json({ message: "File berhasil dihapus" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal menghapus file", error: error.message });
    }
  },

  getFilesByTaskId: async (req, res) => {
    try {
      const { taskId } = req.params;
  
      // Check if task exists
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Get all files for this task with full details
      const files = await File.findAll({
        where: { taskId: taskId },
        attributes: ['id', 'name', 'path', 'createdAt'], // Explicitly specify attributes
        order: [['createdAt', 'DESC']] // Order by newest first
      });
  
      res.status(200).json(files);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ 
        message: "Failed to fetch files", 
        error: error.message 
      });
    }
  }
};
