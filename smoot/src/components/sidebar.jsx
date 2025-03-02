import React from "react";
import {
  VideoCameraIcon, SparklesIcon, ScissorsIcon, LinkIcon,
  RefreshIcon, ArchiveIcon, FilterIcon,
  InformationCircleIcon, PencilAltIcon, PhotographIcon,
  DocumentTextIcon, 
} from "@heroicons/react/outline";

const Sidebar = () => {
    const features = [
        { icon: VideoCameraIcon, label: "Video Silence Remover", enabled: true },
        { icon: SparklesIcon, label: "Effects", enabled: false },
        { icon: ScissorsIcon, label: "Video Trimmer", enabled: false },
        { icon: LinkIcon, label: "Video Merger", enabled: false },
        { icon: RefreshIcon, label: "Video Converter", enabled: false },
        { icon: ArchiveIcon, label: "Video Compressor", enabled: false },
        { icon: PhotographIcon, label: "Video Watermark", enabled: false },
        { icon: DocumentTextIcon, label: "Video Subtitles", enabled: false },
        { icon: FilterIcon, label: "Video Filters", enabled: false },
        { icon: PencilAltIcon, label: "Thumbnail Generator", enabled: false },
        { icon: InformationCircleIcon, label: "Metadata Editor", enabled: false },
    ];

    return (
        <div className="fixed top-0 left-0 h-full bg-customLight3 text-white p-4">
            <div className="flex flex-col space-y-4">
                {features.map(({ icon: Icon, label, enabled }, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Icon className={`h-6 w-6 ${enabled ? 'text-yellow-500' : 'text-gray-500'}`} />
                        <span className={`text-sm font-bold ${enabled ? 'text-white' : 'text-gray-500'}`}>
                            {label}
                        </span>
                        {!enabled && (
                            <span className="text-xs text-gray-400 ml-2">(Coming Soon)</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;