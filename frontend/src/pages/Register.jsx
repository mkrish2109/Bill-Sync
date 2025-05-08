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
    <div className="items-center justify-center flex h-[calc(100vh-88px-90px)]">
      <form
        className="flex max-w-md flex-col gap-4 shadow-xl p-7 rounded-lg w-full"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
          <div>
            <Label htmlFor="fname" value="First Name" className="mb-2 block" />
            <TextInput
              id="fname"
              name="fname"
              type="text"
              placeholder="John"
              required
              onChange={(e) => setForm({ ...form, fname: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="lname" value="Last Name" className="mb-2 block" />
            <TextInput
              id="lname"
              name="lname"
              type="text"
              placeholder="Doe"
              required
              onChange={(e) => setForm({ ...form, lname: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" value="Email" className="mb-2 block" />
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="phone" value="Phone Number" className="mb-2 block" />
          <TextInput
            typeof="tel"
            id="phone"
            name="phone"
            type="phone"
            placeholder="(123) 456-7890"
            required
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="password" value="Password" className="mb-2 block" />
          <div className="relative">
            <PasswordInput label="Your password" id="password" name="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
        </div>

        <div>
          <Label
            htmlFor="role"
            value="Select Role"
            className="mb-2 block"
          />
          <Select
            id="role"
            name="role"
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
          className="bg-[#BCFD4C] text-black enabled:hover:bg-[#9aec0c]"
        >
          Register new account
        </Button>

        <p className="text-center">OR</p>
        <Link
          to="/login"
          className="text-center underline hover:underline-offset-4 hover:text-[#13160d]"
        >
          Login
        </Link>
      </form>
    </div>
  );
}

export default Register;
