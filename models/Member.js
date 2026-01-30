import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Admin" },
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);