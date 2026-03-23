import { Plus } from 'lucide-react';

interface CreateWorkspaceCardProps {
onClick: () => void;
}

const CreateWorkspaceCard = ({ onClick }: CreateWorkspaceCardProps) => {
    return (
        <div 
        onClick={onClick}
        className="
            group 
            /* Match the height and padding of your original cards */
            min-h-[200px] p-6 
            /* Border: Dashed and subtle */
            border-2 border-dashed border-gray-200 
            rounded-xl 
            /* Flex layout to center everything */
            flex flex-col items-center justify-center 
            /* Transitions */
            transition-all duration-300 
            /* Hover states: Glow and border color change */
            hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm
            cursor-pointer
        "
        >
            {/* Icon Container: Small and subtle, turns blue on hover */}
            <div className="
                w-12 h-12 rounded-full 
                bg-gray-50 flex items-center justify-center 
                text-gray-400 
                group-hover:bg-blue-600 group-hover:text-white 
                transition-all duration-300
            ">
                <Plus size={28} strokeWidth={2.5} />
            </div>

            {/* Text styling */}
            <div className="mt-4 text-center">
                <span className="block text-sm font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
                    Create Workspace
                </span>
                <span className="text-[11px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Add a new project
                </span>
            </div>
        </div>
    );
};

export default CreateWorkspaceCard;