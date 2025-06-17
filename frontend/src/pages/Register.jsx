import { Button, Label, Select, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/common/PasswordInput";
import { api } from "../helper/apiHelper";
import { toast } from "react-toastify";
import { PageMeta } from "../components/common/PageMeta";
import bcrypt from "bcryptjs";
import { useSelector } from "react-redux";

function Register() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "buyer":
          navigate("/buyer/dashboard");
          break;
        case "worker":
          navigate("/worker/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordValidationError = validatePassword(form.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error(passwordValidationError);
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone number format
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(form.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const hashedPassword = await bcrypt.hash(form.password, 10);
    form.password = hashedPassword;

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/register", form);
      if (response.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear password error when user starts typing
    if (name === "password") {
      setPasswordError("");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = value;

    if (value.length > 3 && value.length <= 6) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(
        3,
        6
      )}-${value.slice(6, 10)}`;
    }

    setForm((prev) => ({ ...prev, phone: formattedValue }));
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)] bg-gradient-to-br from-background-surfaceLight to-background-light dark:from-background-surfaceDark dark:to-background-surfaceDark">
      <PageMeta title="Register | Bill Sync" />
      <div className="w-full max-w-md px-4 py-8">
        <div className="p-8 rounded-lg shadow-xl bg-background-light dark:bg-background-surfaceDark border border-border-light dark:border-border-dark">
          <h1 className="text-2xl font-bold text-center mb-6 text-text-light dark:text-text-dark">
            Create an Account
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full bg-background-light dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                  onChange={handleInputChange}
                  autoComplete="given-name"
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
                  className="w-full bg-background-light dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                  onChange={handleInputChange}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="email"
                value="Email Address"
                className="mb-2 block text-text-light dark:text-text-dark"
              />
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="w-full bg-background-light dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                onChange={handleInputChange}
                autoComplete="email"
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
                value={form.phone}
                className="w-full bg-background-light dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                onChange={handlePhoneChange}
                autoComplete="tel"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                value="Password"
                className="mb-2 block text-text-light dark:text-text-dark"
              />
              <PasswordInput
                id="password"
                name="password"
                value={form.password}
                className="w-full bg-background-light dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                onChange={handleInputChange}
                autoComplete="new-password"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {passwordError}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                value="Confirm Password"
                className="mb-2 block text-text-light dark:text-text-dark"
              />
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                className="w-full bg-background-light dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                onChange={handleInputChange}
                autoComplete="new-password"
              />
            </div>

            <div>
              <Label
                htmlFor="role"
                value="Account Type"
                className="mb-2 block text-text-light dark:text-text-dark"
              />
              <Select
                id="role"
                name="role"
                className="w-full bg-background-light dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                onChange={handleInputChange}
                value={form.role}
              >
                <option value="buyer">Buyer</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </Select>
            </div>

            <Button
              color="primary"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign up"
              )}
            </Button>

            <div className="text-center text-sm text-secondary-light dark:text-text-secondaryDark">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium underline hover:underline-offset-4 text-primary-light hover:text-accent-light dark:text-primary-dark dark:hover:text-accent-dark"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
