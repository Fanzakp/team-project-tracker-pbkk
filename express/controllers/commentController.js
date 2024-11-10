const { Comment, Task } = require("../models");

module.exports = {
  // Menambahkan komentar ke task
  addComment: async (req, res) => {
    try {
      const { taskId, commentText } = req.body;

      // Memeriksa apakah task ada
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ message: "Tugas tidak ditemukan" });
      }

      const comment = await Comment.create({
        commentText,
        userId: req.user.id,
        taskId,
      });

      res.status(201).json(comment);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal menambahkan komentar", error: error.message });
    }
  },

  // Mendapatkan semua komentar pada task
  getCommentsByTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const comments = await Comment.findAll({ where: { taskId } });
      res.status(200).json(comments);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal mendapatkan komentar", error: error.message });
    }
  },

  // Memperbarui komentar
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { commentText } = req.body;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({ message: "Komentar tidak ditemukan" });
      }

      // Memastikan user adalah pemilik komentar atau admin
      if (comment.userId !== req.user.id) {
        return res.status(403).json({ message: "Akses ditolak" });
      }

      await comment.update({ commentText });
      res
        .status(200)
        .json({ message: "Komentar berhasil diperbarui", comment });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal memperbarui komentar", error: error.message });
    }
  },

  // Menghapus komentar
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({ message: "Komentar tidak ditemukan" });
      }

      // Memastikan user adalah pemilik komentar atau admin
      if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Akses ditolak" });
      }

      await comment.destroy();
      res.status(200).json({ message: "Komentar berhasil dihapus" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal menghapus komentar", error: error.message });
    }
  },
};
