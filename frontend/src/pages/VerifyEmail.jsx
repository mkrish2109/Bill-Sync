import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/apiServices"; // Ensure this imports the correct verifyEmail function
import { toast } from "react-toastify";
import { api } from "../helper/apiHelper";

function VerifyEmail() {
  const navigate = useNavigate();
  const params = useSearchParams();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const data = {
      verificationToken: params[0].get("token"),
      email: params[0].get("email"),
    };

    async function verify() {
      // console.log("Verifying email with data: verify", data);
      try {
        const response = await api.post('/auth/verify-email', data);
        if( "Email is already verified." === response.data.message) {
          toast.success(response.message);
          setVerified(true);
          return;
        }
        if (response.success) {
          toast.success(response.message);
        } else {
          console.warn("Verification failed: ", response.message);
          toast.error(response.message);
        }
        // if (!response.
        setVerified(response.success);
      } catch (error) {
        console.error("Verification failed: ", error.message);
        toast.error("Something went wrong.");
        
      }
      
    }

    verify();
  }, [params]);

  function goToHome() {
    navigate("/");
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">
          {verified ? "Verified" : "Verifying Email..."}
        </h2>

        <Button
          color="primary"
          className="w-fit"
          onClick={goToHome}
          disabled={!verified}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}

export default VerifyEmail;
