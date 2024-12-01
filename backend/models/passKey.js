const mongoose = require("mongoose");

const adminKeySchema = mongoose.Schema({
 key : {type:String,required:true}
});

// Create the model
const AdminKey = mongoose.model("AdminKey", adminKeySchema);

// Export the model
module.exports = AdminKey;
