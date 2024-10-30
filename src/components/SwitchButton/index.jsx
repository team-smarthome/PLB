import React from 'react'

const SwitchButton = ({label, isChecked, handleCheckboxChange}) => {
  return (
    <label className="flex cursor-pointer select-none items-center gap-4">
          {label && <h3>{label}</h3>}
          <div className="relative">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="sr-only"
            />
            <div className={`block h-8 w-14 rounded-full ${isChecked ? "bg-btnPrimary" : "bg-[#E5E7EB]"}`}></div>
            <div
              style={{
                transform: isChecked ? 'translateX(24px)' : 'translateX(0)',
                transition: 'transform 0.3s ease',
              }}
              className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white"
            ></div>
          </div>
        </label>
  )
}

export default SwitchButton