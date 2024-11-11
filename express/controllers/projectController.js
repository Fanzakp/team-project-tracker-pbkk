const { Project } = require("../models");

module.exports = {
  // Membuat project baru (hanya untuk admin)
  createProject: async (req, res) => {
    try {
      // Memeriksa apakah user adalah admin
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .json({
            message: "Akses ditolak. Hanya admin yang dapat membuat proyek.",
          });
      }

      const { name, description, projectDue } = req.body;

      const project = await Project.create({
        name,
        description,
        projectDue,
        adminId: req.user.id,
      });

      res.status(201).json(project);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal membuat proyek", error: error.message });
    }
  },

  // Mendapatkan semua project (hanya untuk admin)
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.findAll();
      res.status(200).json(projects);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal mendapatkan proyek", error: error.message });
    }
  },

  // Mendapatkan project berdasarkan ID (hanya untuk admin)
  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findOne({
        where: { id, adminId: req.user.id },
      });

      if (!project) {
        return res.status(404).json({ message: "Proyek tidak ditemukan" });
      }

      res.status(200).json(project);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal mendapatkan proyek", error: error.message });
    }
  },

  // Memperbarui project (hanya untuk admin)
  updateProject: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .json({
            message:
              "Akses ditolak. Hanya admin yang dapat memperbarui proyek.",
          });
      }

      const { id } = req.params;
      const { name, description, projectDue } = req.body;

      const project = await Project.findOne({
        where: { id, adminId: req.user.id },
      });

      if (!project) {
        return res.status(404).json({ message: "Proyek tidak ditemukan" });
      }

      await project.update({ name, description, projectDue });
      res.status(200).json({ message: "Proyek berhasil diperbarui", project });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal memperbarui proyek", error: error.message });
    }
  },

  // Menghapus project (hanya untuk admin)
  deleteProject: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .json({
            message: "Akses ditolak. Hanya admin yang dapat menghapus proyek.",
          });
      }

      const { id } = req.params;
      const project = await Project.findOne({
        where: { id, adminId: req.user.id },
      });

      if (!project) {
        return res.status(404).json({ message: "Proyek tidak ditemukan" });
      }

      await project.destroy();
      res.status(200).json({ message: "Proyek berhasil dihapus" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Gagal menghapus proyek", error: error.message });
    }
  },
};
