'use client';

import React from 'react';
import { Spin } from 'antd';
import type { SpinProps } from 'antd';
import { createStaticStyles } from 'antd-style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    padding: 0px;
    margin: 0px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `,
}));

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '#00d4ff',
  },
};

const stylesFn: SpinProps['styles'] = ({ props }) => {
  if (props.size === 'small') {
    return {
      indicator: {
        color: '#722ed1',
      },
    } satisfies SpinProps['styles'];
  }
  return {};
};

interface CustomSpinnerProps extends Omit<SpinProps, 'size'> {
  className?: string;
  size?: 'small' | 'default' | 'large' | number; // Support number for mapping from w-4 h-4 etc.
}

export const CustomSpinner: React.FC<CustomSpinnerProps> = ({ className, size, ...props }) => {
  const sharedProps: SpinProps = {
    spinning: true,
    percent: 0,
    classNames: { root: classNames.root },
    className,
    ...props,
  };

  // Map arbitrary sizes to antd sizes or use default
  let antdSize: 'small' | 'default' | 'large' = 'default';
  if (size === 'small' || size === 'large' || size === 'default') {
    antdSize = size;
  } else if (typeof size === 'number') {
    if (size < 20) antdSize = 'small';
    else if (size > 30) antdSize = 'large';
  } else {
    // Try to infer size from className (e.g., w-4, h-4 -> small, w-8 h-8 -> large)
    if (className?.includes('w-4') || className?.includes('w-3')) {
      antdSize = 'small';
    } else if (className?.includes('w-8') || className?.includes('h-8')) {
      antdSize = 'large';
    }
  }

  return (
    <Spin 
      {...sharedProps} 
      size={antdSize}
      styles={antdSize === 'small' ? stylesFn : stylesObject} 
    />
  );
};
