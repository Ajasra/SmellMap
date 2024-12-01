import React, { useState, useEffect } from "react";
// @ts-ignore
import css from "/components/UI/Instruction/Instruction.module.css";

const InstructionModal = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        setCurrentPage(2);
      } else {
        onClose();
      }
    }, 15000); // Automatically close or move to the next page after 5 seconds

    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <div className={css.modal}>
      <div className={css.modalContent}>
        <button className={css.closeButton} onClick={onClose}>
          &#x2715;
        </button>
        {currentPage === 1 ? (
          <div>
            <h1>How to Interact with the Map</h1>
            <p>Use your mouse to navigate and zoom in/out on the map.</p>
            <button onClick={() => setCurrentPage(2)}>Next</button>
          </div>
        ) : (
          <div>
            <h1>Interactive Elements</h1>
            <p>Click on objects with fields to interact with them.</p>
            <p>
              Click on parts of the route drawn on the map to play a video for
              the current location.
            </p>
            <button onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionModal;
