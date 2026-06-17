import React from 'react';
import {
  ModelIcon as LobeModelIcon,
  OpenAI,
  Claude,
  DeepSeek,
  Gemini,
  Qwen,
  Moonshot,
  ChatGLM,
  Minimax,
  Meta,
  Mistral,
} from '@lobehub/icons';
// @ts-ignore
import xiaomiLogoImg from '../assets/xiaomi.webp';
// @ts-ignore
import claudeLogoImg from '../assets/claude.webp';
// @ts-ignore
import siliconflowLogoImg from '../assets/siliconflow.svg';

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

const isClaude = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return lower.includes('claude') || lower === 'anthropic';
};

const isminimax = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'minimax' ||
    lower.includes('minimax') ||
    lower.startsWith('MiniMax-') ||
    lower === 'MiniMax-m3' ||
    lower.startsWith('m3-') ||
    lower.includes('minmax') ||
    lower.includes('abab')
  );
};

const isZhipu = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'zhipu' ||
    lower === 'chatglm' ||
    lower === 'glm' ||
    lower.includes('zhipu') ||
    lower.includes('chatglm') ||
    lower.startsWith('glm-') ||
    lower.startsWith('glm4') ||
    lower.startsWith('glm5') ||
    lower.startsWith('cogview')
  );
};

const isOpenAI = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'openai' ||
    lower.startsWith('gpt-') ||
    lower.startsWith('gpt3') ||
    lower.startsWith('gpt4') ||
    lower.startsWith('gpt5') ||
    lower === 'o1' || lower.startsWith('o1-') ||
    lower === 'o3' || lower.startsWith('o3-') ||
    lower === 'o4' || lower.startsWith('o4-') ||
    lower.includes('text-embedding-') ||
    lower.includes('dall-e') ||
    lower.includes('whisper')
  );
};

const isDeepSeek = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return lower.includes('deepseek');
};

const isGemini = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'gemini' ||
    lower === 'google' ||
    lower.includes('gemini') ||
    lower.startsWith('gemma')
  );
};

const isQwen = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'qwen' ||
    lower.includes('qwen') ||
    lower.startsWith('qwq')
  );
};

const isMoonshot = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'moonshot' ||
    lower === 'kimi' ||
    lower.includes('moonshot') ||
    lower.includes('kimi')
  );
};

const isMeta = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'meta' ||
    lower.includes('llama') ||
    lower.startsWith('codellama')
  );
};

const isMistral = (name: string): boolean => {
  const lower = (name || '').trim().toLowerCase();
  return (
    lower === 'mistral' ||
    lower.includes('mistral') ||
    lower.includes('mixtral')
  );
};

export const ModelIcon: React.FC<ModelIconProps> = ({ modelName, className = "w-4 h-4", size = 16 }) => {
  const modelId = (modelName || '').trim().toLowerCase();

  if (isXiaomi(modelName)) {
    return (
      <img
        src={xiaomiLogoImg}
        alt="Xiaomi MiMo"
        className={`${className} object-contain inline-block shrink-0 rounded-md`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (isClaude(modelName)) {
    return (
      <img
        src={claudeLogoImg}
        alt="Claude"
        className={`${className} object-contain inline-block shrink-0 rounded-md`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (isSiliconFlow(modelName)) {
    return (
      <img
        src={siliconflowLogoImg}
        alt="SiliconFlow"
        className={`${className} object-contain inline-block shrink-0 rounded-md`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (isminimax(modelName)) {
    return <Minimax.Color size={size} className={className} />;
  }

  if (isZhipu(modelName)) {
    return <ChatGLM.Color size={size} className={className} />;
  }

  if (isOpenAI(modelName)) {
    return <OpenAI size={size} className={className} />;
  }

  if (isDeepSeek(modelName)) {
    return <DeepSeek.Color size={size} className={className} />;
  }

  if (isGemini(modelName)) {
    return <Gemini.Color size={size} className={className} />;
  }

  if (isQwen(modelName)) {
    return <Qwen.Color size={size} className={className} />;
  }

  if (isMoonshot(modelName)) {
    return <Moonshot size={size} className={className} />;
  }

  if (isMeta(modelName)) {
    return <Meta.Color size={size} className={className} />;
  }

  if (isMistral(modelName)) {
    return <Mistral.Color size={size} className={className} />;
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
