const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    // "mongodb+srv://mohataseem89:fYAkrmsil3qsR8Ks@clusterdev.uf3hyjz.mongodb.net/?retryWrites=true&w=majority&appName=Clusterdev"
    "mongodb+srv://mohataseem89:fYAkrmsil3qsR8Ks@clusterdev.uf3hyjz.mongodb.net/engagedev"
  );
};

module.exports = connectDB;