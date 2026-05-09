import mongoose from 'mongoose';

// ── User ──────────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  fatherContact: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  altContact: { type: String },
  program: { type: String, required: true, enum: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA'] },
  permanant_address: { type: String, required: true },
  counslerName: { type: String, required: true },
  entranceTest: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ── OTP ───────────────────────────────────────────────────────────────────────
const otpSchema = new mongoose.Schema(
  {
    contact: {
      type: String,
      required: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export const StudentCounsiling = mongoose.models.StudentCounsiling || mongoose.model('StudentCounsiling', UserSchema);
export const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);