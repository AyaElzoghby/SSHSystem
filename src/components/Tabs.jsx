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
      <div className="p-4 me-4 pe-2 dark:bg-opacity-40 border-opacity-80 border-background-light dark:border-background-dark border-t-0 my-5 text-text-light dark:text-text-dark bg-navbar-bg-light dark:bg-navbar-bg-dark  max-h-80 lg:max-h-[80svh] overflow-y-auto  [&::-webkit-scrollbar]:w-3
                [&::-webkit-scrollbar-track]:rounded-md
                [&::-webkit-scrollbar-track]:bg-surface
                [&::-webkit-scrollbar-thumb]:rounded-md
                [&::-webkit-scrollbar-thumb]:bg-surfaceHover">
        {contents[activeTab].tab_contents}
      </div>
    </div>
  );
}
