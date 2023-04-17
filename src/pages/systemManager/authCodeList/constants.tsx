import React from 'react';
import { Typography } from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';

const { Text } = Typography;

const ContentIcon = [
  <IconText key={0} />,
  <IconHorizontalVideo key={1} />,
  <IconVerticalVideo key={2} />,
];

export function getColumns(
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '授权码',
      dataIndex: 'code',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '院校',
      dataIndex: 'school',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      render: (value) => <Text copyable>{value || '暂未修改'}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value) => (
        <Text copyable>{value === 1 ? '已使用' : '未使用'}</Text>
      ),
    },
  ];
}

export default () => ContentIcon;
