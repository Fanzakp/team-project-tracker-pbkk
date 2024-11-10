// controllers/userController.js

const { User } = require("../models");

const updateUserRole = async (req, res) => {
  try {
    // Pastikan pengakses adalah admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message:
          "Akses ditolak. Hanya admin yang dapat mengubah peran pengguna.",
      });
    }

    const { id } = req.params;
    const { isAdmin } = req.body;

    // Temukan pengguna berdasarkan ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    // Update peran pengguna
    await user.update({ isAdmin });

    res.status(200).json({
      message: "Peran pengguna berhasil diperbarui.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Gagal memperbarui peran pengguna.",
      error: error.message,
    });
  }
};

module.exports = {
  updateUserRole,
  // Fungsi lain jika ada
};