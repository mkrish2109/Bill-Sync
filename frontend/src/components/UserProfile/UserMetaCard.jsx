import { useState } from "react";
import { Button } from "flowbite-react";
import { useModal } from "../../hooks/useModal";
import UserSocialLinks from "./UserSocialLinks";
import Modal from "../ui/modal/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import { EditMetaProfile } from "./EditModals";

export default function UserMetaCard({ user,address, onUpdate }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    fname: user?.fname || "",
    lname: user?.lname || "",
    image: user?.image || []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        image: e.target.files ? Array.from(e.target.files) : []
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("fname", formData.fname);
      formDataToSend.append("lname", formData.lname);
      if (formData.image[0]) {
        formDataToSend.append("image", formData.image[0]);
      }

      const response = await axios.put("/api/user/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      onUpdate(response.data);
      toast.success("Profile updated successfully");
      closeModal();
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

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img 
                src={user?.image?.[0] || "/images/profile.png"} 
                alt={`${user?.fname} ${user?.lname}`} 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-text-dark/90 xl:text-left">
                {user?.fname} {user?.lname}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-text-secondaryLight dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
                {user?.role && (
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                )}
                <p className="text-sm text-text-secondaryLight dark:text-gray-400">
                  {address?.country || "Location not specified"}
                </p>
              </div>
            </div>
            <UserSocialLinks />
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
      </div>

      <EditMetaProfile
        isOpen={isOpen}
        onClose={closeModal}
        onSave={handleSave}
        formData={formData}
        handleChange={handleChange}
        loading={loading}
        user={user}
      />
    </>
  );
}