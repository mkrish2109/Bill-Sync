import { Button, Card, Label, TextInput } from "flowbite-react";
import React from "react";
import { resetPassword } from "../services/apiServices";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from 'bcryptjs';

function ResetPassword() {
  const [searchParams, setSearchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      e.target["newPassword"].value !== e.target["confirmNewPassword"].value
    ) {
      alert("Passwords did not match!");
    }

    const data = {
      token,
      email,
      password: e.target["newPassword"].value,
    };
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    

    const response = await resetPassword(data);

    if (response.success) {
      return toast.success(response.msg);
    } else {
      toast.error(response.msg);
    }
  }
  return (
    <div className="p-8 flex items-center justify-center">
      <Card className="w-[400px]">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="newPassword" value="New password" />
            </div>
            <TextInput
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="your new password"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="confirmNewPassword"
                value="Confirm new password"
              />
            </div>
            <TextInput
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              placeholder="confirm password"
              required
            />
          </div>
          <Button color="primary" type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
}

export default ResetPassword;
