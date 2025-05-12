// import { Modal } from "flowbite-react";
import Input from "../form/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Modal from "../ui/modal/Modal";

export const EditProfileModal = ({ isOpen, onClose, onSave, personalInfo }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className="relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {personalInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className={info.label === "Bio" ? "col-span-2" : "col-span-2 lg:col-span-1"}
                  >
                    <Label>{info.label}</Label>
                    <Input type="text" value={info.value} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" onClick={onSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export const EditAddressModal = ({ isOpen, onClose, onSave, addressInfo }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className="relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Address Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your address details.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Address Details
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {addressInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className={info.label.includes("Address Line") ? "col-span-2" : "col-span-2 lg:col-span-1"}
                  >
                    <Label>{info.label}</Label>
                    <Input type="text" value={info.value} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" onClick={onSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};