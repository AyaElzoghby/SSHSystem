import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-surface rounded-md shadow-xl w-full max-w-[80svw] px-2 py-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
            <div
              className="max-h-[60svh] overflow-y-auto  [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-surface
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-bg px-4"
            >
              {/* Content */}
              <div className="mb-4">{children}</div>
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex mt-2 justify-end gap-2">{footer}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
