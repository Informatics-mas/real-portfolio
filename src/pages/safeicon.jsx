import React from 'react';
// On importe TOUT le module sous le nom Lucide
import { 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaBriefcase, 
  FaMap, 
  FaPhone, 
  FaLink,
  FaLayerGroup,
  FaBolt,
  FaFigma,
  FaUpwork,
  FaPen
} from "react-icons/fa6"; // Font Awesome 6
import { IoLayersOutline, IoHardwareChipOutline, IoPhonePortraitOutline } from "react-icons/io5";

const iconMap = {
  // Marques & Réseaux
  Github: FaGithub,
  Linkedin: FaLinkedin,
  Mail: FaEnvelope,
  Upwork: FaUpwork,
  Briefcase: FaBriefcase,
  
  // Contact
  MapPin: FaMap,
  Phone: FaPhone,
  
  // Interface & Projets
  ExternalLink: FaLink,
  Layers: FaLayerGroup,
  Zap: FaBolt,
  Layout: IoLayersOutline,
  Server: IoHardwareChipOutline,
  Smartphone: IoPhonePortraitOutline,
  Design: FaFigma,
  Figma: FaFigma
};

const SafeIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`L'icône "${name}" n'est pas définie dans le dictionnaire React-Icons.`);
    return <FaBolt size={size} className={className} />; // Fallback
  }

  return <IconComponent size={size} className={className} />;
};

export default SafeIcon;