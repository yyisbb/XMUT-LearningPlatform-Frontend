import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Message,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './form';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import { getAllUser, updateStatus } from '@/api/user';

const { Title } = Typography;

function UserList() {
  const tableCallback = async (record, type) => {
    updateStatus({ username: record.username })
      .then((res) => {
        fetchData();
      })
      .catch((e) => {
        Message.error('error ' + e);
      })
      .finally(() => {
        setLoading(false);
      });
    console.log(record, type);
  };

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});

  const columns = useMemo(() => getColumns(tableCallback), []);
  const [visible, setVisible] = useState(false);
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);

    getAllUser({ current, pageSize, ...formParams })
      .then((res) => {
        setData(res.list);
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: res.total,
        });
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const addUserBtn = async () => {
    setVisible(true);
  };

  return (
    <Card>
      <Title heading={6}>用户管理</Title>
      <SearchForm onSearch={handleSearch} />
      <PermissionWrapper
        requiredPermissions={[
          { resource: 'menu.list.searchTable', actions: ['write'] },
        ]}
      >
        <div className={styles['button-group']}>
          <Space>
            <Button icon={<IconDownload />}>下载</Button>
          </Space>
        </div>
      </PermissionWrapper>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
    </Card>
  );
}

export default UserList;
