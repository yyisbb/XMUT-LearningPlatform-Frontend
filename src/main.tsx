import './style/global.less';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider, Message } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageLayout from './layout';
import { GlobalContext } from './context';
import Login from './pages/login';
import changeTheme from './utils/changeTheme';
import useStorage from './utils/useStorage';
import './mock';
import { useUserInfoStore } from '@/store/user';
import { getUserInfo, loginAPI } from '@/api/user';
import { getToken, setToken } from '@/store/token';
import { shallow } from 'zustand/shallow';

function Index() {
  const [lang, setLang] = useStorage('arco-lang', 'zh-CN');
  const [theme, setTheme] = useStorage('arco-theme', 'light');
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
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  return (
    <BrowserRouter>
      <ConfigProvider
        locale={zhCN}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <GlobalContext.Provider value={contextValue}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={PageLayout} />
          </Switch>
        </GlobalContext.Provider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

const Root = () => {
  return (
    <>
      <Index />
    </>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
