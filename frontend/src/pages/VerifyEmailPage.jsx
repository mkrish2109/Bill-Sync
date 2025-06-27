import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../helper/apiHelper";
import { Button, Spinner } from "flowbite-react";
import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchUser } from "../store/slices/userSlice";
import { useRoleRedirect } from "../hooks/useRoleRedirect";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  const toastShownRef = React.useRef(false);

  const redirectToRoleDashboard = useRoleRedirect(null, (errMsg) =>
    toast.error(errMsg)
  );

  useEffect(() => {
    async function verifyEmail() {
      if (!token || !email) {
        setError("Invalid verification link");
        setLoading(false);
        if (!toastShownRef.current) {
          toast.error("Invalid verification link.", {
            className: "bg-error-base text-error-text",
          });
          toastShownRef.current = true;
        }
        return;
      }

      const data = { verificationToken: token, email };

      try {
        const response = await api.post("/auth/verify-email", data);

        if (response.data.success) {
          setVerified(true);
          if (!toastShownRef.current) {
            toast.success(response.data.message, {
              className: "bg-success-base text-success-text",
            });
            toastShownRef.current = true;
          }
        }
      } catch (error) {
        if (error.response?.status === 409) {
          setVerified(true);
          if (!toastShownRef.current) {
            toast.info(error.response.data.message, {
              className: "bg-info-base text-info-text",
            });
            toastShownRef.current = true;
          }
        } else {
          setError(error.response?.data?.message || "Verification failed");
          if (!toastShownRef.current) {
            toast.error(
              error.response?.data?.message ||
                "Something went wrong. Please try again.",
              {
                className: "bg-error-base text-error-text",
              }
            );
            toastShownRef.current = true;
          }
        }
      } finally {
        setLoading(false);
      }
    }

    verifyEmail();

    return () => {
      toast.dismiss();
    };
  }, [token, email]);

  const handleDashboard = async () => {
    setRedirecting(true);
    try {
      // First try to fetch user without login (if already authenticated)
      const userResponse = await dispatch(fetchUser());

      if (fetchUser.fulfilled.match(userResponse)) {
        // User is already logged in, redirect based on role
        await redirectToRoleDashboard();
      } else {
        // If not logged in, redirect to login page
        navigate("/login");
      }
    } catch (err) {
      console.error("Dashboard redirection error:", err);
      navigate("/");
    } finally {
      setRedirecting(false);
    }
  };

  const resendVerification = () => {
    toast.info("Verification email resent!", {
      className: "bg-info-base text-info-text",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-surfaceLight dark:bg-background-surfaceDark p-4">
      <div className="bg-background-elevatedLight dark:bg-background-elevatedDark shadow-card dark:shadow-card-dark rounded-2xl p-8 max-w-md w-full text-center transition-all duration-300 hover:shadow-lg dark:hover:shadow-lg">
        <div className="flex justify-center mb-6">
          {loading || redirecting ? (
            <div className="p-4 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full">
              <FaEnvelope className="text-primary-light dark:text-primary-dark text-5xl animate-pulse" />
            </div>
          ) : verified ? (
            <div className="p-4 bg-success-base/10 rounded-full">
              <FaCheckCircle className="text-success-base text-5xl" />
            </div>
          ) : (
            <div className="p-4 bg-error-base/10 rounded-full">
              <FaTimesCircle className="text-error-base text-5xl" />
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold mb-2 text-text-light dark:text-text-dark">
          {loading
            ? "Verifying Email..."
            : redirecting
            ? "Redirecting..."
            : verified
            ? "Email Verified!"
            : "Verification Failed"}
        </h2>

        <p className="text-text-secondaryLight dark:text-text-secondaryDark mb-6">
          {loading
            ? "Please wait while we verify your email address."
            : redirecting
            ? "Taking you to your dashboard..."
            : verified
            ? "Your email has been successfully verified."
            : error || "The verification link is invalid or has expired."}
        </p>

        {(loading || redirecting) && (
          <div className="flex flex-col items-center">
            <Spinner
              size="xl"
              color="info"
              aria-label={loading ? "Verifying..." : "Redirecting..."}
              className="text-primary-light dark:text-primary-dark"
            />
            <p className="mt-3 text-text-mutedLight dark:text-text-mutedDark">
              Please wait...
            </p>
          </div>
        )}

        {!loading && !redirecting && (
          <div className="space-y-4">
            <Button
              color={verified ? "green" : "red"}
              onClick={verified ? handleDashboard : () => navigate("/")}
              className="w-full py-3 rounded-lg font-medium"
              size="lg"
            >
              {verified ? "Continue to Dashboard" : "Back to Home"}
            </Button>

            {!verified && (
              <Button
                color="light"
                onClick={resendVerification}
                className="w-full py-3 rounded-lg font-medium bg-secondary-light hover:bg-secondary-hoverLight dark:bg-secondary-dark dark:hover:bg-secondary-hoverDark text-text-light dark:text-text-dark"
                size="lg"
              >
                Resend Verification Email
              </Button>
            )}
          </div>
        )}

        <p className="mt-6 text-sm text-text-mutedLight dark:text-text-mutedDark">
          {verified
            ? "Thank you for verifying your email!"
            : "Need help? Contact our support team."}
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
