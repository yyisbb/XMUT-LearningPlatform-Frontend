import * as React from 'react';
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Form,
  Input,
  Message,
  Modal,
  Space,
  Upload,
} from '@arco-design/web-react';
import { Collapse } from '@arco-design/web-react';

const CollapseItem = Collapse.Item;
import { List, Avatar } from '@arco-design/web-react';
import { useEffect, useRef, useState } from 'react';
import {
  addCourse,
  getCourseByCourseId,
  getTeacherAllCourse,
} from '@/api/course';
import { getCourseAllChapter, updateChapterPPT } from '@/api/chapter';
import { IconPlus } from '@arco-design/web-react/icon';
import { DataType } from '@arco-design/web-react/es/Descriptions/interface';
import { createPermission } from '@/api/permission';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { uploadFile } from '@/api/file';

interface Task {
  id: number;
  name: string;
  createTime: string;
  chapterId: number;
  updateTime?: string;
}

interface Chapter {
  id: number;
  name: string;
  pptUrl?: string;
  viewPPtUrl?: string;
  courseId: number;
  createTime: string;
  updateTime?: string;
  taskList?: Array<Task>;
}

export default function Chapter(props) {
  //课程ID
  const id = props.location.state.id;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<Chapter>>([]);
  const [chapter, setChapter] = useState<any>({});
  const [detailData, setDetailData] = useState([
    {
      key: 'id',
      label: 'ID',
      value: '',
    },
    {
      key: 'name',
      label: '课程名',
      value: '',
    },
    {
      key: 'startTime',
      label: '开课时间',
      value: '',
    },
    {
      key: 'endTime',
      label: '结课时间',
      value: '',
    },
    {
      key: 'description',
      label: '课程描述',
      value: '',
    },
    {
      key: 'createTime',
      label: '课程创建',
      value: '',
    },
  ]);
  const [visible, setVisible] = useState(false);
  const formRef = useRef<FormInstance>();
  const [fileList, setFileList] = useState([]);
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const updatePPT = (chapter) => {
    setVisible(true);
    setChapter(chapter);
  };

  const addTask = (chapter) => {
    console.log(111);
  };

  useEffect(() => {
    return () => {
      setVisible(false);
      setFileList([]);
      setFileUrl('');
      setLoading(false);
    };
  }, []);

  const fetchData = () => {
    setLoading(true);
    getCourseByCourseId({ id })
      .then((res) => {
        //设置课程信息
        detailData.map((value) => {
          if (res[value.key]) {
            value.value = res[value.key];
          }
        });
      })
      .catch((e) => {
        Message.error('查询课程信息失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
      });

    setLoading(true);
    getCourseAllChapter({ courseId: id })
      .then((res) => {
        setData(res);
      })
      .catch((e) => {
        Message.error('新增失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onOk = () => {
    if (!fileUrl) {
      Message.error('请上传PPT');
      return;
    }
    setLoading(true);
    updateChapterPPT({ id: chapter.id, pptUrl: fileUrl })
      .then((res) => {
        Message.success('新增成功');
        fetchData();
        setVisible(false);
      })
      .catch((e) => {
        Message.error('新增失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
        setFileList([]);
        setFileUrl('');
      });
  };
  const onCancel = () => {
    setVisible(false);
    setFileList([]);
    setFileUrl('');
    setChapter({});
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file.originFile);
    uploadFile(formData)
      .then((res) => {
        const newFileList = [
          ...fileList,
          { uid: res, name: file.name, url: res },
        ];
        setFileList(newFileList);
        setFileUrl(res);
      })
      .catch((e) => {
        Message.error('失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Space size={16} direction="vertical" style={{ width: '100%' }}>
      <Card loading={loading}>
        <Descriptions
          size={'large'}
          border
          colon=" :"
          title="课程信息"
          data={detailData}
        />
      </Card>
      <Modal
        title="设置章节PPT"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        autoFocus={false}
        focusLock={true}
      >
        <Form ref={formRef} autoComplete="off">
          <Form.Item label="请选择PPT">
            <Upload
              multiple
              limit={1}
              onRemove={(file, fileList) => {
                setFileList([]);
                setFileUrl('');
              }}
              fileList={fileList}
              onChange={(files) => handleUpload(files[0])}
            ></Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Card loading={loading}>
        {data.length === 0 ? (
          <Empty
            imgSrc="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a0082b7754fbdb2d98a5c18d0b0edd25.png~tplv-uwbnlip3yd-webp.webp"
            description={<Button type="primary">暂无课程章节,请添加</Button>}
          />
        ) : (
          <Collapse accordion>
            {data.map((chapter) => (
              <CollapseItem
                extra={
                  <Space>
                    {chapter.viewPPtUrl ? (
                      <Button
                        status={'warning'}
                        size={'small'}
                        onClick={() => {
                          window.open(chapter.viewPPtUrl, '_blank');
                        }}
                      >
                        预览PPT
                      </Button>
                    ) : (
                      ''
                    )}
                    <Button
                      size={'small'}
                      onClick={() => {
                        updatePPT(chapter);
                      }}
                      status={chapter.pptUrl ? 'default' : 'success'}
                      type={'primary'}
                      icon={<IconPlus />}
                    >
                      {chapter.pptUrl ? '修改章节PPT' : '添加章节PPT'}
                    </Button>
                    <Button
                      size={'small'}
                      onClick={() => {
                        addTask(chapter);
                      }}
                      status={'success'}
                      type={'primary'}
                      icon={<IconPlus />}
                    >
                      添加任务点
                    </Button>
                  </Space>
                }
                key={chapter.id}
                header={chapter.name}
                name={chapter.name}
              >
                <List
                  key={chapter.id}
                  size={'small'}
                  dataSource={chapter.taskList}
                  render={(item, index) => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        key={item.id}
                        avatar={
                          <Avatar
                            size={25}
                            style={{ backgroundColor: '#14a9f8' }}
                            shape="square"
                          >
                            {index + 1}
                          </Avatar>
                        }
                        title={item.name}
                      />
                    </List.Item>
                  )}
                />
              </CollapseItem>
            ))}
          </Collapse>
        )}
      </Card>
    </Space>
  );
}
