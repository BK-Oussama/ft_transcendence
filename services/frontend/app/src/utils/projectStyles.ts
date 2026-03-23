import { Megaphone, Rocket, Settings, BookOpen, Zap, Globe, Star, Layers } from 'lucide-react';

const styles = [
    { icon: Megaphone,  iconBgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    { icon: Rocket,     iconBgColor: 'bg-pink-100',   iconColor: 'text-pink-600'   },
    { icon: Settings,   iconBgColor: 'bg-blue-100',   iconColor: 'text-blue-600'   },
    { icon: BookOpen,   iconBgColor: 'bg-green-100',  iconColor: 'text-green-600'  },
    { icon: Zap,        iconBgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { icon: Globe,      iconBgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { icon: Star,       iconBgColor: 'bg-red-100',    iconColor: 'text-red-600'    },
    { icon: Layers,     iconBgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
];

// returns a style object based on the project id
export const getProjectStyle = (projectId: number) => {
  return styles[projectId % styles.length];
};