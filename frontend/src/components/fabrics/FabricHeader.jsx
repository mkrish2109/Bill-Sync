import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

export const FabricHeader = ({ 
  fabric, 
  title = 'Fabric Details',
  showEdit = true,
  showDelete = true,
  onDelete
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <Button
        onClick={() => navigate(-1)}
        className="bg-secondary-light text-text-invertedLight hover:bg-secondary-hoverLight dark:bg-secondary-dark dark:hover:bg-secondary-hoverDark transition-all duration-200 shadow hover:shadow-md focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark"
      >
        <FaArrowLeft className="mr-2" /> Back
      </Button>

      <h1 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark text-center sm:text-left">
        {title}
      </h1>


      {user.role === 'buyer' && (showEdit || showDelete) && (
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
          {showEdit && (
            <Link to={`/buyer/fabrics/edit/${fabric._id}`} className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto bg-warning-base text-warning-text hover:bg-warning-hover dark:bg-warning-base dark:hover:bg-warning-hover transition-all duration-200 shadow hover:shadow-md focus:ring-2 focus:ring-warning-base"
              >
                <FaEdit className="mr-2" /> Edit
              </Button>
            </Link>
          )}
          
          {showDelete && (
            <Button
              onClick={onDelete}
              className="w-full sm:w-auto bg-error-base text-error-text hover:bg-error-hover dark:bg-error-base dark:hover:bg-error-hover transition-all duration-200 shadow hover:shadow-md focus:ring-2 focus:ring-error-base"
            >
              <FaTrash className="mr-2" /> Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};