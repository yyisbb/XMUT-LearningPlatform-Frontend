import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Form,
  Input,
  Message,
  Modal,
  Select,
  Space,
} from '@arco-design/web-react';
import styles from '@/pages/login/style/index.module.less';
import {
  IconEmail,
  IconIdcard,
  IconLock,
  IconUser,
} from '@arco-design/web-react/icon';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { useUserInfoStore } from '@/store/user';
import { shallow } from 'zustand/shallow';
import { getToken, setToken } from '@/store/token';
import { getUserInfo, loginAPI } from '@/api/user';
import { getRoleList } from '@/api/role';
interface AddUserFormProps {
  visible?: boolean;
  setVisible?: (b: boolean) => any;
  roleList?: Array<any>;
}

function AddUserForm(props: AddUserFormProps) {
  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo, shallow);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const Option = Select.Option;

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

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  function onSubmitClick() {
    //TODO
    console.log(1);
  }

  return (
    <Modal
      title="添加用户"
      visible={props.visible}
      onOk={() => props.setVisible(false)}
      onCancel={() => props.setVisible(false)}
      autoFocus={false}
      focusLock={true}
    >
      <Form
        className={styles['login-form']}
        layout="vertical"
        ref={formRef}
        initialValues={{ username: '', password: '' }}
      >
        <Form.Item
          field="username"
          rules={[{ required: true, message: '账号不能为空' }]}
        >
          <Input
            prefix={<IconIdcard />}
            placeholder="请输入用户名"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="email"
          rules={[{ required: true, message: '邮箱不能为空' }]}
        >
          <Input.Password
            prefix={<IconEmail />}
            placeholder="请输入邮箱"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="name"
          rules={[{ required: true, message: '姓名不能为空' }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder="请输入姓名"
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item field="role">
          <Select
            addBefore="角色"
            placeholder="请选择角色"
            style={{ width: '100%' }}
            onChange={(value) =>
              Message.info({
                content: `You select ${value}.`,
                showIcon: true,
              })
            }
          >
            {props.roleList.map((option, index) => (
              <Option key={option} disabled={index === 3} value={option.roleId}>
                {option.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddUserForm;
