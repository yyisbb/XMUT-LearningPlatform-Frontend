import React from 'react';
import { Button, Typography, Badge, Space } from '@arco-design/web-react';
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
      title: '角色名',
      dataIndex: 'name',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '角色标识',
      dataIndex: 'sn',
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
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <>
          <Space>
            {record.sn !== 'admin' ? (
              <Button
                type="primary"
                size="small"
                status={'warning'}
                onClick={() => callback(record, 'setPermission')}
              >
                设置权限
              </Button>
            ) : (
              ''
            )}
            {record.sn !== 'admin' ? (
              <Button
                type="primary"
                size="small"
                status={'danger'}
                onClick={() => callback(record, 'delete')}
              >
                删除
              </Button>
            ) : (
              ''
            )}
          </Space>
        </>
      ),
    },
  ];
}

export default () => ContentIcon;
