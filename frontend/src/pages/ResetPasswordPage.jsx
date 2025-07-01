import { Button, Card, Label } from "flowbite-react";
import React, { useState } from "react";
import { resetPassword } from "../services/apiServices";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PasswordInput from "../components/common/PasswordInput";
import bcrypt from "bcryptjs";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newPassword = e.target["newPassword"].value.trim();
      const confirmPassword = e.target["confirmNewPassword"].value.trim();

      // Validate passwords match
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      // Validate password strength
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        toast.error(passwordError);
        return;
      }

      // Hash the password before sending
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const data = {
        token,
        email,
        password: hashedPassword,
      };

      const response = await resetPassword(data);

      if (response.success) {
        toast.success(
          "Password reset successful! Please login with your new password."
        );
        navigate("/login");
      } else {
        toast.error(response.msg || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred while resetting your password");
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-surfaceDark">
      <Card className="w-[400px] bg-background-surfaceLight dark:bg-background-surfaceDark border border-gray-200 dark:border-gray-700 shadow-lg">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="newPassword" value="New password" className="text-text-light dark:text-text-dark" />
            </div>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
              required
              autoComplete="new-password"
              disabled={isLoading}
              className="bg-background-surfaceLight dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-gray-200 dark:border-gray-700"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="confirmNewPassword"
                value="Confirm new password"
                className="text-text-light dark:text-text-dark"
              />
            </div>
            <PasswordInput
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Confirm your new password"
              required
              autoComplete="new-password"
              disabled={isLoading}
              className="bg-background-surfaceLight dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-gray-200 dark:border-gray-700"
            />
          </div>
          <Button 
            color="primary" 
            type="submit" 
            disabled={isLoading}
            className="bg-primary-light hover:bg-primary-hoverLight dark:bg-primary-dark dark:hover:bg-primary-hoverDark text-text-light dark:text-text-dark"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
