import { Button, Label, TextInput } from "flowbite-react";
import Modal from "../ui/modal/Modal";


export const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  personalInfo, 
  formData, 
  handleChange, 
  loading,
  errors 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className="relative w-full overflow-y-auto rounded-3xl bg-background-light p-4 dark:bg-background-dark lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-text-dark/90">
            Edit Personal Information
          </h4>
          <p className="mb-6 text-sm text-text-secondaryLight dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-text-dark/90 lg:mb-6">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {personalInfo.map((info, index) => {
                  if (info.label === "Email address") {
                    return (
                      <div key={index} className="col-span-2 lg:col-span-1">
                        <Label>{info.label}</Label>
                        <TextInput 
                          type="text" 
                          value={info.value} 
                          disabled 
                          className="cursor-not-allowed opacity-70"
                        />
                      </div>
                    );
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className={info.label === "Bio" ? "col-span-2" : "col-span-2 lg:col-span-1"}
                    >
                      <Label htmlFor={info.name}>{info.label}</Label>
                      <TextInput 
                        id={info.name}
                        name={info.name}
                        type="text" 
                        value={formData[info.name] || ""}
                        onChange={handleChange}
                        disabled={loading}
                        color={errors[info.name] ? "failure" : "gray"} // Show error state
                        
                      />
                       {errors[info.name] && (
                          <span className="text-red-600 text-xs">{errors[info.name]}</span>
                        )}
                      {info.name === "bio" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.bio?.length || 0}/200 characters
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button 
              color="secondary" 
              size="sm" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Close
            </Button>
            <Button 
              color="secondary" 
              size="sm" 
              onClick={onSave}
              disabled={loading || Object.values(errors).some(error => error)}
              // isProcessing={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export const EditAddressModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  addressInfo, 
  formData, 
  handleChange, 
  loading,
  // errors 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className="relative w-full overflow-y-auto rounded-3xl bg-background-light p-4 dark:bg-background-dark lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-text-dark/90">
            Edit Address Information
          </h4>
          <p className="mb-6 text-sm text-text-secondaryLight dark:text-gray-400 lg:mb-7">
            Update your address details.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-text-dark/90 lg:mb-6">
                Address Details
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {addressInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className={info.label.includes("Address Line") ? "col-span-2" : "col-span-2 lg:col-span-1"}
                  >
                    <Label htmlFor={info.name}>{info.label}</Label>
                    <TextInput
                      id={info.name}
                      name={info.name}
                      type="text"
                      value={formData[info.name] || ""}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button 
              color="secondary" 
              size="sm" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Close
            </Button>
            <Button 
              color="secondary" 
              size="sm" 
              onClick={onSave}
              disabled={loading}
              // isProcessing={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};