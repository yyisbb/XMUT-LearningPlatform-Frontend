import { Form, Input, Button, Space, Message } from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import styles from './style/index.module.less';
import { getUserInfo, loginAPI } from '@/api/user';
import { getToken, setToken } from '@/store/token';
import { useHistory } from 'react-router';
import { useUserInfoStore } from '@/store/user';
import { shallow } from 'zustand/shallow';

interface LoginForm {
  pageChange?: boolean;
  setPageChange?: (b: boolean) => void;
}
export default function LoginForm(props: LoginForm) {
  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo, shallow);
  const userInfo = useUserInfoStore((state) => state.userInfo);

  const fetchUserInfo = () => {
    if (getToken() || !userInfo) {
      getUserInfo()
        .then((res) => {
          //存store
          setUserInfo(res);
          return;
        })
        .catch((e) => {
          Message.error(e);
        });
    }
  };

  function login(params) {
    setLoading(true);
    loginAPI({ ...params })
      .then((res) => {
        setToken(res);
        Message.success('登录成功');
        history.push('/dashboard/workplace');
        fetchUserInfo();
      })
      .catch((e) => {
        Message.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      login(values);
    });
  }

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>登录 高校教辅平台</div>
      <div className={styles['login-form-sub-title']}>登录 高校教辅平台</div>
      <Form
        className={styles['login-form']}
        layout="vertical"
        ref={formRef}
        initialValues={{ username: 'admin', password: 'admin' }}
      >
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
        <Space size={16} direction="vertical">
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            登录
          </Button>
          <Button
            onClick={() => {
              props.setPageChange(!props.pageChange);
            }}
            long
            type="primary"
            status={'warning'}
          >
            注册
          </Button>
        </Space>
      </Form>
    </div>
  );
}
