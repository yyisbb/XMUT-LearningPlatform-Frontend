import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Message,
  Form,
  Input,
  Modal,
  Select,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './form';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import { getAllUser, insertUserRole, updateStatus } from '@/api/user';
import { getRoleList } from '@/api/role';

const { Title } = Typography;
const Option = Select.Option;

function UserList() {
  const tableCallback = async (record, type) => {
    switch (type) {
      case 'status':
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
        break;
      case 'role':
        const { id } = record;
        setUserId(id);
        getRoleList({})
          .then((res) => {
            setRoleList(res.list);
          })
          .finally(() => {
            setLoading(false);
          });
        setVisible(true);
        break;
    }
  };

  const [data, setData] = useState([]);
  const [roleList, setRoleList] = useState([]);
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
  const [roleId, setRoleId] = useState(0);
  const [userId, setUserId] = useState(0);

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

  const onOk = () => {
    insertUserRole({ userId, roleId })
      .then((res) => {
        Message.success('设置成功');
        fetchData();
      })
      .catch((e) => {
        Message.error('设置失败 ' + e);
      })
      .finally(() => {
        setLoading(false);
        setVisible(false);
      });
  };
  const cancel = () => {
    setVisible(false);
  };

  return (
    <Card>
      <Title heading={6}>用户管理</Title>
      <SearchForm onSearch={handleSearch} />
      <Modal
        title="设置角色"
        visible={visible}
        onOk={onOk}
        onCancel={cancel}
        autoFocus={false}
        focusLock={true}
      >
        <Select
          addBefore={'角色'}
          placeholder="请选择角色"
          onChange={(value) => {
            setRoleId(value);
          }}
          style={{ width: '100%' }}
        >
          {roleList.map((option) => (
            <Option key={option.id} value={option.id}>
              {option.name}
            </Option>
          ))}
        </Select>
      </Modal>
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
