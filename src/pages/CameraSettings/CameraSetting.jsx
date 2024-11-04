import React, { useRef, useState } from "react";
import RecognitionMode from "./RecognitionMode";
import RecognitionParameter from "./RecognitionParameter";
import RegistrationParameter from "./RegistrationParameter";
import SnapshotParameter from "./SnapshotParameter";
import TerminalUi from "./TerminalUI";
import AccessStrategy from "./AccessStrategy";
import AccessPassword from "./AccessPassword/Index";
import AccessControl from "./AccessControl";

const CameraSetting = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);
  const tabs = [
    { name: "Recognition Mode", component: <RecognitionMode /> },
    { name: "Recognition Parameters", component: <RecognitionParameter /> },
    { name: "Registration Parameters", component: <RegistrationParameter /> },
    { name: "Snapshot Parameters", component: <SnapshotParameter /> },
    { name: "Access Control", component: <AccessControl /> },
    { name: "Access Password", component: <AccessPassword /> },
    { name: "Terminal UI", component: <TerminalUi /> },
    { name: "Access Strategy", component: <AccessStrategy /> },
  ];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200; // Adjust scroll distance as needed
      scrollRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-4 ">
      <div className="flex items-center w-full mb-4 gap-1">
        <button
          onClick={() => handleScroll("prev")}
          className="px-2 py-2 bg-white text-gray-500 border-b border-gray-200 hover:text-black"
        >
          &#8249;
        </button>
        <div
          ref={scrollRef}
          className="flex-1 flex overflow-x-auto whitespace-nowrap border-b border-gray-200"
        >
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-1 px-4 py-2 text-center ${
                activeTab === index
                  ? "bg-btnPrimary text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleScroll("next")}
          className="px-2 py-2 bg-white text-gray-500 border-b border-gray-200 hover:text-black"
        >
          &#8250;
        </button>
      </div>
      <div className="w-full p-4">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default CameraSetting;
