import React from 'react';
import { Timeline, TimelineItem, TimelineContent, TimelineTitle } from 'flowbite-react';
import HistoryItem from '../../common/HistoryItem';
import LoadingSpinner from '../../common/LoadingSpinner';
import { FaHistory, FaExchangeAlt } from 'react-icons/fa';

export const HistoryTab = ({ statusHistory, changeHistory, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[120px] sm:min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!statusHistory.length && !changeHistory.length) {
    return (
      <div className="text-center py-6 sm:py-8 md:py-12 text-secondary-light dark:text-text-secondaryDark">
        <FaHistory className="mx-auto text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-5 text-primary-light dark:text-primary-dark opacity-50" />
        <p className="text-base sm:text-lg">No history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 overflow-hidden px-2 sm:px-4 md:px-6">
      <h3 className="font-semibold text-lg sm:text-xl text-text-light dark:text-text-dark text-center sm:text-left mb-4 sm:mb-6 md:mb-8">
        Fabric History
      </h3>
      <Timeline>
        {statusHistory.length > 0 && (
          <div className="mb-6 sm:mb-8 md:mb-10">
            <TimelineItem>
              <TimelineContent>
                <TimelineTitle className="text-base sm:text-lg font-semibold text-text-light dark:text-text-dark flex items-center mb-2 sm:mb-4 md:mb-5">
                  <FaExchangeAlt className="mr-2 text-primary-light dark:text-primary-dark flex-shrink-0" />
                  Status Changes
                </TimelineTitle>
              </TimelineContent>
            </TimelineItem>

            <div className="max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2 sm:pr-4 space-y-3 sm:space-y-4 md:space-y-5 scrollbar-thin scrollbar-thumb-primary-light dark:scrollbar-thumb-primary-dark scrollbar-track-background-surfaceLight dark:scrollbar-track-background-surfaceDark text-sm sm:text-base">
              {statusHistory.map((item) => (
                <div key={item._id} className="transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-transform duration-200">
                  <HistoryItem item={item} field="status" />
                </div>
              ))}
            </div>
          </div>
        )}

        {changeHistory.length > 0 && (
          <div>
            <TimelineItem>
              <TimelineContent>
                <TimelineTitle className="text-base sm:text-lg font-semibold text-text-light dark:text-text-dark flex items-center mb-2 sm:mb-4 md:mb-5">
                  <FaHistory className="mr-2 text-primary-light dark:text-primary-dark flex-shrink-0" />
                  Data Changes
                </TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <div className="space-y-3 sm:space-y-4 md:space-y-5 max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-light dark:scrollbar-thumb-primary-dark scrollbar-track-background-surfaceLight dark:scrollbar-track-background-surfaceDark text-sm sm:text-base">
              {changeHistory.map((item) => (
                <div key={item._id} className="transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-transform duration-200">
                  <HistoryItem item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Timeline>
    </div>
  );
};
