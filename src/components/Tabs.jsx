import React, { useState } from "react";

export default function Tabs({ contents }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex mt-3">
        {contents.map((item, index) => (
          <button
            key={index}
            type="button"
            className={`p-2 px-4 w-full text-sm font-medium ${
              activeTab === index
                ? "text-textPrimary border-b border-border"
                : "text-textSecondary"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {item.tab_title}
          </button>
        ))}
      </div>
      <div className="p-4  dark:bg-opacity-40 border-opacity-80 border-background-light dark:border-background-dark border-t-0  text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark">
        {contents[activeTab].tab_contents}
      </div>
    </div>
  );
}
