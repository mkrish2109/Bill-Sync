import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Button } from "flowbite-react";
import { EditProfileModal } from "./EditModals";
import { toast } from "react-toastify";
import { api } from "../../helper/apiHelper";
// Validation functions
const validateName = (name) => {
  return /^[a-zA-Z ]{2,30}$/.test(name);
};

const validatePhone = (phone) => {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if the cleaned number has 10 digits
  if (digitsOnly.length !== 10) {
    return false;
  }

  // Optional: Check if the original format matches common patterns
  const commonFormats = [
    /^\(\d{3}\)\s\d{3}-\d{4}$/,  // (123) 456-7890
    /^\d{3}-\d{3}-\d{4}$/,       // 123-456-7890
    /^\d{10}$/                   // 1234567890
  ];

  return commonFormats.some(format => format.test(phone));
};

const validateBio = (bio) => {
  return bio.length <= 200; // Limit bio to 200 characters
};
export default function UserInfoCard({ user, onUpdate }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    fname: user?.fname || "",
    lname: user?.lname || "",
    phone: user?.phone || "",
    bio: user?.bio || ""
  });
  
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    phone: "",
    bio: ""
  });
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    
    switch(name) {
      case 'fname':
      case 'lname':
        if (!value.trim()) {
          error = "This field is required";
        } else if (!validateName(value)) {
          error = "Name should be 2-30 alphabetic characters";
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          error = "Please enter a valid phone number (e.g., (123) 456-7890)";
        }
        break;
      case 'bio':
        if (value && !validateBio(value)) {
          error = "Bio should be less than 200 characters";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    
    setErrors({
      ...errors,
      [name]: error
    });
    
    setFormData({ 
      ...formData, 
      [name]: value 
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.put("/user/profile", formData);
      if (response.status === 200) {
        onUpdate(response.data.data);
        toast.success("Profile updated successfully");
        closeModal();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
      />
    </svg>
  );

  const personalInfo = [
    { label: "First Name", value: user?.fname, name: "fname" },
    { label: "Last Name", value: user?.lname, name: "lname" },
    { label: "Email address", value: user?.email, name: "email" ,type:"email" },
    { label: "Phone", value: user?.phone, name: "phone",type:"tel" },
    { label: "Bio", value: user?.bio || "Not specified", name: "bio" }
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-text-dark/90 lg:mb-6">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {personalInfo.map((info, index) => (
              <div key={index}>
                <p className="mb-2 text-xs leading-normal text-text-secondaryLight dark:text-gray-400">
                  {info.label}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-text-dark/90">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Button 
          color="primary"
          onClick={openModal}
          variant="outline"
          className="flex items-center gap-2 lg:w-auto"
        >
          <EditIcon />
          Edit
        </Button>
      </div>

      <EditProfileModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        onSave={handleSave}
        personalInfo={personalInfo}
        formData={formData}
        handleChange={handleChange}
        loading={loading}
        errors={errors} 
      />
    </div>
  );
}