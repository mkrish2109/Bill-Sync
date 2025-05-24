import React from 'react';
import { StatusBadge } from '../../common/StatusBadge';
import { FaUser, FaPhone, FaCalendarAlt } from 'react-icons/fa';

export const AssignmentsTab = ({ workers }) => (
  <div className="space-y-8">
    <h3 className="font-semibold text-xl text-text-light dark:text-text-dark">Worker Assignments</h3>
    <div className="overflow-x-auto rounded-xl border border-border-light dark:border-border-dark shadow-sm">
      <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
        <thead className="bg-surface-light dark:bg-surface-dark">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
              <div className="flex items-center">
                <FaUser className="mr-2" />
                Worker
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
              <div className="flex items-center">
                <FaPhone className="mr-2" />
                Contact
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                Assigned Date
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-background-light dark:bg-background-dark divide-y divide-border-light dark:divide-border-dark">
          {workers?.map((worker, index) => (
            <tr key={index} className="hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-text-light dark:text-text-dark">{worker.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-secondary-light dark:text-secondary-dark">{worker.contact}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={worker.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-secondary-light dark:text-secondary-dark">
                  {worker.assignedAt ? new Date(worker.assignedAt).toLocaleDateString() : 'N/A'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);