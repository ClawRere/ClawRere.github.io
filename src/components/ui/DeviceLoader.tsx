import React from 'react';

export const DeviceLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`device-loader ${className}`} aria-label="加载中">
    <div className="device__a">
      <div className="device__a-1" />
      <div className="device__a-2" />
    </div>
    <div className="device__b" />
    <div className="device__c" />
    <div className="device__d" />
    <div className="device__e" />
    <div className="device__f" />
    <div className="device__g" />
  </div>
);
