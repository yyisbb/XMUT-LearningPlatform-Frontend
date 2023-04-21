import * as React from 'react';
import { Card, Space } from '@arco-design/web-react';
import { useParams } from 'react-router';

export default function Chapter(props) {
  const { id } = useParams();
  return (
    <Space size={16} direction="vertical" style={{ width: '100%' }}>
      <Card>{id}</Card>
    </Space>
  );
}
