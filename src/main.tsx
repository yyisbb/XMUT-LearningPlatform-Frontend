import './style/global.less';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageLayout from './layout';
import { GlobalContext } from './context';
import Login from './pages/login';
import changeTheme from './utils/changeTheme';
import useStorage from './utils/useStorage';
import './mock';

function Index() {
  const [lang, setLang] = useStorage('arco-lang', 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', 'light');
  /*function fetchUserInfo() {
    //TODO update-userInfo
    /!*store.dispatch({
          type: 'update-userInfo',
          payload: { userLoading: true },
        });
        axios.get('/api/user/userInfo').then((res) => {
          store.dispatch({
            type: 'update-userInfo',
            payload: { userInfo: res.data, userLoading: false },
          });
        });*!/
  }*/

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
