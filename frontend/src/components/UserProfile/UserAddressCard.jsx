import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Button } from "flowbite-react";
import { EditAddressModal } from "./EditModals";
import { toast } from "react-toastify";
import { api } from "../../helper/apiHelper";

export default function UserAddressCard({ address, onUpdate }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    country: address?.country || "",
    state: address?.state || "",
    city: address?.city || "",
    postalCode: address?.postalCode || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.put("/user/profile/address", formData);
      if (response.status === 200) {
        onUpdate(response.data.data);
        toast.success("Address updated successfully");
        closeModal();
      } else {
        toast.error("Failed to update address");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
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

  const addressInfo = [
    {
      label: "Country",
      value: address?.country || "Not specified",
      name: "country",
    },
    { label: "State", value: address?.state || "Not specified", name: "state" },
    { label: "City", value: address?.city || "Not specified", name: "city" },
    {
      label: "Postal Code",
      value: address?.postalCode || "Not specified",
      name: "postalCode",
    },
    {
      label: "Address Line 1",
      value: address?.addressLine1 || "Not specified",
      name: "addressLine1",
    },
    {
      label: "Address Line 2",
      value: address?.addressLine2 || "Not specified",
      name: "addressLine2",
    },
  ];

  return (
    <div className="p-5 border border-border-light hover:border-border-hoverLight rounded-2xl dark:border-border-dark dark:hover:border-border-hoverDark lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-text-light dark:text-text-dark lg:mb-6">
            Address Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            {addressInfo.map((info, index) => (
              <div key={index}>
                <p className="mb-2 text-xs leading-normal text-text-mutedLight dark:text-text-mutedDark">
                  {info.label}
                </p>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">
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

      <EditAddressModal
        isOpen={isOpen}
        onClose={closeModal}
        onSave={handleSave}
        addressInfo={addressInfo}
        formData={formData}
        handleChange={handleChange}
        loading={loading}
      />
    </div>
  );
}
