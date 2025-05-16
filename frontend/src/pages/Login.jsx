import { Button, Label, TextInput } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../components/comman/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchUser } from "../redux/slices/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const redirectTimeoutRef = useRef(null);

  const { loading, error, user } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("Please fill in all fields.");
        return;
      }

      const loginResponse = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(loginResponse)) {
        const userId = loginResponse.payload.data.userId;
        
        // Show success message immediately
        toast.success("Login successful!", {
          pauseOnFocusLoss: false,
        });
        // Fetch user data in the background
        const userResponse = await dispatch(fetchUser(userId));
        
        if (fetchUser.fulfilled.match(userResponse)) {
          const role = userResponse.payload.role;
          
          // Navigate after a slight delay for better UX
          redirectTimeoutRef.current = setTimeout(() => {
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
          }, 1500); // 1.5 second delay for the user to see the success message
        } else {
          toast.error(userResponse.payload?.message || "Failed to fetch user info.");
        }
      } else {
        toast.error(loginResponse.payload?.message || "Login failed!");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong during login.");
    }
  };

  useEffect(() => {
    // Clean up timeout on unmount
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)] bg-background-secondaryLight dark:bg-background-secondaryDark">
      <form
        className="p-8 rounded-lg min-w-[300px] max-w-md flex shadow-xl flex-col gap-4 bg-background-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
        onSubmit={handleSubmit}
      >
        <div>
          <Label 
            htmlFor="email" 
            value="Your email" 
            className="mb-2 block text-text-light dark:text-text-dark" 
          />
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            required
            value={email}
            className="bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label 
            htmlFor="password" 
            value="Your password" 
            className="mb-2 block text-text-light dark:text-text-dark" 
          />
          <div className="relative">
            <PasswordInput
              id="password"
              name="password"
              value={password}
              className="bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Link 
          to="/forgot-password" 
          className="text-sm underline text-secondary-light hover:text-primary-light dark:text-secondary-dark dark:hover:text-primary-dark"
        >
          Forgot password?
        </Link>

        <Button
          color="primary"
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : "Login"}
        </Button>

        <p className="text-center text-secondary-light dark:text-secondary-dark">OR</p>
        
        <Link
          to="/register"
          className="text-center underline hover:underline-offset-4 text-secondary-light hover:text-primary-light dark:text-secondary-dark dark:hover:text-primary-dark"
        >
          Don't have an account? Register
        </Link>
      </form>
    </div>
  );
}

export default Login;