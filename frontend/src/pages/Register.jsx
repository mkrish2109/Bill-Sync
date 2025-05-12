import bcrypt from 'bcryptjs';
import { Button, Label, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/comman/PasswordInput";
import { api } from "../api";

function Register() {
  const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '', role: 'buyer' });
  const navigate = useNavigate();

  // Hash the password before submitting
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Hash the password using bcryptjs
      const hashedPassword = await bcrypt.hash(form.password, 10);
      
      // Update the form data with the hashed password
      const formDataWithHashedPassword = { ...form, password: hashedPassword };

      // Send the hashed password to the backend
      await api.post('/auth/register', formDataWithHashedPassword);
      navigate('/login');
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  };

  return (
  <div className="items-center justify-center flex h-[calc(100vh-88px-90px)] bg-gray-50 dark:bg-gray-900">
    <form
      className="flex max-w-md flex-col gap-4 shadow-xl p-7 rounded-lg w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label 
            htmlFor="fname" 
            value="First Name" 
            className="mb-2 block text-gray-700 dark:text-gray-300" 
          />
          <TextInput
            id="fname"
            name="fname"
            type="text"
            placeholder="John"
            required
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-[#BCFD4C] focus:ring-[#BCFD4C]"
            onChange={(e) => setForm({ ...form, fname: e.target.value })}
          />
        </div>
        <div>
          <Label 
            htmlFor="lname" 
            value="Last Name" 
            className="mb-2 block text-gray-700 dark:text-gray-300" 
          />
          <TextInput
            id="lname"
            name="lname"
            type="text"
            placeholder="Doe"
            required
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-[#BCFD4C] focus:ring-[#BCFD4C]"
            onChange={(e) => setForm({ ...form, lname: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label 
          htmlFor="email" 
          value="Email" 
          className="mb-2 block text-gray-700 dark:text-gray-300" 
        />
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-[#BCFD4C] focus:ring-[#BCFD4C]"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <Label 
          htmlFor="phone" 
          value="Phone Number" 
          className="mb-2 block text-gray-700 dark:text-gray-300" 
        />
        <TextInput
          id="phone"
          name="phone"
          type="tel"
          placeholder="(123) 456-7890"
          required
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-[#BCFD4C] focus:ring-[#BCFD4C]"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div>
        <Label 
          htmlFor="password" 
          value="Password" 
          className="mb-2 block text-gray-700 dark:text-gray-300" 
        />
        <div className="relative">
          <PasswordInput 
            id="password" 
            name="password"
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-[#BCFD4C] focus:ring-[#BCFD4C]"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="role"
          value="Select Role"
          className="mb-2 block text-gray-700 dark:text-gray-300"
        />
        <Select
          id="role"
          name="role"
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-[#BCFD4C] focus:ring-[#BCFD4C]"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
        </Select>
      </div>

      <Button
        color="primary"
        type="submit"
        className="bg-[#BCFD4C] text-black enabled:hover:bg-[#9aec0c] dark:enabled:hover:bg-[#8cdb0a]"
      >
        Register new account
      </Button>

      <p className="text-center text-gray-600 dark:text-gray-400">OR</p>
      
      <Link
        to="/login"
        className="text-center underline hover:underline-offset-4 text-gray-600 hover:text-[#BCFD4C] dark:text-gray-400 dark:hover:text-[#BCFD4C]"
      >
        Login
      </Link>
    </form>
  </div>
  );
}

export default Register;
