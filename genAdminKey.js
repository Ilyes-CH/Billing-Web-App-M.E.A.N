const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const AdminKey = require('./backend/models/passKey');
require('dotenv').config({ path: './backend/main/.env' });


mongoose.connect('mongodb://localhost:27017/bootcamp_management')

async function generateAdminKey() {
  const ADMINKEY = process.env.ADMIN_KEY;
  const hashedKey = await bcrypt.hash(ADMINKEY, 16);

  const adminKeyRecord = new AdminKey({ key: hashedKey });
  await adminKeyRecord.save();

  console.log("Admin key generated and saved to the database.");
  console.log(`Use this key for creating admin: ${ADMINKEY}`);

}

generateAdminKey();
