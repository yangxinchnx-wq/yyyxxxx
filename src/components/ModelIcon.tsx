import React from 'react';
import { ModelIcon as LobeModelIcon, SiliconCloud } from '@lobehub/icons';
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
      <SiliconCloud.Color
        size={size}
        className={className}
        style={{ width: size, height: size }}
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
