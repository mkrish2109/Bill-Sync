import React from 'react';
import { FaClock, FaStickyNote } from 'react-icons/fa';

export const DetailsTab = ({ fabric }) => (
  <div className="space-y-8">
    <h3 className="font-semibold text-xl text-text-light dark:text-text-dark">Additional Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow duration-200">
        <h4 className="font-medium text-lg text-text-light dark:text-text-dark mb-4 flex items-center">
          <FaClock className="mr-2 text-primary-light dark:text-primary-dark" />
          Timestamps
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-secondary-light dark:text-text-secondaryDark font-medium">Created At:</span>
            <span className="text-text-light dark:text-text-dark">{new Date(fabric.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-light dark:text-text-secondaryDark font-medium">Updated At:</span>
            <span className="text-text-light dark:text-text-dark">{new Date(fabric.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {fabric.notes && (
        <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow duration-200">
          <h4 className="font-medium text-lg text-text-light dark:text-text-dark mb-4 flex items-center">
            <FaStickyNote className="mr-2 text-primary-light dark:text-primary-dark" />
            Notes
          </h4>
          <p className="text-secondary-light dark:text-text-secondaryDark leading-relaxed">{fabric.notes}</p>
        </div>
      )}
    </div>
  </div>
);