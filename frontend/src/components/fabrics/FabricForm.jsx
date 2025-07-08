import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../helper/apiHelper";
import ImageUploader from "../ui/ImageUploader";
import { Button } from "flowbite-react";
import { useAvailableWorkers } from "../../hooks/useRequests";
import { statusColors } from "../../utils/colors";
import LoadingSpinner from "../common/LoadingSpinner";
import toast from "react-hot-toast";

const FabricForm = ({
  initialData = {},
  isEditing = false,
  onSuccessRedirect = "/buyer/fabrics",
  onCancelRedirect = "/buyer/fabrics",
  fabricId = null,
  workers = [],
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const imageUploaderRef = useRef();
  const { availableUsers, sendRequest } = useAvailableWorkers();
  const [formData, setFormData] = useState({
    buyerId: "",
    name: "",
    description: "",
    unit: "meters",
    quantity: 0,
    unitPrice: 0,
    imageUrl: "",
    workerId: "",
    status: initialData.status || "draft",
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [oldImageUrl, setOldImageUrl] = useState(initialData.imageUrl || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setTempImageUrl(imageUrl);
  };

  const handleImageDelete = async () => {
    try {
      if (oldImageUrl) {
        const filename = oldImageUrl.split("/").pop();
        await api.delete(`/upload/${filename}`);
      }
      setOldImageUrl("");
      setTempImageUrl("");
      setFormData((prev) => ({
        ...prev,
        imageUrl: "",
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSendRequest = async (workerId) => {
    try {
      await sendRequest(workerId, "I would like to connect with you");
      toast.success("Connection request sent successfully");
    } catch (error) {
      toast.error(error.message || "Failed to send connection request");
    }
  };

  // Validation for active status
  const validateActive = () => {
    if (!formData.name || !formData.description || !formData.unit || !formData.quantity || !formData.unitPrice) {
      setError("Please fill all required fields before saving as active.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let finalImageUrl = formData.imageUrl;
      if (imageUploaderRef.current) {
        try {
          const uploadedImageUrl = await imageUploaderRef.current.handleUpload();
          if (uploadedImageUrl) {
            finalImageUrl = uploadedImageUrl;
          }
        } catch (err) {
          throw new Error("Failed to upload image");
        }
      }
      if (isEditing && oldImageUrl && finalImageUrl !== oldImageUrl) {
        try {
          const filename = oldImageUrl.split("/").pop();
          await api.delete(`/upload/${filename}`);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      // Set status
      const status = saveAsDraft ? "draft" : "active";
      // Validate if not draft
      if (!saveAsDraft && !validateActive()) {
        setLoading(false);
        return;
      }
      const updatedFormData = {
        ...formData,
        imageUrl: finalImageUrl,
        status,
      };
      let response;
      if (isEditing) {
        response = await api.put(`/fabrics/${fabricId}`, updatedFormData);
        // Show a toast as a promise for the update operation
        // (Assumes 'toast' is available in scope, e.g., from 'react-hot-toast')
        await toast.promise(
          Promise.resolve(response), // response is already awaited above, so wrap in Promise.resolve
          {
            loading: "Updating fabric...",
            success: (res) => res.data.message || "Fabric updated successfully!",
            error: (err) =>
              err?.response?.data?.error || "Failed to update fabric",
          },
          {
            success: {
              duration: 3000,
            },
            error: {
              duration: 4000,
            },
          }
        );
        if (response.data.success) {
          if (onSuccess) {
            onSuccess(response.data.data);
          }
          if (onClose) {
            onClose();
          }
          if (!onClose) {
            navigate(onSuccessRedirect);
          }
          return;
        }
      } else {
        await toast.promise(
          api.post("/fabrics", updatedFormData).then((res) => {
            response = res;
            return res;
          }),
          {
            loading: "Adding fabric...",
            success: (res) => res.data.message || "Fabric added successfully!",
            error: (err) =>
              err?.response?.data?.error || "Failed to add fabric",
          },
          {
            success: {
              duration: 3000,
            },
            error: {
              duration: 4000,
            },
          }
        );
        if (response && response.data.success) {
          if (onSuccess) {
            onSuccess(response.data.data.fabric);
          }
          if (onClose) {
            onClose();
          }
          navigate(onSuccessRedirect);
          return;
        }
      }
      throw new Error(
        response.data.error ||
          (isEditing ? "Failed to update fabric" : "Failed to add fabric")
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          (isEditing ? "Failed to update fabric" : "Failed to add fabric")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-text-light dark:text-text-dark">
        {isEditing ? "Edit Fabric" : "Add New Fabric"}
      </h1>

      {error && (
        <div className="bg-error-base/10 border-l-4 border-error-base text-error-base p-4 rounded-md mb-6 shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form
        onSubmit={(e) => handleSubmit(e, false)}
        className="bg-background-light dark:bg-background-dark shadow-xl rounded-lg p-8 mb-4 border border-border-light dark:border-border-dark"
      >
        {/* Worker Assignment Field */}
        <div className="mb-6">
          <label
            className="block text-text-light dark:text-text-dark text-lg font-semibold mb-3"
            htmlFor="workerId"
          >
            Assign to Worker (Optional)
          </label>
          <select
            id="workerId"
            name="workerId"
            value={formData.workerId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
          >
            <option value="">Select a worker</option>
            {/* Connected Workers Group */}
            {workers.length > 0 && (
              <optgroup label="Connected Workers">
                {workers.map((worker) => (
                  <option key={worker._id} value={worker._id}>
                    {worker.name} (Connected)
                  </option>
                ))}
              </optgroup>
            )}
            {/* Available Workers Group */}
            {availableUsers.length > 0 && (
              <optgroup label="Available Workers">
                {availableUsers.map((worker) => (
                  <option key={worker._id} value={worker._id} disabled>
                    {worker.name} (Click to connect)
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <p className="text-xs text-text-mutedLight dark:text-text-mutedDark mt-2">
            Select a connected worker or connect with an available worker
          </p>
          {/* Available Workers List */}
          {availableUsers.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-text-light dark:text-text-dark">
                Available Workers:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {availableUsers.map((worker) => (
                  <div
                    key={worker._id}
                    className={`${statusColors.default.bg} p-3 rounded-lg ${statusColors.default.border} border flex items-center justify-between`}
                  >
                    <div>
                      <p className={`font-medium ${statusColors.default.text}`}>
                        {worker.name}
                      </p>
                      <p className={`text-sm ${statusColors.default.text}`}>
                        {worker.contact}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSendRequest(worker._id)}
                      className={`px-3 py-1 text-sm ${statusColors.pending.bg} ${statusColors.pending.text} rounded hover:opacity-90 transition-colors`}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-text-light dark:text-text-dark text-lg font-semibold mb-3"
            htmlFor="name"
          >
            Fabric Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-text-light dark:text-text-dark text-lg font-semibold mb-3"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label
              className="block text-text-light dark:text-text-dark text-lg font-semibold mb-3"
              htmlFor="unit"
            >
              Unit
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
            >
              <option value="meters">Meters</option>
              <option value="yards">Yards</option>
            </select>
          </div>

          <div>
            <label
              className="block text-text-light dark:text-text-dark text-lg font-semibold mb-3"
              htmlFor="quantity"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label
              className="block text-text-light dark:text-text-dark text-lg font-semibold mb-3"
              htmlFor="unitPrice"
            >
              Unit Price ($)
            </label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-text-light dark:text-text-dark text-lg font-semibold mb-3">
            Fabric Image
          </label>
          <ImageUploader
            ref={imageUploaderRef}
            onImageUpload={handleImageUpload}
            initialImageUrl={formData.imageUrl}
            onDelete={handleImageDelete}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark gap-4">
          <Button
            color="primary"
            type="submit"
            disabled={loading}
            className="focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <LoadingSpinner
                inline
                text={isEditing ? "Updating..." : "Saving..."}
              />
            ) : isEditing ? (
              "Update Fabric"
            ) : (
              "Save Fabric"
            )}
          </Button>
          <Button
            color="secondary"
            type="button"
            onClick={() => (onClose ? onClose() : navigate(onCancelRedirect))}
            className="focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Cancel
          </Button>
          <Button
            color="gray"
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, true)}
            className="focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isEditing ? "Save as Draft" : "Save as Draft"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FabricForm;
