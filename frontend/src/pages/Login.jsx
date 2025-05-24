import { Button, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../components/common/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchUser } from "../redux/slices/userSlice";
import { PageMeta } from "../components/common/PageMeta";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const loginResponse = await dispatch(loginUser({ email, password, rememberMe }));

      if (loginUser.fulfilled.match(loginResponse)) {
        const userId = loginResponse.payload.data.userId;

        const userResponse = await dispatch(fetchUser(userId));
        if (fetchUser.fulfilled.match(userResponse)) {
          const role = userResponse.payload.role;
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
    // Check for remembered credentials
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
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
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)] bg-gradient-to-br from-background-secondaryLight to-background-light dark:from-background-secondaryDark dark:to-surface-dark">
      <PageMeta title="Login | Text Bill" />
      
      <div className="w-full max-w-md px-4 py-8">
        <div className="p-8 rounded-lg shadow-xl bg-background-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
          <h1 className="text-2xl font-bold text-center mb-6 text-text-light dark:text-text-dark">
            Welcome Back
          </h1>
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label 
                htmlFor="email" 
                value="Email address" 
                className="mb-2 block text-text-light dark:text-text-dark" 
              />
              <TextInput
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                value={email}
                className="w-full bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label 
                  htmlFor="password" 
                  value="Password" 
                  className="text-text-light dark:text-text-dark" 
                />
                <Link 
                  to="/forgot-password" 
                  className="text-sm underline text-secondary-light hover:text-primary-light dark:text-secondary-dark dark:hover:text-primary-dark"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                className="w-full bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border-light dark:border-border-dark text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-light dark:text-text-dark">
                Remember me
              </label>
            </div>

            <Button
              color="primary"
              type="submit"
              disabled={loading}
              className="w-full mt-2"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : "Sign in"}
            </Button>


            <div className="text-center text-sm text-secondary-light dark:text-secondary-dark">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium underline hover:underline-offset-4 text-primary-light hover:text-accent-light dark:text-primary-dark dark:hover:text-accent-dark"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;