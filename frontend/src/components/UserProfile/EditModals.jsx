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
      <div className=" w-full overflow-y-auto rounded-3xl bg-background-light p-4 dark:bg-background-dark lg:p-8">
        <div className="px-2 pr-8 sm:pr-14">
          <h4 className="mb-2 text-xl sm:text-2xl font-semibold text-text-light dark:text-text-dark/90">
            Edit Personal Information
          </h4>
          <p className="mb-4 sm:mb-6 text-sm text-secondary-light dark:text-secondary-dark lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="h-[400px] sm:h-[450px] overflow-y-auto px-2 pb-3 scrollbar-thin scrollbar-thumb-primary-light dark:scrollbar-thumb-primary-dark scrollbar-track-surface-light dark:scrollbar-track-surface-dark">
            <div className="mt-4 sm:mt-7">
              <h5 className="mb-4 sm:mb-5 text-base sm:text-lg font-medium text-text-light dark:text-text-dark/90 lg:mb-6">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-5 lg:grid-cols-2">
                {personalInfo.map((info, index) => {
                  if (info.label === "Email address") {
                    return (
                      <div key={index} className="col-span-2 lg:col-span-1">
                        <Label className="text-sm sm:text-base">{info.label}</Label>
                        <TextInput 
                          type={info.type || "text"} 
                          value={info.value} 
                          disabled 
                          className="cursor-not-allowed opacity-70 mt-1"
                        />
                      </div>
                    );
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className={info.label === "Bio" ? "col-span-2" : "col-span-2 lg:col-span-1"}
                    >
                      <Label htmlFor={info.name} className="text-sm sm:text-base">{info.label}</Label>
                      <TextInput 
                        id={info.name}
                        name={info.name}
                        type="text" 
                        value={formData[info.name] || ""}
                        onChange={handleChange}
                        disabled={loading}
                        color={errors[info.name] ? "failure" : "gray"}
                        className="mt-1"
                      />
                      {errors[info.name] && (
                        <span className="text-error-base text-xs mt-1 block">{errors[info.name]}</span>
                      )}
                      {info.name === "bio" && (
                        <p className="text-xs text-secondary-light dark:text-secondary-dark mt-1">
                          {formData.bio?.length || 0}/200 characters
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-4 sm:mt-6 lg:justify-end border-t border-border-light dark:border-border-dark pt-4">
            <Button 
              color="secondary" 
              size="sm" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="min-w-[100px]"
            >
              Close
            </Button>
            <Button 
              color="secondary" 
              size="sm" 
              onClick={onSave}
              disabled={loading || Object.values(errors).some(error => error)}
              className="min-w-[100px]"
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
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className=" w-full overflow-y-auto rounded-3xl bg-background-light p-4 dark:bg-background-dark lg:p-8">
        <div className="px-2 pr-8 sm:pr-14">
          <h4 className="mb-2 text-xl sm:text-2xl font-semibold text-text-light dark:text-text-dark/90">
            Edit Address Information
          </h4>
          <p className="mb-4 sm:mb-6 text-sm text-secondary-light dark:text-secondary-dark lg:mb-7">
            Update your address details.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="h-[400px] sm:h-[450px] overflow-y-auto px-2 pb-3 scrollbar-thin scrollbar-thumb-primary-light dark:scrollbar-thumb-primary-dark scrollbar-track-surface-light dark:scrollbar-track-surface-dark">
            <div className="mt-4 sm:mt-7">
              <h5 className="mb-4 sm:mb-5 text-base sm:text-lg font-medium text-text-light dark:text-text-dark/90 lg:mb-6">
                Address Details
              </h5>
              <div className="grid grid-cols-1 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-5 lg:grid-cols-2">
                {addressInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className={info.label.includes("Address Line") ? "col-span-2" : "col-span-2 lg:col-span-1"}
                  >
                    <Label htmlFor={info.name} className="text-sm sm:text-base">{info.label}</Label>
                    <TextInput
                      id={info.name}
                      name={info.name}
                      type="text"
                      value={formData[info.name] || ""}
                      onChange={handleChange}
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-4 sm:mt-6 lg:justify-end border-t border-border-light dark:border-border-dark pt-4">
            <Button 
              color="secondary" 
              size="sm" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="min-w-[100px]"
            >
              Close
            </Button>
            <Button 
              color="secondary" 
              size="sm" 
              onClick={onSave}
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export const EditMetaProfile = ({
  isOpen,
  onClose,
  onSave,
  formData,
  handleChange,
  loading,
  user
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] ">
      <div className=" w-full overflow-y-auto rounded-3xl bg-background-light p-4 dark:bg-background-dark lg:p-8">
        <div className="px-2 pr-8 sm:pr-14">
          <h4 className="mb-2 text-xl sm:text-2xl font-semibold text-text-light dark:text-text-dark/90">
            Edit Profile Information
          </h4>
          <p className="mb-4 sm:mb-6 text-sm text-secondary-light dark:text-secondary-dark lg:mb-7">
            Update your profile picture and basic information.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="h-[400px] sm:h-[450px] overflow-y-auto px-2 pb-3 scrollbar-thin scrollbar-thumb-primary-light dark:scrollbar-thumb-primary-dark scrollbar-track-surface-light dark:scrollbar-track-surface-dark">
            <div className="mt-4 sm:mt-7">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 overflow-hidden border-2 border-primary-light dark:border-primary-dark rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
                  <img 
                    src={formData.image[0] ? URL.createObjectURL(formData.image[0]) : user?.image?.[0] || "/images/profile.png"} 
                    alt="Preview" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <label className="cursor-pointer group">
                  <span className="text-sm font-medium text-primary-light dark:text-primary-dark group-hover:text-primary-hoverLight dark:group-hover:text-primary-hoverDark transition-colors duration-200">
                    Change Photo
                  </span>
                  <input 
                    type="file" 
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label htmlFor="fname" className="text-sm sm:text-base">First Name</Label>
                  <TextInput
                    id="fname"
                    name="fname"
                    type="text"
                    value={formData.fname}
                    onChange={handleChange}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label htmlFor="lname" className="text-sm sm:text-base">Last Name</Label>
                  <TextInput
                    id="lname"
                    name="lname"
                    type="text"
                    value={formData.lname}
                    onChange={handleChange}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-4 sm:mt-6 lg:justify-end border-t border-border-light dark:border-border-dark pt-4">
            <Button 
              color="secondary" 
              size="sm" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="min-w-[100px]"
            >
              Close
            </Button>
            <Button 
              color="secondary" 
              size="sm" 
              onClick={onSave}
              disabled={loading}
              isProcessing={loading}
              className="min-w-[100px]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};