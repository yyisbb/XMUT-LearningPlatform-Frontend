import React, { useContext, useEffect } from 'react';
import {
  Tooltip,
  Input,
  Avatar,
  Dropdown,
  Menu,
  Divider,
  Message,
} from '@arco-design/web-react';
import {
  IconNotification,
  IconSunFill,
  IconMoonFill,
  IconUser,
  IconSettings,
  IconPoweroff,
  IconExperiment,
  IconDashboard,
  IconTag,
} from '@arco-design/web-react/icon';
import { GlobalContext } from '@/context';
import Logo from '@/assets/logo.svg';
import MessageBox from '@/components/MessageBox';
import IconButton from './IconButton';
import styles from './style/index.module.less';
import useStorage from '@/utils/useStorage';
import { removeToken } from '@/store/token';
import { useUserInfoStore } from '@/store/user';
import { shallow } from 'zustand/shallow';

function Navbar({}: { show: boolean }) {
  const [role, setRole] = useStorage('userRole', 'admin');

  const { theme, setTheme } = useContext(GlobalContext);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo, shallow);

  function logout() {
    removeToken();
    setUserInfo({});
    window.location.href = '/login';
  }

  function onMenuItemClick(key) {
    if (key === 'logout') {
      logout();
    } else {
      Message.info(`You clicked ${key}`);
    }
  }

  useEffect(() => {
    //TODO update-userInfo
    /*dispatch({
      type: 'update-userInfo',
      payload: {
        userInfo: {
          ...userInfo,
          permissions: generatePermission(role),
        },
      },
    });*/
  }, [role]);

  const handleChangeRole = () => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    setRole(newRole);
  };

  const droplist = (
    <Menu onClickMenuItem={onMenuItemClick}>
      <Menu.Item key="setting">
        <IconSettings className={styles['dropdown-icon']} />
        用户设置
      </Menu.Item>

      <Divider style={{ margin: '4px 0' }} />
      <Menu.Item key="logout">
        <IconPoweroff className={styles['dropdown-icon']} />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Logo />
          <div className={styles['logo-name']}>Arco Pro</div>
        </div>
      </div>
      <ul className={styles.right}>
        <li>
          <Input.Search className={styles.round} placeholder="输入内容查询" />
        </li>
        <li>
          <MessageBox>
            <IconButton icon={<IconNotification />} />
          </MessageBox>
        </li>
        <li>
          <Tooltip
            content={
              theme === 'light' ? '点击切换为暗黑模式' : '点击切换为亮色模式'
            }
          >
            <IconButton
              icon={theme !== 'dark' ? <IconMoonFill /> : <IconSunFill />}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
          </Tooltip>
        </li>

        <li>
          <Dropdown droplist={droplist} position="br">
            <Avatar size={32} style={{ backgroundColor: '#00d0b6' }}>
              {userInfo.name}
            </Avatar>
          </Dropdown>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
