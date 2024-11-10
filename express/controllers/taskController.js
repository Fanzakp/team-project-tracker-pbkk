const { Task, Project, User } = require("../models");

module.exports = {
  // Membuat task baru (hanya untuk admin)
  createTask: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          message: "Akses ditolak. Hanya admin yang dapat membuat tugas.",
        });
      }

      const { name, description, status, taskDue, projectId, assignedUserIds } =
        req.body;

      // Memeriksa apakah project ada dan dimiliki oleh admin
      const project = await Project.findOne({
        where: { id: projectId, adminId: req.user.id },
      });
      if (!project) {
        return res
          .status(404)
          .json({ message: "Proyek tidak ditemukan atau akses ditolak" });
      }

      const task = await Task.create({
        name,
        description,
        status,
        taskDue,
        projectId,
      });

      // Menetapkan user ke task
      if (assignedUserIds && assignedUserIds.length > 0) {
        const users = await User.findAll({ where: { id: assignedUserIds } });
        await task.addUsers(users);
      }

      res.status(201).json(task);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal membuat tugas", error: error.message });
    }
  },

  // Mendapatkan semua task
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.findAll({
        include: [{ model: User, through: { attributes: [] } }],
      });
      res.status(200).json(tasks);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal mendapatkan tugas", error: error.message });
    }
  },

  // Mendapatkan task berdasarkan ID
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findOne({
        where: { id },
        include: [{ model: User, through: { attributes: [] } }],
      });

      if (!task) {
        return res.status(404).json({ message: "Tugas tidak ditemukan" });
      }

      res.status(200).json(task);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal mendapatkan tugas", error: error.message });
    }
  },

  // Memperbarui task (hanya untuk admin)
  updateTask: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          message: "Akses ditolak. Hanya admin yang dapat memperbarui tugas.",
        });
      }

      const { id } = req.params;
      const { name, description, status, taskDue, assignedUserIds } = req.body;

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: "Tugas tidak ditemukan" });
      }

      await task.update({ name, description, status, taskDue });

      // Memperbarui user yang ditugaskan
      if (assignedUserIds && assignedUserIds.length > 0) {
        const users = await User.findAll({ where: { id: assignedUserIds } });
        await task.setUsers(users);
      }

      res.status(200).json({ message: "Tugas berhasil diperbarui", task });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal memperbarui tugas", error: error.message });
    }
  },

  // Menghapus task (hanya untuk admin)
  deleteTask: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          message: "Akses ditolak. Hanya admin yang dapat menghapus tugas.",
        });
      }

      const { id } = req.params;
      const task = await Task.findByPk(id);

      if (!task) {
        return res.status(404).json({ message: "Tugas tidak ditemukan" });
      }

      await task.destroy();
      res.status(200).json({ message: "Tugas berhasil dihapus" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal menghapus tugas", error: error.message });
    }
  },
};
