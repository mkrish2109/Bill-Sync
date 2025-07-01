import React from "react";
import { StatusBadge } from "../../common/StatusBadge";
import { FaUser, FaPhone, FaCalendarAlt, FaBuilding } from "react-icons/fa";

export const AssignmentsTab = ({ worker, buyer }) => (
  <div className="space-y-8">
    <h3 className="font-semibold text-xl text-text-light dark:text-text-dark">
      {worker
        ? "Worker Assignment"
        : buyer
        ? "Buyer Information"
        : "Assignment Details"}
    </h3>

    {/* Buyer Info Section */}
    {buyer && (
      <div className="mb-6 p-4 rounded-lg bg-background-surfaceLight dark:bg-background-surfaceDark border border-border-light dark:border-border-dark">
        <h4 className="font-semibold text-lg mb-2 text-text-light dark:text-text-dark flex items-center">
          <FaBuilding className="mr-2" /> Buyer Information
        </h4>
        <div className="text-text-light dark:text-text-dark">
          <div>
            <span className="font-medium">Name:</span> {buyer.name}
          </div>
          <div>
            <span className="font-medium">Contact:</span> {buyer.contact}
          </div>
          {buyer.company && (
            <div>
              <span className="font-medium">Company:</span> {buyer.company}
            </div>
          )}
        </div>
      </div>
    )}

    {worker && (
      <div className="overflow-x-auto rounded-xl border border-border-light dark:border-border-dark shadow-sm">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark text-sm sm:text-base">
          <thead className="bg-background-surfaceLight dark:bg-background-surfaceDark">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm md:text-base font-medium text-secondary-light dark:text-text-secondaryDark uppercase tracking-wider min-w-[120px]">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  Worker
                </div>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm md:text-base font-medium text-secondary-light dark:text-text-secondaryDark uppercase tracking-wider min-w-[120px]">
                <div className="flex items-center">
                  <FaPhone className="mr-2" />
                  Contact
                </div>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm md:text-base font-medium text-secondary-light dark:text-text-secondaryDark uppercase tracking-wider min-w-[100px]">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm md:text-base font-medium text-secondary-light dark:text-text-secondaryDark uppercase tracking-wider min-w-[140px]">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Assigned Date
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-light dark:bg-background-dark divide-y divide-border-light dark:divide-border-dark">
            <tr className="hover:bg-background-surfaceLight/50 dark:hover:bg-background-surfaceDark/50 transition-colors duration-150">
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm sm:text-base">
                <div className="flex items-center">
                  <div className="text-sm sm:text-base font-medium text-text-light dark:text-text-dark">
                    {worker.name}
                  </div>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm sm:text-base">
                <div className="text-sm sm:text-base text-secondary-light dark:text-text-secondaryDark">
                  {worker.contact}
                </div>
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm sm:text-base">
                <StatusBadge status={worker.status} />
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm sm:text-base">
                <div className="text-sm sm:text-base text-secondary-light dark:text-text-secondaryDark">
                  {worker.assignedAt
                    ? new Date(worker.assignedAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )}
  </div>
);
