const AdminKey = require('../models/passKey');
const User = require('../models/user')
const bcrypt = require('bcrypt')


// Middleware to check if admin exists and handle admin creation
async function checkAdmin(req, res, next) {
  const { adminKey } = req.body;
  const userCount = await User.countDocuments();

  if (userCount === 0) {
    const storedAdminKey = await AdminKey.findOne();
    if (!storedAdminKey) {
      return res.status(400).json({ message: 'No admin key available' });
    }

    const keyMatch = await bcrypt.compare(adminKey, storedAdminKey.key);
    if (!keyMatch) {
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    const newAdmin = {
      ...req.body,
      role: 'Admin'
    };
    const hashedPassword = await bcrypt.hash(newAdmin.password, 8);
    newAdmin.password = hashedPassword;

    const adminUser = new User(newAdmin);
    await adminUser.save();

    // Remove the admin key after creating the admin
    await AdminKey.deleteMany();

    return res.status(201).json({ message: 'Admin user created' });
  } else {

    next();
  }
}
 module.exports = checkAdmin;
