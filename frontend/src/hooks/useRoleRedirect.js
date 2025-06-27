import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "../store/slices/userSlice";

/**
 * Custom hook to redirect based on user role.
 * @param {object|null} user - The user object. If null, will fetch user.
 * @param {function} [onError] - Optional error callback.
 * @returns {function} redirectToRoleDashboard - Call to perform the redirect.
 */
export function useRoleRedirect(user = null, onError) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectToRoleDashboard = async () => {
    let role = null;
    let userObj = user;
    try {
      if (!userObj) {
        const userResponse = await dispatch(fetchUser());
        if (fetchUser.fulfilled.match(userResponse)) {
          userObj = userResponse.payload.data;
        } else {
          if (onError)
            onError(
              userResponse.payload?.message || "Failed to fetch user info."
            );
          return;
        }
      }
      role = userObj?.role;
      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "buyer":
          navigate("/buyer/dashboard");
          break;
        case "worker":
          navigate("/worker/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      if (onError) onError(err.message || "Redirection error");
    }
  };

  return redirectToRoleDashboard;
}
