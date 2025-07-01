import { useState, useEffect } from "react";
import { PageMeta } from "../components/common/PageMeta";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../helper/apiHelper";

export default function UserProfilePage() {
  const [profileData, setProfileData] = useState({
    user: null,
    address: null,
  });
  const [loading, setLoading] = useState(true);
  const reduxUser = useSelector((store) => store?.user.user);

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/profile");
        setProfileData({
          user: response.data.data.user,
          address: response.data.data.address,
        });
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error("Profile fetch error:", error);
        // Fallback to Redux user data if API fails
        if (reduxUser) {
          setProfileData((prev) => ({
            ...prev,
            user: reduxUser,
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [reduxUser]);

  // Effect to handle profile updates
  useEffect(() => {}, [profileData.user]);

  const handleProfileUpdate = (updatedData) => {
    // console.log("Updating profile with:", updatedData);
    setProfileData((prev) => ({
      ...prev,
      user: updatedData.user,
    }));
  };

  const handleAddressUpdate = (updatedAddress) => {
    console.log("Updating address with:", updatedAddress);
    setProfileData((prev) => ({
      ...prev,
      address: updatedAddress,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData.user) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400">
          Failed to load profile data
        </p>
      </div>
    );
  }

  return (
    <>
      <PageMeta 
        title="User Profile | Bill Sync"
        description="Manage your Bill Sync profile, update personal information, and customize your account settings."
        keywords="user profile, account settings, personal information, profile management"
      />
      <div className="rounded-2xl border border-gray-200 bg-background-light p-5 dark:border-gray-800 dark:bg-gradient-to-tl dark:from-background-dark dark:to-background-surfaceDark lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-text-light dark:text-text-dark lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={profileData.user} address={profileData.address} />
          <UserInfoCard
            user={profileData.user}
            onUpdate={handleProfileUpdate}
          />
          <UserAddressCard
            address={profileData.address}
            onUpdate={handleAddressUpdate}
          />
        </div>
      </div>
    </>
  );
}
