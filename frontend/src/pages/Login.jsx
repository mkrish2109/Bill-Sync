import { Button, Label, TextInput } from "flowbite-react";
import  { useState, useEffect } from "react";
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

  const { loading, error } = useSelector((state) => state.user);

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
  <div className="items-center flex justify-center h-[calc(100vh-88px-90px)] bg-gray-50 dark:bg-gray-900">
    <form
      className="p-8 rounded-lg min-w-[300px] max-w-md flex shadow-xl flex-col gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      onSubmit={handleSubmit}
    >
      <div>
        <Label 
          htmlFor="email" 
          value="Your email" 
          className="mb-2 block text-gray-700 dark:text-gray-300" 
        />
        <TextInput
          id="email"
          type="email"
          name="email"
          placeholder="name@example.com"
          required
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-[#BCFD4C] focus:ring-[#BCFD4C]"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label 
          htmlFor="password" 
          value="Your password" 
          className="mb-2 block text-gray-700 dark:text-gray-300" 
        />
        <div className="relative">
          <PasswordInput
            id="password"
            name="password"
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-[#BCFD4C] focus:ring-[#BCFD4C]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <Link 
        to="/forgot-password" 
        className="text-sm underline text-gray-600 hover:text-[#BCFD4C] dark:text-gray-400 dark:hover:text-[#BCFD4C]"
      >
        Forgot password?
      </Link>

      <Button
        color="primary"
        type="submit"
        className="bg-[#BCFD4C] text-black enabled:hover:bg-[#9aec0c] dark:enabled:hover:bg-[#8cdb0a]"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </span>
        ) : "Login"}
      </Button>

      <p className="text-center text-gray-600 dark:text-gray-400">OR</p>
      
      <Link
        to="/register"
        className="text-center underline hover:underline-offset-4 text-gray-600 hover:text-[#BCFD4C] dark:text-gray-400 dark:hover:text-[#BCFD4C]"
      >
        Register
      </Link>
    </form>
  </div>
  );
}

export default Login;
