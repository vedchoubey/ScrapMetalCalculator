const mongoose = require("mongoose");

const MetalConfigSchema = new mongoose.Schema({
  metalType: {
    type: String,
    required: true,
  },
});
