import React from 'react';
import { ModelIcon as LobeModelIcon } from '@lobehub/icons';
// @ts-ignore
import siliconFlowImg from '../assets/siliconflow.png';
// @ts-ignore
import xiaomiLogoImg from '../assets/xiaomi.svg';

interface ModelIconProps {
  modelName: string;
  className?: string;
  size?: number;
}

const isSiliconFlow = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'siliconflow' ||
    lower === 'siliconcloud' ||
    lower.includes('siliconflow') ||
    lower.includes('siliconcloud') ||
    lower.includes('silicon-flow')
  );
};

const isXiaomi = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'xiaomi' ||
    lower === 'xiaomimimo' ||
    lower.includes('xiaomi') ||
    lower.startsWith('milm')
  );
};

export const ModelIcon: React.FC<ModelIconProps> = ({ modelName, className = "w-4 h-4", size = 16 }) => {
  // Standardize the model name (trimmed, lowercased) expected by @lobehub/icons
  const modelId = (modelName || '').trim().toLowerCase();

  if (isXiaomi(modelName)) {
    return (
      <img
        src={xiaomiLogoImg}
        alt="Xiaomi"
        className={`${className} object-contain inline-block shrink-0`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (isSiliconFlow(modelName)) {
    return (
      <img
        src={siliconFlowImg}
        alt="SiliconFlow"
        className={`${className} object-contain inline-block`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <LobeModelIcon 
      model={modelId} 
      size={size} 
      className={className}
      type="color"
    />
  );
};
