import { PageMeta } from "../components/comman/PageMeta";
import PageBreadcrumb from "../components/comman/PageBreadcrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import { useDispatch, useSelector } from "react-redux";
export default function UserProfile() {
   const dispatch = useDispatch();
  const user = useSelector((store) => store?.user.user);
  return (
    <>
      <PageMeta
        title="User Profile | Tex Bill"
        description="User profile dashboard for Tex Bill application"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user}/>
          <UserInfoCard user={user} />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}