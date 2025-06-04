import { TextInput, Label } from "flowbite-react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import React, { useState } from "react";

const PasswordInput = ({ label, id, name, required = true, onChange, autoComplete = "current-password" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && <Label htmlFor={id} value={label} className="mb-2 block" />}
      <div className="relative">
        <TextInput
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          onChange={onChange}
          autoComplete={autoComplete}
          className="[&>div>input]:pr-[33px]"
        />
        {visible ? (
          <HiEyeOff
            onClick={() => setVisible(false)}
            className="text-2xl cursor-pointer absolute top-[50%] translate-y-[-50%] right-[8px]"
          />
        ) : (
          <HiEye
            onClick={() => setVisible(true)}
            className="text-2xl cursor-pointer absolute top-[50%] translate-y-[-50%] right-[8px]"
          />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
