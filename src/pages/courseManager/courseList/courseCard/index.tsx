import React from 'react';
import { Card, Space, Tag, Typography } from '@arco-design/web-react';
import './index.css';
import { useHistory } from 'react-router';

const { Meta } = Card;

interface CourseCardProps {
  item?: {
    cover?: string;
    name?: string;
    description?: string;
    id?: number;
    className?: string;
    groupId?: string;
  };
  user?: {
    name?: string;
  };
}

function CourseCard(props: CourseCardProps) {
  const { item = {}, user = {} } = props;
  const history = useHistory();
  return (
    <Card
      onClick={() => {
        if (item.name) {
          history.push({
            pathname: '/courseManager/chapter',
            state: { id: item.id, courseGroupId: item.groupId },
          });
        }
      }}
      bordered
      hoverable
      className="card-with-icon-hover"
      style={{ cursor: 'pointer', maxWidth: '336px', margin: '5px 0px' }}
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
    >
      <Meta
        avatar={
          <Space>
            <Tag color="blue">教师: {user.name}</Tag>
            <Tag key={1} color="red">
              {item.className}
            </Tag>
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
