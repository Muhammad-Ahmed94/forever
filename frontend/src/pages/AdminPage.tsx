import { ChartNoAxesCombined, Plus, ShoppingBasket } from "lucide-react";
import { useState } from "react";

import AllProducts from "../components/AllProducts";
import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";

const activeTabs = [
  { id: "create", label: "Add Product", icon: Plus },
  { id: "products", label: "View Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="min-h-screen relative overflow-hidden text-font-main">
      <div className="flex flex-col align-center z-10 my-8">
        <h1 className="font-semibold text-2xl mb-4">Admin Dashboard</h1>
        <div className="mb-8 flex justify-center gap-4">
          {activeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`auth-btn transition-transform duration-200 cursor-pointer flex align-center gap-2 ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <AllProducts />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default AdminPage;
