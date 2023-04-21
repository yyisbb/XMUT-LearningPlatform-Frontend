import React from 'react';
import { Button, Typography, Badge, Tag, Space } from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';
import dayjs from 'dayjs';
import styles from './style/index.module.less';

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
      title: '账号',
      dataIndex: 'username',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
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
      title: '角色',
      dataIndex: 'access',
      render: (value) => <Text copyable>{value.roleName}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value) => (
        <Tag color={value === 1 ? 'green' : 'red'}>
          {value === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <Space>
          {record.access.roleSn !== 'admin' ? (
            <Button
              type="primary"
              size="small"
              status="default"
              onClick={() => callback(record, 'role')}
            >
              修改角色
            </Button>
          ) : (
            ''
          )}
          {record.access.roleSn !== 'admin' ? (
            <Button
              type="primary"
              size="small"
              status={record.status ? 'danger' : 'success'}
              onClick={() => callback(record, 'status')}
            >
              {record.status ? '禁用' : '启用'}
            </Button>
          ) : (
            ''
          )}
        </Space>
      ),
    },
  ];
}

export default () => ContentIcon;
