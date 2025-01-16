import Admin from '../Models/adminModel.js';
import bcrypt from 'bcrypt';


export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "superadmin"
    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Save the admin to the database
    await newAdmin.save();

    // Respond with success
    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role:newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
