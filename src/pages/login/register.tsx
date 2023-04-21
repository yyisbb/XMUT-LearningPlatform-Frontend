import { Form, Input, Button, Space, Message } from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import styles from './style/index.module.less';
import { useHistory } from 'react-router';
import { useUserInfoStore } from '@/store/user';
import { shallow } from 'zustand/shallow';

interface RegisterForm {
  pageChange?: boolean;
  setPageChange?: (b: boolean) => void;
}

export default function Register(props: RegisterForm) {
  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo, shallow);
  const userInfo = useUserInfoStore((state) => state.userInfo);

  function register(params) {
    setLoading(true);
    console.log(params);
    /*loginAPI({...params}).then((res) => {
            setToken(res);
            Message.success('登录成功')
            history.push('/dashboard/workplace')
        }).catch(e => {
            Message.error(e)
        }).finally(() => {
            setLoading(false);
        });*/
  }

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      register(values);
    });
  }

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>注册 Arco Design Pro</div>
      <div className={styles['login-form-sub-title']}>注册 Arco Design Pro</div>
      <Form className={styles['login-form']} layout="vertical" ref={formRef}>
        <Form.Item
          field="username"
          rules={[{ required: true, message: '用户名不能为空' }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder="请输入用户名"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder="请输入密码"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="name"
          rules={[{ required: true, message: '姓名不能为空' }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder="请输入姓名"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="email"
          rules={[{ required: true, message: '邮箱不能为空' }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder="请输入邮箱"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            注册
          </Button>
          <Button
            onClick={() => {
              props.setPageChange(!props.pageChange);
            }}
            long
            type="primary"
            status={'success'}
          >
            登录
          </Button>
        </Space>
      </Form>
    </div>
  );
}
