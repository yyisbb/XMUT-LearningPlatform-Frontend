import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  Message,
  Modal,
  Space,
  Upload,
} from '@arco-design/web-react';
import { Collapse } from '@arco-design/web-react';

const CollapseItem = Collapse.Item;
import { List, Avatar } from '@arco-design/web-react';
import { useEffect, useRef, useState } from 'react';
import { getCourseByCourseId } from '@/api/course';
import {
  createChapter,
  deleteChapter,
  getCourseAllChapter,
  releasePreView,
  updateChapterPPT,
} from '@/api/chapter';
import {
  IconDelete,
  IconDown,
  IconEdit,
  IconPlus,
  IconRightCircle,
} from '@arco-design/web-react/icon';
import { DataType } from '@arco-design/web-react/es/Descriptions/interface';
import { createPermission } from '@/api/permission';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { uploadFile } from '@/api/file';
import { addTask, deleteTask, updateTaskVideo } from '@/api/task';
import './index.css';
import Plyr, { APITypes } from 'plyr-react';
import 'plyr-react/plyr.css';

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

const iconStyle = {
  marginRight: 8,
  fontSize: 16,
  transform: 'translateY(1px)',
};

export default function Chapter(props) {
  //课程ID
  const id = props.location.state.id;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<Chapter>>([]);
  const [chapter, setChapter] = useState<any>({});
  const [task, setTask] = useState<any>({});
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
  const [visibleVideo, setVisibleVideo] = useState(false);
  const [visibleChapter, setVisibleChapter] = useState(false);
  const [visibleTask, setVisibleTask] = useState(false);
  const [visiblePreview, setVisiblePreView] = useState(false);
  const [visibleVideoPreview, setVisibleVideoPreview] = useState(false);
  const formRef = useRef<FormInstance>();
  const chapterFormRef = useRef<FormInstance>();
  const taskFormRef = useRef<FormInstance>();
  const previewFormRef = useRef<FormInstance>();
  const [fileList, setFileList] = useState([]);
  const [fileUrl, setFileUrl] = useState('');
  const [sources, setSources] = useState([]);
  const ref = useRef<APITypes>(null);
  useEffect(() => {
    fetchData();
  }, []);

  const updatePPT = (chapter) => {
    setVisible(true);
    setChapter(chapter);
  };

  const addTaskBtn = (chapter) => {
    setVisibleTask(true);
    setChapter(chapter);
  };

  const deleteChapterBtn = (chapter) => {
    setLoading(true);
    deleteChapter({ id: chapter.id })
      .then((res) => {
        Message.success('删除成功');
        fetchData();
      })
      .catch((e) => {
        Message.error('删除失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const onOkVideo = () => {
    if (!fileUrl) {
      Message.error('请上传任务点视频');
      return;
    }
    setLoading(true);
    updateTaskVideo({ id: task.id, videoUrl: fileUrl })
      .then((res) => {
        Message.success('新增成功');
        fetchData();
        setVisibleVideo(false);
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

  const onCancelVideo = () => {
    setVisibleVideo(false);
    setFileList([]);
    setFileUrl('');
    setTask({});
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
        setFileList([]);
        setFileUrl('');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addChapterBtn = () => {
    setVisibleChapter(true);
  };

  const onOkChapter = () => {
    chapterFormRef.current.validate().then((values) => {
      const { name } = values;
      setLoading(true);
      createChapter({ name, courseId: id })
        .then((res) => {
          Message.success('新增成功');
          fetchData();
          setVisibleChapter(false);
        })
        .catch((e) => {
          Message.error('新增失败: ' + e);
        })
        .finally(() => {
          setLoading(false);
          chapterFormRef.current.resetFields();
        });
    });
  };
  const onCancelChapter = () => {
    setVisibleChapter(false);
  };

  const onOkPreView = () => {
    previewFormRef.current.validate().then((values) => {
      const { time, name } = values;
      const [startTime, endTime] = time;
      setLoading(true);
      releasePreView({ name, startTime, endTime, chapterId: chapter.id })
        .then((res) => {
          Message.success('新增成功');
          fetchData();
          setVisiblePreView(false);
        })
        .catch((e) => {
          Message.error('新增失败: ' + e);
        })
        .finally(() => {
          setLoading(false);
          previewFormRef.current.resetFields();
        });
    });
  };

  const onCancelPreView = () => {
    setVisiblePreView(false);
    setChapter({});
  };

  const onOkTask = () => {
    taskFormRef.current.validate().then((values) => {
      const { name } = values;
      setLoading(true);
      addTask({ name, chapterId: chapter.id })
        .then((res) => {
          Message.success('新增成功');
          fetchData();
          setVisibleTask(false);
        })
        .catch((e) => {
          Message.error('新增失败: ' + e);
        })
        .finally(() => {
          setLoading(false);
          taskFormRef.current.resetFields();
          setChapter({});
        });
    });
  };
  const onCancelTask = () => {
    setChapter({});
    taskFormRef.current.resetFields();
    setVisibleTask(false);
  };

  const updateVideo = (task) => {
    setVisibleVideo(true);
    setTask(task);
  };

  const render = (item, index) => (
    <List.Item
      key={item.id}
      actions={[
        <span key={1}>
          {item.videoUrl ? (
            <Button
              onClick={() => {
                setSources([
                  {
                    src: item.videoUrl,
                  },
                ]);
                setVisibleVideoPreview(true);
              }}
              status={'warning'}
            >
              预览视频
            </Button>
          ) : (
            ''
          )}
        </span>,
        <span key={2}>
          <Button
            onClick={() => {
              updateVideo(item);
            }}
            type={'primary'}
            icon={<IconPlus />}
            status={'default'}
          >
            {item.videoUrl ? '修改视频' : '设置视频'}
          </Button>
        </span>,
        <span key={3}>
          <Button
            icon={<IconDelete />}
            type={'primary'}
            onClick={() => {
              deleteTaskBtn(item.id);
            }}
            status={'danger'}
          >
            删除任务点
          </Button>
        </span>,
      ]}
    >
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
  );

  const deleteTaskBtn = (taskId) => {
    setLoading(true);
    deleteTask({ id: taskId })
      .then((res) => {
        Message.success('删除成功');
        fetchData();
      })
      .catch((e) => {
        Message.error('删除失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
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
                    <>
                      <Space>
                        <Button
                          onClick={() => {
                            setVisiblePreView(true);
                            setChapter(chapter);
                          }}
                          status={'success'}
                        >
                          发布预习
                        </Button>
                        <Dropdown
                          trigger={'click'}
                          droplist={
                            <Menu>
                              {chapter.viewPPtUrl ? (
                                <Menu.Item
                                  onClick={() => {
                                    window.open(chapter.viewPPtUrl, '_blank');
                                  }}
                                  key="1"
                                >
                                  <IconRightCircle style={iconStyle} />
                                  预览PPT
                                </Menu.Item>
                              ) : (
                                ''
                              )}

                              <Menu.Item
                                onClick={() => {
                                  updatePPT(chapter);
                                }}
                                key="2"
                              >
                                {chapter.pptUrl ? (
                                  <IconEdit style={iconStyle} />
                                ) : (
                                  <IconPlus style={iconStyle} />
                                )}
                                {chapter.pptUrl ? '修改章节PPT' : '添加章节PPT'}
                              </Menu.Item>
                              <Menu.Item
                                onClick={() => {
                                  addTaskBtn(chapter);
                                }}
                                key="3"
                              >
                                <IconPlus style={iconStyle} />
                                添加任务点
                              </Menu.Item>
                              <Menu.Item
                                onClick={() => {
                                  deleteChapterBtn(chapter);
                                }}
                                key="4"
                              >
                                <IconDelete style={iconStyle} />
                                删除章节
                              </Menu.Item>
                            </Menu>
                          }
                          position="bl"
                        >
                          <Button status={'default'} type="primary">
                            操作 <IconDown />
                          </Button>
                        </Dropdown>
                      </Space>
                    </>
                  }
                  key={chapter.id}
                  header={chapter.name}
                  name={chapter.name}
                >
                  <List
                    key={chapter.id}
                    size={'small'}
                    bordered
                    pagination={{ pageSize: 5 }}
                    dataSource={chapter.taskList}
                    render={render}
                  />
                </CollapseItem>
              ))}
            </Collapse>
          )}
        </Card>
      </Space>

      <Button
        style={{
          right: '30px',
          bottom: '30px',
          position: 'fixed',
          zIndex: 100,
          width: '60px',
          height: '60px',
        }}
        shape="circle"
        type="primary"
        onClick={addChapterBtn}
        icon={<IconPlus style={{ width: '20px', height: '20px' }} />}
      />
      <Modal
        title="添加章节"
        visible={visibleChapter}
        onOk={onOkChapter}
        onCancel={onCancelChapter}
        autoFocus={false}
        focusLock={true}
      >
        <Form ref={chapterFormRef} autoComplete="off">
          <Form.Item rules={[{ required: true }]} field={'name'} label="章节名">
            <Input placeholder="请输入章节名..." />
          </Form.Item>
        </Form>
      </Modal>
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
              accept={'.pptx'}
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

      <Modal
        title="添加任务点"
        visible={visibleTask}
        onOk={onOkTask}
        onCancel={onCancelTask}
        autoFocus={false}
        focusLock={true}
      >
        <Form ref={taskFormRef} autoComplete="off">
          <Form.Item rules={[{ required: true }]} field={'name'} label="任务点">
            <Input placeholder="请输入任务点..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="设置任务点视频"
        visible={visibleVideo}
        onOk={onOkVideo}
        onCancel={onCancelVideo}
        autoFocus={false}
        focusLock={true}
      >
        <Form ref={formRef} autoComplete="off">
          <Form.Item label="请选择视频">
            <Upload
              multiple
              limit={1}
              accept={'.mp4'}
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
      <Modal
        title="视频预览"
        visible={visibleVideoPreview}
        onCancel={() => setVisibleVideoPreview(false)}
        autoFocus={false}
        footer={null}
        focusLock={true}
      >
        <Plyr
          ref={ref}
          source={{
            type: 'video',
            sources: sources,
          }}
          options={undefined}
        />
      </Modal>

      <Modal
        title="发布预习"
        visible={visiblePreview}
        onOk={onOkPreView}
        onCancel={onCancelPreView}
        autoFocus={false}
        focusLock={true}
      >
        <Form ref={previewFormRef} autoComplete="off">
          <Form.Item rules={[{ required: true }]} field={'name'} label="预习名">
            <Input placeholder="请输入预习名..." />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            field={'time'}
            label="课程时间"
          >
            <DatePicker.RangePicker allowClear />
          </Form.Item>
          <Form.Item label="提示">
            <Alert
              type="warning"
              content="发布预习任务默认选择视频不为空的全部章节"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
