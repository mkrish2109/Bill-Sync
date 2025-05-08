import bcrypt from "bcryptjs";
import { Button, Label, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../components/comman/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/userSlice";
// import { loginUser } from "../store/slices/userSlice"; // adjust path if needed

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please fill in all fields.");
        return;
      }

      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        const role = resultAction.payload.data.role;

        localStorage.setItem("token", resultAction.payload.token);
        localStorage.setItem("role", role);

        toast.success("Login successful!");

        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "buyer") navigate("/buyer/dashboard");
        else navigate("/worker/dashboard");
      } else {
        toast.error(resultAction.payload?.message || "Login failed!");
      }
    } catch (err) {
      toast.error("Something went wrong during login.");
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="items-center flex justify-center h-[calc(100vh-88px-90px)]">
      <form
        className="p-8 rounded-lg min-w-[300px] max-w-md flex shadow-xl flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="email" value="Your email" className="mb-2 block" />
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password" value="Your password" className="mb-2 block" />
          <div className="relative">
            <PasswordInput
              label="Your password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Link to="/forgot-password" className="text-sm underline">
          Forgot password?
        </Link>

        <Button
          color="primary"
          type="submit"
          className="bg-[#BCFD4C] text-black enabled:hover:bg-[#9aec0c]"
          isProcessing={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center">OR</p>
        <Link
          to="/register"
          className="text-center underline hover:underline-offset-4 hover:text-[#13160d]"
        >
          Register
        </Link>
      </form>
    </div>
  );
}

export default Login;
