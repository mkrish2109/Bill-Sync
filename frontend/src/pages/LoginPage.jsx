import { Button, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../components/common/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/userSlice";
import { PageMeta } from "../components/common/PageMeta";
import { useRoleRedirect } from "../hooks/useRoleRedirect";
import LoadingSpinner from "../components/common/LoadingSpinner";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();

  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  const redirectToRoleDashboard = useRoleRedirect(user, (errMsg) =>
    toast.error(errMsg)
  );

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectToRoleDashboard();
    }
  }, [isAuthenticated, user, redirectToRoleDashboard]);

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
      const loginResponse = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(loginResponse)) {
        toast.success(loginResponse.payload?.message || "Login successful!");
        // Use the hook to fetch user and redirect
        await redirectToRoleDashboard();
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

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)] bg-gradient-to-br from-background-surfaceLight to-background-light dark:from-background-surfaceDark dark:to-background-dark">
      <PageMeta title="Login | Bill Sync" />

      <div className="w-full max-w-md px-4 py-8">
        <div className="p-8 rounded-lg shadow-xl bg-background-elevatedLight dark:bg-background-elevatedDark border border-border-light dark:border-border-dark">
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
                className="w-full bg-background-elevatedLight dark:bg-background-elevatedDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
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
                  className="text-sm underline text-secondary-light hover:text-primary-light dark:text-text-secondaryDark dark:hover:text-primary-dark"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                className="w-full bg-background-elevatedLight dark:bg-background-elevatedDark text-text-light dark:text-text-dark border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
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
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-text-light dark:text-text-dark"
              >
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
                <LoadingSpinner inline text="Logging in..." />
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="text-center text-sm text-secondary-light dark:text-text-secondaryDark">
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

export default LoginPage;
