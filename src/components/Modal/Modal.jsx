import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

const Modals = ({
  showModal,
  closeModal,
  headerName,
  buttonName,
  width,
  children,
  onConfirm = () => {},
  isDetail = false,
}) => {
  const [animationState, setAnimationState] = useState(false);

  useEffect(() => {
    if (showModal) setTimeout(() => setAnimationState(true), 10);
  }, [showModal]);

  const element = useRef(null);

  const close = () => {
    setAnimationState(false);
    setTimeout(closeModal, 200);
  };

  const isCloseModal = (e) => {
    if (element.current && !element.current.contains(e.target)) {
      close();
    }
  };

  if (!showModal) return null;

  return (
    <div
      className={`fixed inset-0 z-[10] flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
        animationState ? "opacity-100" : "opacity-0"
      }`}
      onClick={isCloseModal}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl p-6 relative transition-all duration-200 flex flex-col ${
          animationState
            ? "translate-y-0 opacity-100"
            : "-translate-y-8 opacity-0"
        }`}
        style={{ width: width || "480px", maxWidth: "90vw", maxHeight: "90vh" }}
        ref={element}
      >
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 shrink-0">
          <div className="text-xl font-bold text-navy-900">{headerName}</div>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 w-full">{children}</div>

        {!isDetail && (
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={close}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2.5 bg-navy-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm"
            >
              {buttonName}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modals;
