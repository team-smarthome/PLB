import { useEffect, useRef, useState } from "react";
import "./modalstyle.css";
import { IoMdClose } from "react-icons/io";

const Modals = ({
  showModal,
  closeModal,
  headerName,
  buttonName,
  width,
  children,
  onConfirm = () => { },
  isDetail = false,
}) => {
  const [animationState, setAnimationState] = useState(false);

  useEffect(() => {
    if (showModal) setTimeout(() => setAnimationState(true), 0);
  }, [showModal]);

  const element = useRef(null);

  const close = () => {
    setAnimationState(false);
    setTimeout(closeModal, 100);
  };

  const isCloseModal = (e) => {
    if (!element.current.contains(e.target)) {
      close();
    }
  };

  const Button = ({ children, onClick, type = "button", disabled = false }) => {
    return (
      <button
        className={`customButton ${disabled ? "buttonDisabled" : ""}`}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  return showModal ? (
    <div
      className={`modalAbsolute ${animationState ? "animation" : ""}`}
      onClick={isCloseModal}
    >
      <div
        className={`modalContent ${animationState ? "animation2" : ""}`}
        style={width ? { width: width } : {}}
        ref={element}
      >
        <div className="headerContainer">
          <div className="blockContent">{headerName}</div>
          <IoMdClose size={25} style={{ cursor: "pointer" }} onClick={close} />
        </div>
        {children}
        <div className="button-container">
          {!isDetail && (
            <>
              <Button onClick={close}>Cancel</Button>
              <Button onClick={onConfirm}>{buttonName}</Button>
            </>
          )
          }
        </div>
      </div>
    </div>
  ) : null;
};

export default Modals;
