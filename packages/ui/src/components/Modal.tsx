import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-midnight-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal panel */}
        <div
          className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative w-full"
          style={{ maxWidth: '95vw' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Decorative elements */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon-100 rounded-full opacity-50"></div>
          <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-midnight-50 rounded-full opacity-70"></div>

          {/* Header */}
          <div className="px-6 pt-5 pb-4 bg-white relative z-10 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-midnight-900 pr-8">{title}</h3>
              <button
                type="button"
                className="bg-white rounded-full text-midnight-500 hover:text-midnight-700 focus:outline-none transform transition-transform hover:scale-110"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative z-10 px-6 py-5 bg-white">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="relative z-10 px-6 py-4 bg-gray-50 border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
