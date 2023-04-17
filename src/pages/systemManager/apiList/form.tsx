import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { Form, Input, DatePicker, Button, Grid } from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';

const { Row, Col } = Grid;
const { useForm } = Form;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const { lang } = useContext(GlobalContext);

  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  const colSpan = lang === 'zh-CN' ? 8 : 12;

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label="权限ID" field="id">
              <Input placeholder="请输入权限ID" allowClear />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="方法名" field="name">
              <Input allowClear placeholder="请输入方法名" />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="请求地址" field="url">
              <Input allowClear placeholder="请输入请求地址" />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="请求方法" field="method">
              <Input allowClear placeholder="请输入请求方法" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          查询
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;