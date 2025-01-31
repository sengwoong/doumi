import { useSettingsStore } from '@/store/useSettingsStore';

interface TabsProps {
  children: React.ReactNode;
}

export function Tabs({ children }: TabsProps) {
  return <div>{children}</div>;
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex border-b border-gray-700">
      {children}
    </div>
  );
};

interface TabProps {
  value: string;
  children: React.ReactNode;
}

Tabs.Tab = function Tab({ value, children }: TabProps) {
  const { activeTab, setActiveTab } = useSettingsStore();
  const isSelected = activeTab === value;
  console.log(activeTab, value);
  console.log("tabs");
    
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        px-6 py-3 text-sm font-medium
        border-b-2 -mb-[2px]
        transition-colors duration-200
        ${isSelected 
          ? 'border-blue-500 text-blue-400' 
          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'}
      `}
    >
      {children}
    </button>
  );
}; 