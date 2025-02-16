import React, { useState, useEffect } from "react";
// @ts-ignore
import css from "/components/UI/Instruction/Instruction.module.css";

const InstructionModal = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage < 5) {
        setCurrentPage(currentPage + 1);
      } else {
        onClose();
      }
    }, 4000); // Automatically close or move to the next page after 5 seconds

    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <div className={css.modal}>
      { currentPage > 0 &&
        <div className={css.modalContent}>
          <button className={css.closeButton } onClick={onClose}>
            <img src="/UI/close.png" alt="Close" width={32}/>
          </button>
          <img className={`${css.fade} ${currentPage === 1 ? css.visible : ""}`} src="/UI/inst_1.png" alt="Zoom to adjust view" />
          <img className={`${css.fade} ${currentPage === 2 ? css.visible : ""}`} src="/UI/inst_2.png" alt="Click on the map to move" />
          <img className={`${css.fade} ${currentPage === 3 ? css.visible : ""}`} src="/UI/inst_3.png" alt="Click on the objects to interact" />
          <img className={`${css.fade} ${currentPage === 4 ? css.visible : ""}`} src="/UI/inst_4.png" alt="Click on the objects to interact" />
          <img className={`${css.fade} ${currentPage === 5 ? css.visible : ""}`} src="/UI/inst_5.png" alt="Click on the objects to interact" />
        </div>
        }
    </div>
  );
};

export default InstructionModal;
