const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Employee = require('./models/Employee');
require('dotenv').config();

const resolvers = {
  Query: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    },

    getAllEmployees: async () => await Employee.find(),

    searchEmployeeById: async (_, { eid }) => {
      const employee = await Employee.findById(eid);
      if (!employee) throw new Error("Employee not found");
      return employee;
    },

    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      const query = {};
      if (designation) query.designation = designation;
      if (department) query.department = department;
      return await Employee.find(query);
    }
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      return await newUser.save();
    },

    addEmployee: async (_, args) => {
      const newEmployee = new Employee(args);
      return await newEmployee.save();
    },

    updateEmployeeById: async (_, { eid, ...updates }) => {
      const employee = await Employee.findByIdAndUpdate(eid, updates, { new: true });
      if (!employee) throw new Error("Employee not found");
      return employee;
    },

    deleteEmployeeById: async (_, { eid }) => {
      const employee = await Employee.findByIdAndDelete(eid);
      if (!employee) throw new Error("Employee not found");
      return "Employee deleted successfully";
    }
  }
};

module.exports = resolvers;
