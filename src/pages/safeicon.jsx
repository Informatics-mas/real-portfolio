import React from 'react';
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaBriefcase,
  FaLocationDot,
  FaPhone,
  FaWhatsapp,
  FaArrowUpRightFromSquare,
  FaLayerGroup,
  FaBolt,
  FaFigma,
  FaUpwork,
  FaGraduationCap,
} from 'react-icons/fa6';
import { IoLayersOutline, IoHardwareChipOutline, IoPhonePortraitOutline } from 'react-icons/io5';

const iconMap = {
  // Marques & réseaux
  Github: FaGithub,
  Linkedin: FaLinkedin,
  Mail: FaEnvelope,
  Upwork: FaUpwork,
  Briefcase: FaBriefcase,
  Whatsapp: FaWhatsapp,

  // Contact
  MapPin: FaLocationDot,
  Phone: FaPhone,

  // Interface & projets
  ExternalLink: FaArrowUpRightFromSquare,
  Layers: FaLayerGroup,
  Zap: FaBolt,
  Layout: IoLayersOutline,
  Server: IoHardwareChipOutline,
  Smartphone: IoPhonePortraitOutline,
  Design: FaFigma,
  Figma: FaFigma,
  Graduation: FaGraduationCap,
};

const SafeIcon = ({ name, size = 20, className = '' }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`L'icône "${name}" n'est pas définie dans iconMap.`);
    return <FaBolt size={size} className={className} aria-hidden="true" />;
  }

  return <IconComponent size={size} className={className} aria-hidden="true" />;
};

export default SafeIcon;