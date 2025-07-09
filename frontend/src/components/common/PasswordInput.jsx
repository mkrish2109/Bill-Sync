import { TextInput, Label } from "flowbite-react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import React, { useState } from "react";

const PasswordInput = ({ label, id, name, required = true, onChange, autoComplete = "current-password",placeholder }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
       <Label htmlFor={id} value={label} className="mb-2 block" />
      <div className="relative">
        <TextInput
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="[&>div>input]:pr-[33px] text-text-light dark:text-text-dark "
        />
        {visible ? (
          <HiEyeOff
            onClick={() => setVisible(false)}
            className="text-2xl cursor-pointer absolute top-[50%] translate-y-[-50%] right-[8px] text-text-light dark:text-text-dark"
          />
        ) : (
          <HiEye
            onClick={() => setVisible(true)}
            className="text-2xl cursor-pointer absolute top-[50%] translate-y-[-50%] right-[8px] text-text-light dark:text-text-dark"
          />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
