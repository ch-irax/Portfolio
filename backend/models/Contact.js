/**
 * Contact Model
 * Mongoose schema and methods for contact form submissions
 */

import mongoose from 'mongoose';

// Define the contact schema
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: 'submitted_at',
      updatedAt: false,
    },
  }
);

// Create model (use existing model if already created)
const Contact =
  mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// Export static methods
Contact.createSubmission = async function (name, email, message) {
  const contact = new Contact({ name, email, message });
  return await contact.save();
};

Contact.getAll = async function () {
  return await Contact.find().sort({ submitted_at: -1 });
};

Contact.getById = async function (id) {
  return await Contact.findById(id);
};

Contact.delete = async function (id) {
  const result = await Contact.findByIdAndDelete(id);
  return result ? true : false;
};

export default Contact;
