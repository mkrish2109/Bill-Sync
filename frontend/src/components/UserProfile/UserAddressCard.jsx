import { useModal } from "../../hooks/useModal";
import Input from "../form/InputField";
import Label from "../form/Label";
import { Button } from "flowbite-react";
import { Modal } from "../ui/modal/Modal";
// import { EditAddressModal } from "./EditModals";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    // Save logic here
    closeModal();
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

const EditAddressModal = ({ isOpen, onClose, onSave, addressInfo }) => (
  <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      {/* Modal content here */}
    </div>
  </Modal>
);

  const addressInfo = [
    { label: "Country", value: "United States" },
    { label: "State", value: "Arizona" },
    { label: "City", value: "Phoenix" },
    { label: "Postal Code", value: "85001" },
    { label: "Address Line 1", value: "123 Main Street" },
    { label: "Address Line 2", value: "Apt 4B" }
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Address Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            {addressInfo.map((info, index) => (
              <div key={index}>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  {info.label}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Button 
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
      />
    </div>
  );
}