const { File, Task } = require("../models");
const multer = require("multer");
const path = require("path");

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pastikan folder 'uploads' ada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  },
});

const upload = multer({ storage });

module.exports = {
  // Upload file ke task
  uploadFile: [
    upload.single("file"),
    async (req, res) => {
      try {
        const { taskId } = req.body;

        // Memeriksa apakah task ada
        const task = await Task.findByPk(taskId);
        if (!task) {
          return res.status(404).json({ message: "Tugas tidak ditemukan" });
        }

        const file = await File.create({
          name: req.file.filename,
          path: req.file.path,
          taskId,
        });

        res.status(201).json({ message: "File berhasil diupload", file });
      } catch (error) {
        res
          .status(400)
          .json({ message: "Gagal mengupload file", error: error.message });
      }
    },
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
};
