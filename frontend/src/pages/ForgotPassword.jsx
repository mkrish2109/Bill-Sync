import { Button, Card, Label, TextInput } from "flowbite-react";
import React from "react";
import { forgotPassword } from "../services/apiServices";
import { toast } from "react-toastify";

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
    <div className="p-8 flex items-center justify-center">
      <Card className="w-[400px]">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              type="email"
              name="email"
              placeholder="your email"
              required
            />
          </div>
          <Button  color="primary" type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
}

export default ForgotPassword;
