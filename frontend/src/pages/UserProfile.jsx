import { useState, useEffect } from "react";
import { PageMeta } from "../components/common/PageMeta";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { api } from "../helper/apiHelper";

export default function UserProfile() {
  const [profileData, setProfileData] = useState({
    user: null,
    address: null
  });
  const [loading, setLoading] = useState(true);
  const reduxUser = useSelector((store) => store?.user.user);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/profile");

        setProfileData({
          user: response.data.user,
          address: response.data.address
        });
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error("Profile fetch error:", error);
        // Fallback to Redux user data if API fails
        if (reduxUser) {
          setProfileData(prev => ({
            ...prev,
            user: reduxUser
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [reduxUser]);

  const handleProfileUpdate = (updatedUser) => {
    setProfileData(prev => ({
      ...prev,
      user: updatedUser
    }));
  };

  const handleAddressUpdate = (updatedAddress) => {
    setProfileData(prev => ({
      ...prev,
      address: updatedAddress
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
        <p className="text-gray-600 dark:text-gray-400">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="User Profile | Tex Bill"
        description="User profile dashboard for Tex Bill application"
      />
      <div className="rounded-2xl border border-gray-200 bg-background-light p-5 dark:border-gray-800 dark:bg-background-light/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-text-dark/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={profileData.user} address ={profileData.address} />
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