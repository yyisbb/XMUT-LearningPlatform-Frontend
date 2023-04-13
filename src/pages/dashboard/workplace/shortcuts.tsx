import React from 'react';
import {
  Link,
  Card,
  Divider,
  Message,
  Typography,
} from '@arco-design/web-react';
import { IconFile, IconStorage } from '@arco-design/web-react/icon';
import styles from './style/shortcuts.module.less';

function Shortcuts() {
  const shortcuts = [
    {
      title: '内容管理',
      key: 'Content Management',
      icon: <IconFile />,
    },
  ];

  const recentShortcuts = [
    {
      title: '内容数据',
      key: 'Content Statistic',
      icon: <IconStorage />,
    },
  ];

  function onClickShortcut(key) {
    Message.info({
      content: (
        <span>
          You clicked <b>{key}</b>
        </span>
      ),
    });
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title heading={6}>快捷入口</Typography.Title>
        <Link>查看更多</Link>
      </div>
      <div className={styles.shortcuts}>
        {shortcuts.map((shortcut) => (
          <div
            className={styles.item}
            key={shortcut.key}
            onClick={() => onClickShortcut(shortcut.key)}
          >
            <div className={styles.icon}>{shortcut.icon}</div>
            <div className={styles.title}>{shortcut.title}</div>
          </div>
        ))}
      </div>
      <Divider />
      <div className={styles.recent}>最近访问</div>
      <div className={styles.shortcuts}>
        {recentShortcuts.map((shortcut) => (
          <div
            className={styles.item}
            key={shortcut.key}
            onClick={() => onClickShortcut(shortcut.key)}
          >
            <div className={styles.icon}>{shortcut.icon}</div>
            <div className={styles.title}>{shortcut.title}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default Shortcuts;
