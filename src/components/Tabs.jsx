import React, { useState } from "react";

export default function Tabs({ contents }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full rounded-lg">
      <div className="flex rounded-lg mt-4">
        {contents.map((item, index) => (
          <button
            key={index}
            type="button"
            className={`p-2 px-4 w-full text-sm rounded-ss-lg rounded-se-lg font-medium ${
              activeTab === index
                ? "text-text-dark  bg-button-warning-light dark:bg-button-warning-dark"
                : "text-text-dark dark:bg-opacity-40 bg-opacity-80 bg-background-light dark:bg-background-dark"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {item.tab_title}
          </button>
        ))}
      </div>
      <div className="p-4 border-2 rounded-ee-lg rounded-es-lg dark:bg-opacity-40 border-opacity-80 border-background-light dark:border-background-dark border-t-0  text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark">
        {contents[activeTab].tab_contents}
      </div>
    </div>
  );
}
