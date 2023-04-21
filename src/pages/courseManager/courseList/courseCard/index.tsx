import React from 'react';
import {
  IconMore,
  IconShareInternal,
  IconThumbUp,
} from '@arco-design/web-react/icon';
import { Avatar, Card, Space, Typography } from '@arco-design/web-react';
import './index.css';
const { Meta } = Card;

interface CourseCardProps {
  item?: {
    cover?: string;
    name?: string;
    description?: string;
  };
  user?: {
    name?: string;
  };
}

function CourseCard(props: CourseCardProps) {
  const { item = {}, user = {} } = props;

  return (
    <Card
      bordered
      hoverable
      className="card-with-icon-hover"
      style={{ maxWidth: '336px', margin: '5px 0px' }}
      cover={
        <div style={{ height: 204, overflow: 'hidden' }}>
          <img
            style={{ width: '100%', transform: 'translateY(-20px)' }}
            alt="dessert"
            src={
              item.cover ||
              'https://attachment-center.boxuegu.com/data/picture/univ/2022/09/13/15/81fd8d788a2b477ea85597ba426c3b30.png'
            }
          />
        </div>
      }
      actions={[
        <span key={1} className="icon-hover">
          <IconThumbUp />
        </span>,
        <span key={2} className="icon-hover">
          <IconShareInternal />
        </span>,
        <span key={3} className="icon-hover">
          <IconMore />
        </span>,
      ]}
    >
      <Meta
        avatar={
          <Space>
            <Avatar size={30}>{user.name}</Avatar>
            <Typography.Text>{user.name}</Typography.Text>
          </Space>
        }
        title={item.name || '示例课程'}
        description={
          <Typography.Text ellipsis forceShowExpand>
            {item.description || '右下角添加课程,该课程将在新增后隐藏'}
          </Typography.Text>
        }
      />
    </Card>
  );
}

export default CourseCard;
