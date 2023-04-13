import React, { useState, useEffect, useCallback } from 'react';
import { Link, Card, Radio, Table, Typography } from '@arco-design/web-react';
import { IconCaretDown, IconCaretUp } from '@arco-design/web-react/icon';
import axios from 'axios';
import styles from './style/popular-contents.module.less';

function PopularContent() {
  const [type, setType] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(() => {
    setLoading(true);
    axios
      .get(
        `/api/workplace/popular-contents?page=${page}&pageSize=5&category=${type}`
      )
      .then((res) => {
        setData(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, type]);

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 65,
    },
    {
      title: '内容标题',
      dataIndex: 'title',
      render: (x) => (
        <Typography.Paragraph style={{ margin: 0 }} ellipsis>
          {x}
        </Typography.Paragraph>
      ),
    },
    {
      title: '点击量',
      dataIndex: 'pv',
      width: 100,
      render: (text) => {
        return `${text / 1000}k`;
      },
    },
    {
      title: '日涨幅',
      dataIndex: 'increase',
      sorter: (a, b) => a.increase - b.increase,
      width: 110,
      render: (text) => {
        return (
          <span>
            {`${(text * 100).toFixed(2)}%`}
            <span className={styles['symbol']}>
              {text < 0 ? (
                <IconCaretUp style={{ color: 'rgb(var(--green-6))' }} />
              ) : (
                <IconCaretDown style={{ color: 'rgb(var(--red-6))' }} />
              )}
            </span>
          </span>
        );
      },
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title heading={6}>线上热门内容</Typography.Title>
        <Link>查看更多</Link>
      </div>
      <Radio.Group
        type="button"
        value={type}
        onChange={setType}
        options={[
          { label: '文本', value: 0 },
          { label: '图片', value: 1 },
          { label: '视频', value: 2 },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Table
        rowKey="rank"
        columns={columns}
        data={data}
        loading={loading}
        tableLayoutFixed
        onChange={(pagination) => {
          setPage(pagination.current);
        }}
        pagination={{ total, current: page, pageSize: 5, simple: true }}
      />
    </Card>
  );
}

export default PopularContent;
