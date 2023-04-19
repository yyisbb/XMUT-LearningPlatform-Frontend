import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Message,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './form';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import {
  createPermission,
  deletePermission,
  getPermissionList,
} from '@/api/permission';
import { FormInstance } from '@arco-design/web-react/es/Form';

const { Title } = Typography;

function ApiList() {
  const tableCallback = async (record, type) => {
    const { id } = record;
    deletePermission({ id })
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
  const formRef = useRef<FormInstance>();
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);

    getPermissionList({ current, pageSize, ...formParams })
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
      const { name, url, method } = values;
      createPermission({ name, url, method })
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
  return (
    <Card>
      <Title heading={6}>API管理</Title>
      <SearchForm onSearch={handleSearch} />
      <Modal
        title="新增API"
        visible={visible}
        onOk={onOk}
        onCancel={cancel}
        autoFocus={false}
        focusLock={true}
      >
        <Form ref={formRef} autoComplete="off">
          <Form.Item rules={[{ required: true }]} field={'name'} label="API名">
            <Input allowClear placeholder="请输入API名..." />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} field={'url'} label="URl地址">
            <Input allowClear placeholder="请输入URl地址..." />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            field={'method'}
            label="请求方法"
          >
            <Input allowClear placeholder="请输入请求方法..." />
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
              新增
            </Button>
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

export default ApiList;
