import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  status: { type: String, enum: ["Lead", "Active", "Inactive"], default: "Lead" },
  // This links a customer to a member!
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Member" } 
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);