'use client';

import React from 'react';

interface MotionWrapperProps {
  children: React.ReactNode;
  variant?: string;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  immediate?: boolean;
  as?: React.ElementType;
}

export function MotionWrapper({
  children,
  className,
  as: Tag = 'div',
}: MotionWrapperProps) {
  return <Tag className={className}>{children}</Tag>;
}

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: string;
}) {
  return <div className={className}>{children}</div>;
}
