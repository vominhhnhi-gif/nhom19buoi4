import React from 'react';

const EmptyState = ({ title = 'Không có dữ liệu', description = '', icon = null }) => (
  <div className="text-center py-12">
    {icon}
    <h3 className="text-xl font-medium text-gray-900 mt-4">{title}</h3>
    {description && <p className="text-gray-500 mt-2">{description}</p>}
  </div>
);

export default EmptyState;
