// toastHelpers.js
import toast from "react-hot-toast";
import { FaCircleInfo } from "react-icons/fa6";

export const toastInfo = (message) => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 text-sm p-3 bg-background-light rounded shadow-md ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      <FaCircleInfo className="text-xl text-info-base" />
      <div>{message}</div>
    </div>
  ));
};
