import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  HiChartPie, 
  HiUser, 
  HiShoppingBag, 
  HiChevronDown,
  HiOutlineViewGrid,
  HiOutlineDotsHorizontal
} from "react-icons/hi";
import { FaUsersCog } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const mainItems = [
  { 
    name: "Dashboard", 
    icon: <HiChartPie className="text-xl" />, 
    subItems: [
      { name: "Ecommerce", path: "/admin/dashboard" }
    ]
  },
  { 
    name: "Users", 
    icon: <FaUsersCog className="text-xl" />, 
    subItems: [
      { name: "All Users", path: "/admin/users" },
      { name: "Roles", path: "/admin/roles" },
      { name: "Permissions", path: "/admin/permissions" }
    ]
  },
  { 
    name: "Account", 
    icon: <HiUser className="text-xl" />, 
    subItems: [
      { name: "Profile", path: "/admin/account/profile" },
      { name: "Settings", path: "/admin/account/settings" }
    ]
  },
];

const otherItems = [
  { 
    name: "Products", 
    icon: <HiShoppingBag className="text-xl" />, 
    subItems: [
      { name: "All Products", path: "/admin/products" },
      { name: "Categories", path: "/admin/categories" }
    ]
  },
  { 
    name: "Logout", 
    icon: <IoLogOut className="text-xl" />, 
    path: "/logout" 
  }
];

function SidebarAdmin() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const subMenuRefs = useRef({});
  const [subMenuHeights, setSubMenuHeights] = useState({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  // Auto-expand submenu for current path
  useEffect(() => {
    let submenuMatched = false;
    
    ["main", "other"].forEach((menuType) => {
      const items = menuType === "main" ? mainItems : otherItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        } else if (nav.path && isActive(nav.path)) {
          submenuMatched = true;
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location.pathname, isActive]);

  // Calculate submenu heights when opened
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeights(prev => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const toggleSubmenu = (index, menuType) => {
    setOpenSubmenu(prev => {
      if (prev?.type === menuType && prev.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderNavItem = (item, index, menuType) => {
    const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
    const hasActiveSubItem = item.subItems?.some(sub => isActive(sub.path));
    const isItemActive = isActive(item.path || '') || hasActiveSubItem;

    return (
      <li key={`${menuType}-${index}`}>
        {item.subItems ? (
          <button
            onClick={() => toggleSubmenu(index, menuType)}
            className={`flex items-center w-full p-2 rounded-lg transition-colors group ${
              isSubmenuOpen || hasActiveSubItem
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            } ${!isExpanded && !isHovered ? 'justify-center' : 'justify-start'}`}
          >
            <span className={`${isSubmenuOpen || hasActiveSubItem
              ? 'text-blue-600 dark:text-blue-400'
              : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
            }`}>
              {item.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <>
                <span className="ml-3">{item.name}</span>
                <HiChevronDown 
                  className={`ml-auto transition-transform duration-200 ${
                    isSubmenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
        ) : (
          item.path && (
            <Link
              to={item.path}
              className={`flex items-center w-full p-2 rounded-lg transition-colors group ${
                isItemActive
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              } ${!isExpanded && !isHovered ? 'justify-center' : 'justify-start'}`}
            >
              <span className={`${isItemActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
              }`}>
                {item.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          )
        )}

        {item.subItems && (isExpanded || isHovered || isMobileOpen) && (
          <div
            ref={el => subMenuRefs.current[`${menuType}-${index}`] = el}
            className="overflow-hidden transition-all duration-300"
            style={{
              height: isSubmenuOpen ? `${subMenuHeights[`${menuType}-${index}`] || 'auto'}` : '0px'
            }}
          >
            <ul className="py-1 pl-11 space-y-1">
              {item.subItems.map((subItem, subIndex) => (
                <li key={`${menuType}-${index}-${subIndex}`}>
                  <Link
                    to={subItem.path}
                    className={`block px-2 py-1.5 text-sm rounded-lg transition-colors ${
                      isActive(subItem.path)
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out
        ${
          isExpanded || isMobileOpen
            ? 'w-64'
            : isHovered
            ? 'w-64'
            : 'w-20'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full py-4">
        <div className="px-4 mb-6">
          <Link to="/" className="flex items-center">
            {(isExpanded || isHovered || isMobileOpen) ? (
              <>
                <HiOutlineViewGrid className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold dark:text-white">Admin Panel</span>
              </>
            ) : (
              <HiOutlineViewGrid className="h-8 w-8 text-blue-600 mx-auto" />
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <div className="mb-6">
            <h2 className={`mb-2 text-xs uppercase text-gray-500 flex ${
              !isExpanded && !isHovered ? 'justify-center' : 'justify-start px-2'
            }`}>
              {(isExpanded || isHovered || isMobileOpen) ? (
                "Main Menu"
              ) : (
                <HiOutlineDotsHorizontal className="text-lg" />
              )}
            </h2>
            <ul className="space-y-1">
              {mainItems.map((item, index) => renderNavItem(item, index, 'main'))}
            </ul>
          </div>

          <div>
            <h2 className={`mb-2 text-xs uppercase text-gray-500 flex ${
              !isExpanded && !isHovered ? 'justify-center' : 'justify-start px-2'
            }`}>
              {(isExpanded || isHovered || isMobileOpen) ? (
                "Others"
              ) : (
                <HiOutlineDotsHorizontal className="text-lg" />
              )}
            </h2>
            <ul className="space-y-1">
              {otherItems.map((item, index) => renderNavItem(item, index, 'other'))}
            </ul>
          </div>
        </div>

        <div className="px-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {(isExpanded || isHovered || isMobileOpen) ? (
              <>
                <HiChevronDown className={`mr-2 transform ${isExpanded ? 'rotate-90' : '-rotate-90'}`} />
                <span>Collapse</span>
              </>
            ) : (
              <HiChevronDown className="transform -rotate-90" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SidebarAdmin;