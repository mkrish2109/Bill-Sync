import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  HiChartPie, 
  HiUser, 
  HiShoppingBag, 
  HiChevronDown,
  HiOutlineDotsHorizontal
} from "react-icons/hi";
import { FaUsersCog } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { Logo } from "../../components/common/Logo";
import { useSidebar } from "../../contexts/SidebarContext";

const mainItems = [
  { 
    name: "Dashboard", 
    icon: <HiChartPie className="text-xl" />, 
    path: "/"
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
  const { isExpanded, isMobileOpen, isHovered, setIsHovered,setIsMobileOpen } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest('aside')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen, setIsMobileOpen]);

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

  const toggleSubmenu = (index, menuType) => {
    setOpenSubmenu(prev => {
      if (prev?.type === menuType && prev.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const getSubmenuHeight = (menuType, index) => {
    const key = `${menuType}-${index}`;
    return subMenuRefs.current[key]?.scrollHeight || 0;
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
                ? 'bg-blue-50 dark:bg-blue-900/20 text-primary-light dark:text-primary-dark'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }              'justify-start'}`}
          >
            <span className={`${isSubmenuOpen || hasActiveSubItem
              ? 'text-primary-light dark:text-primary-dark'
              : 'group-hover:text-primary-light dark:group-hover:text-primary-dark'
            }`}>
              {item.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <>
                <span className="ml-3 group-hover:text-primary-light dark:group-hover:text-primary-dark">{item.name}</span>
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
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-primary-light dark:text-primary-dark'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }              'justify-start'}`}
            >
              <span className={`${isItemActive
                ? 'text-primary-light dark:text-primary-dark'
                : 'group-hover:text-primary-light dark:group-hover:text-primary-dark'
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
              height: isSubmenuOpen ? `${getSubmenuHeight(menuType, index)}px` : '0px'
            }}
          >
            <ul className="py-1 pl-11 space-y-1">
              {item.subItems.map((subItem, subIndex) => (
                <li key={`${menuType}-${index}-${subIndex}`}>
                  <Link
                    to={subItem.path}
                    className={`block px-2 py-1.5 text-sm rounded-lg transition-colors ${
                      isActive(subItem.path)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-primary-light dark:text-primary-dark font-medium'
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
  //   const getSidebarWidth = () => {
  //   if (isMobileOpen) return 'w-64';
  //   if (!isExpanded && !isHovered) return 'w-20';
  //   return 'w-64';
  // };

  return (
     <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full py-4">
        <div className="px-0 mb-6">
          <Link to="/" className={`flex items-center ${(isExpanded || isHovered || isMobileOpen) ? '': 'justify-center' } `}>
            {(isExpanded || isHovered || isMobileOpen) ? (
              <>
                <Logo variant="full" size="lg" />
              </>
            ) : (
              <Logo variant='icon' className="h-10 w-" size='lg'/>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <div className="mb-6">
            <h2 className='b-2 text-xs uppercase text-gray-500 dark:text-gray-400 flex justify-start px-2'>
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
            <h2 className='mb-2 text-xs uppercase text-gray-500 dark:text-gray-400 flex justify-start px-2'>
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
        
      </div>
    </aside>
  );
}

export default SidebarAdmin;