import React, { useState, useEffect, useMemo, ReactNode, useRef } from 'react';
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
import { generateAuthCode, getAuthCodeList } from '@/api/authCode';
import { FormInstance } from '@arco-design/web-react/es/Form';

const { Title } = Typography;

function AuthCodeList() {
  const tableCallback = async (record, type) => {
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
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);

    getAuthCodeList({ current, pageSize, ...formParams })
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
      const { school, count } = values;
      generateAuthCode({ school, count })
        .then((res) => {
          fetchData();
          Message.success('新增成功');
        })
        .catch((e) => {
          Message.error('新增失败: ' + e);
        })
        .finally(() => {
          setLoading(false);
          setVisible(false);
        });
    });
  };
  const cancel = () => {
    formRef.current.resetFields();
    setVisible(false);
  };
  return (
    <Card>
      <Title heading={6}>授权码管理</Title>
      <SearchForm onSearch={handleSearch} />
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
          </Space>
          <Space>
            <Button icon={<IconDownload />}>下载</Button>
          </Space>
        </div>
        <Modal
          title="新增授权码"
          visible={visible}
          onOk={onOk}
          onCancel={cancel}
          autoFocus={false}
          focusLock={true}
        >
          <Form ref={formRef} autoComplete="off">
            <Form.Item
              rules={[{ required: true }]}
              field={'school'}
              label="院校名"
            >
              <Input allowClear placeholder="请输入院校名..." />
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              field={'count'}
              label="生成数量"
            >
              <InputNumber
                mode="button"
                min={1}
                max={20}
                placeholder={'请输入数量...'}
                size={'default'}
                style={{ width: 160 }}
              />
            </Form.Item>
          </Form>
        </Modal>
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

export default AuthCodeList;
