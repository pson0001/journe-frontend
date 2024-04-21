import React, { useState, useEffect, useRef } from "react";
import c from "./dropdown.module.scss";
import Icon from "../../../assets/Icon";

const Dropdown = ({ options, selectedIndex, setSelectedIndex }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleOptionSelect = (option) => {
    setSelectedIndex(option);
    setIsOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={c.dropdown}>
      <button onClick={toggleDropdown} className={c.dropdownButton}>
        {options && options[selectedIndex]?.pot_title}
        <div className={isOpen ? [c.rotate, c.arrow].join(" ") : c.arrow}>
          <Icon.ChevronDown />
        </div>
      </button>
      {isOpen && (
        <ul className={c.dropdownMenu}>
          {options.map((option, index) => (
            <li key={option.value} onClick={() => handleOptionSelect(index)}>
              {option.pot_title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
