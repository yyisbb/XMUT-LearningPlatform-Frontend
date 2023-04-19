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
  InputNumber,
  Modal,
  Transfer,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './form';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import { createRole, deleteRole, getRoleList } from '@/api/role';
import { FormInstance } from '@arco-design/web-react/es/Form';

const { Title } = Typography;

function RoleList() {
  const tableCallback = async (record, type) => {
    switch (type) {
      case 'delete':
        const { sn } = record;
        deleteRole({ sn })
          .then((res) => {
            fetchData();
            Message.success('删除成功');
          })
          .catch((e) => {
            Message.error('删除失败: ' + e);
          })
          .finally(() => {
            setLoading(false);
            setVisible(false);
          });
        break;
      case 'setPermission':
        setTransferVisible(true);
        break;
    }
  };

  const [visible, setVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);
  const formRef = useRef<FormInstance>();

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

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);

    getRoleList({ current, pageSize, ...formParams })
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
    console.log(params);
    setFormParams(params);
  }

  const createBtn = () => {
    setVisible(true);
  };

  const onOk = () => {
    formRef.current.validate().then((values) => {
      const { name, sn } = values;
      createRole({ name, sn })
        .then((res) => {
          fetchData();
          Message.success('新增成功');
          setVisible(false);
        })
        .catch((e) => {
          Message.error('新增失败: ' + e);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };
  const cancel = () => {
    formRef.current.resetFields();
    setVisible(false);
  };

  const transferVisibleCancel = () => {
    setVisible(false);
  };

  const dataSource = new Array(100).fill(null).map((_, index) => ({
    key: `${index + 1}`,
    value: `Option ${index + 1}`,
  }));

  return (
    <Card>
      <Title heading={6}>角色管理</Title>
      <SearchForm onSearch={handleSearch} />
      <Modal
        title="赋予权限"
        visible={transferVisible}
        autoFocus={false}
        onCancel={() => {
          setTransferVisible(false);
        }}
        focusLock={true}
      >
        <Transfer
          dataSource={dataSource}
          oneWay
          pagination
          onChange={(leftSelectedKeys, rightSelectedKeys) => {
            console.log(leftSelectedKeys);
            console.log(rightSelectedKeys);
          }}
          defaultTargetKeys={['1', '2', '3']}
          defaultSelectedKeys={['4', '6', '7']}
          titleTexts={['未分配权限', '已分配权限']}
        />
      </Modal>
      <Modal
        title="新增角色"
        visible={visible}
        onOk={onOk}
        onCancel={cancel}
        autoFocus={false}
        focusLock={true}
      >
        <Form ref={formRef} autoComplete="off">
          <Form.Item rules={[{ required: true }]} field={'name'} label="角色名">
            <Input allowClear placeholder="请输入角色名..." />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} field={'sn'} label="角色标识">
            <Input allowClear placeholder="请输入角色标识..." />
          </Form.Item>
        </Form>
      </Modal>
      <PermissionWrapper
        requiredPermissions={[
          { resource: 'menu.list.searchTable', actions: ['write'] },
        ]}
      >
        <div className={styles['button-group']}>
          <Space>
            <Button onClick={createBtn} type="primary" icon={<IconPlus />}>
              新建
            </Button>
            <Button>批量导入</Button>
          </Space>
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

export default RoleList;
