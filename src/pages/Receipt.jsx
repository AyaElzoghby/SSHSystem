// import React from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";


import AccountForm from "./AccountFormCostCenter";
import NestedTree from "../components/NestedTree";
import InputComponent from "@/components/InputComponent";
export default function Receipt() {
  const items = {
    company: {
      name: "Company",
      children: ["engineering", "marketing", "operations"],
    },
    engineering: {
      name: "Engineering",
      children: ["frontend", "backend", "platform-team"],
    },
    frontend: { name: "Frontend", children: ["design-system", "web-platform"] },
    "design-system": {
      name: "Design System",
      children: ["components", "tokens", "guidelines"],
    },
    components: { name: "Components" },
    tokens: { name: "Tokens" },
    guidelines: { name: "Guidelines" },
    "web-platform": { name: "Web Platform" },
    backend: { name: "Backend", children: ["apis", "infrastructure"] },
    apis: { name: "APIs" },
    infrastructure: { name: "Infrastructure" },
    "platform-team": { name: "Platform Team" },
    marketing: { name: "Marketing", children: ["content", "seo"] },
    content: { name: "Content" },
    seo: { name: "SEO" },
    operations: { name: "Operations", children: ["hr", "finance"] },
    hr: { name: "HR" },
    finance: { name: "Finance" },
  };
  return (
    <>
      <div className="flex-col p-4 justify-around my-auto overflow-y-auto">
        <div className="flex grid grid-cols-12 my-5 gap-x-5" dir="rtl">
          <div className="col-span-5 bg-[#ffffff] p-4 shadow-md h-fit rounded-lg">
            <h3 className="block mb-1 border-orange-400 border-b-2 w-fit mb-4 font-bold text-gray-700">هيكليه الوحدات</h3>
            <NestedTree data={items} initialExpanded={items[0]} />
          </div>
          <div className="col-span-7 ">
            <AccountForm />
          </div>
        </div>
      </div>
    </>
  );
}
