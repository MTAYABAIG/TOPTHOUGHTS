const bcrypt = require('bcryptjs');
const { AdminUser } = require('../models');

const initializeAdmin = async () => {
  try {
    const existingAdmin = await AdminUser.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new AdminUser({
        username: 'admin',
        password: hashedPassword,
      });
      await admin.save();
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

module.exports = {
  initializeAdmin,
};