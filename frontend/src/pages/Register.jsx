import bcrypt from 'bcryptjs';
import { Button, Label, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/comman/PasswordInput";
import { api } from "../helper/apiHelper";
import { toast } from "react-toastify";

function Register() {
  const [form, setForm] = useState({ 
    fname: '', 
    lname: '', 
    email: '', 
    phone: '',
    password: '', 
    role: 'buyer' 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Hash the password using bcryptjs
      const hashedPassword = await bcrypt.hash(form.password, 10);
      
      // Update the form data with the hashed password
      const formDataWithHashedPassword = { ...form, password: hashedPassword };

      // Send the hashed password to the backend
      await api.post('/auth/register', formDataWithHashedPassword);
      toast.success("Registration successful! Please login.");
      navigate('/login');
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="items-center justify-center flex min-h-[calc(100vh-65px)] bg-background-secondaryLight dark:bg-background-secondaryDark">
      <form
        className="flex max-w-md flex-col mx-3 gap-4 shadow-xl p-7 rounded-lg w-full bg-background-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label 
              htmlFor="fname" 
              value="First Name" 
              className="mb-2 block text-text-light dark:text-text-dark" 
            />
            <TextInput
              id="fname"
              name="fname"
              type="text"
              placeholder="John"
              required
              className="bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => setForm({ ...form, fname: e.target.value })}
            />
          </div>
          <div>
            <Label 
              htmlFor="lname" 
              value="Last Name" 
              className="mb-2 block text-text-light dark:text-text-dark" 
            />
            <TextInput
              id="lname"
              name="lname"
              type="text"
              placeholder="Doe"
              required
              className="bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => setForm({ ...form, lname: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label 
            htmlFor="email" 
            value="Email" 
            className="mb-2 block text-text-light dark:text-text-dark" 
          />
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <Label 
            htmlFor="phone" 
            value="Phone Number" 
            className="mb-2 block text-text-light dark:text-text-dark" 
          />
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            placeholder="(123) 456-7890"
            required
            className="bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <Label 
            htmlFor="password" 
            value="Password" 
            className="mb-2 block text-text-light dark:text-text-dark" 
          />
          <div className="relative">
            <PasswordInput 
              id="password" 
              name="password"
              className="bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="role"
            value="Select Role"
            className="mb-2 block text-text-light dark:text-text-dark"
          />
          <Select
            id="role"
            name="role"
            className="bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
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
          // className="bg-primary-light hover:bg-accent-light dark:bg-primary-dark dark:hover:bg-accent-dark text-white"
        >
          Register new account
        </Button>

        <p className="text-center text-secondary-light dark:text-secondary-dark">OR</p>
        
        <Link
          to="/login"
          className="text-center underline hover:underline-offset-4 text-secondary-light hover:text-primary-light dark:text-secondary-dark dark:hover:text-primary-dark"
        >
          Login
        </Link>
      </form>
    </div>
  );
}

export default Register;