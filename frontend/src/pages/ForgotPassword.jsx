import { Button, Card, Label, TextInput } from "flowbite-react";
import React from "react";
import { forgotPassword } from "../services/apiServices";
import { toast } from "react-toastify";
import { PageMeta } from "../components/common/PageMeta";

function ForgotPassword() {
  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      email: e.target["email"].value,
    };

    const response = await forgotPassword(data);

    if (response.success) {
      return toast.success(response.msg);
    } else {
      toast.error(response.msg);
    }
  }

  return (
    <>
      <PageMeta
        title="Forgot Password | Bill Sync"
        description="Reset your Bill Sync account password securely. Follow our simple steps to regain access to your account."
        keywords="password reset, forgot password, account recovery, secure password reset"
      />
      <div className="p-8 flex items-center justify-center min-h-screen bg-background-surfaceLight dark:bg-background-surfaceDark">
        <Card className="w-[400px] bg-background-surfaceLight dark:bg-background-surfaceDark border border-gray-200 dark:border-gray-700 shadow-lg">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="email"
                  value="Email"
                  className="text-text-light dark:text-text-dark"
                />
              </div>
              <TextInput
                id="email"
                type="email"
                name="email"
                placeholder="your email"
                required
                className="bg-background-surfaceLight dark:bg-background-surfaceDark text-text-light dark:text-text-dark border-gray-200 dark:border-gray-700"
              />
            </div>
            <Button
              color="primary"
              type="submit"
              className="bg-primary-light hover:bg-primary-hoverLight dark:bg-primary-dark dark:hover:bg-primary-hoverDark text-text-light dark:text-text-dark"
            >
              Submit
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default ForgotPassword;
