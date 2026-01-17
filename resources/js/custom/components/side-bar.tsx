import { router, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Tab {
    name: string;
    icon: React.ReactNode;
    href?: string | null;
    children?: Tab[];
}

interface SideBarProps {
    tabs: Tab[];
}

export function SideBar({ tabs }: SideBarProps) {
    const { url } = usePage();
    const [activeTab, setActiveTab] = useState('Dashboard');
    // const [activeChild, setActiveChild] = useState('');
    const [parent, setParent] = useState<string>('');
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    useEffect(() => {
        for (const tab of tabs) {
            if (tab.href && url === tab.href) {
                setActiveTab(tab.name);
                return;
            }
            if (tab.children) {
                for (const child of tab.children) {
                    if (child.href && url === child.href) {
                        setActiveTab(child.name);
                        setParent(tab.name);
                        return;
                    }
                }
            }
        }
    }, [url, tabs]);

    const handleTabClick = (tab: Tab) => {
        if (tab.href) {
            router.visit(tab.href);
        }
    };

    return (
        <div className="flex h-[calc(100vh-56px)] w-20 flex-col bg-[#2C3E50] text-white sm:w-64">
            <nav className="flex-1 space-y-1 pt-4">
                {tabs.map((tab) => (
                    <div
                        key={tab.name}
                        className="relative"
                        onMouseEnter={() => setHoveredTab(tab.name)}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        <button
                            onClick={() => handleTabClick(tab)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all ${
                                activeTab === tab.name || parent === tab.name
                                    ? 'bg-[#F96901] text-white shadow-md'
                                    : 'text-gray-300 hover:bg-[#34495e] hover:text-white'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden font-medium sm:block">
                                {tab.name}
                            </span>
                            {tab.children && tab.children.length > 0 && (
                                <ChevronRight
                                    size={16}
                                    className="ml-auto hidden sm:block"
                                />
                            )}
                        </button>

                        {/* Children dropdown on hover */}
                        {tab.children &&
                            tab.children.length > 0 &&
                            hoveredTab === tab.name && (
                                <div className="absolute top-0 left-full z-50 ml-2 w-48 rounded-lg bg-[#34495e] shadow-lg">
                                    <div className="space-y-1 p-2">
                                        {tab.children.map((child) => (
                                            <button
                                                key={child.name}
                                                onClick={() =>
                                                    handleTabClick(child)
                                                }
                                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all hover:bg-[#F96901] ${
                                                    activeTab === child.name
                                                        ? 'bg-[#F96901] text-white shadow-md'
                                                        : 'text-gray-300 hover:bg-[#34495e] hover:text-white'
                                                }`}
                                            >
                                                {child.icon}
                                                <span>{child.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-600 p-4">
                <div className="flex flex-wrap text-xs text-gray-400">
                    © 2026 OrderSystem Development Team
                </div>
            </div>
        </div>
    );
}
