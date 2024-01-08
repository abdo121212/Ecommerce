import mongoose from "mongoose";

export const connetedDB = async () => {
  await mongoose
    .connect(process.env.CONNECTED_DB)
    .then(() => console.log("Connection DB successfully! "))
    .catch((error) => console.log("error", +error));
};
