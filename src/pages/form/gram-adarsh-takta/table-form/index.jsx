import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

function TableFormGramAdarsh() {
  const { sendRequest } = useAxios();
  const { districtName, talukaName, servarthId, districtCode, talukaCode, villageData } =
    useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [villageForm19Data, setVillageForm19Data] = useState();
  const [recordId, setRecordId] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [okText, setOkText] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [creditAtTreasury, setCreditAtTreasury] = useState();
  const [purchaseDate, setPurchaseDate] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sajjaBox, setSajjaBox] = useState(false);
  const [villageSaja, setVillageSaja] = useState([]);
  const [villageSajjaCode, setVillageSajjaCode] = useState();
  const [villageSajjaName, setVillageSajjaName] = useState();
  const [sajjaCode, setSajjaCode] = useState([]);
  const [editEmail, setEditEmail] = useState(false);
  const [editMobile, setEditMobile] = useState(false);
  const [editName, setEditName] = useState(false);

  const [ID, setID] = useState();
  const [form] = Form.useForm();

  let history = useHistory();

  // useEffect(() => {
  //   getForm19Data();
  // }, []);

  useEffect(() => {
    const result = villageData.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => t.sajjaName === thing.sajjaName && t.sajjaCode === thing.sajjaCode),
    );
    setVillage(result[0].villageName);
    setCodeVillage(result[0].cCode);
    setVillageSaja(
      result?.map((row) => ({
        label: row.sajjaName,
        value: row.sajjaCode,
      })),
    );

    const getrevenueYear = JSON.parse(localStorage.getItem('revenueYear1'));
    setRevenueYear(getrevenueYear[0].revenueYear);
    // console.log(getrevenueYear[0].revenueYear, '-------------------y');
  }, []);

  const handleOnChange = (value, event) => {
    setVillageSajjaCode(value);
    setVillageSajjaName(event.label);
  };

  const handleChangeForSajja = (value, event) => {
    setSajjaCode(value);
  };

  const onChangeSajjaCheckbox = (e) => {
    if (sajjaBox === false) {
      setSajjaBox(true);
    } else {
      setSajjaBox(false);
    }
    setVillageForm19Data([]);
  };

  const addForm = () => {
    history.push({
      pathname: `/form/Village-level-officials-form/village-form`,
    });
  };

  const getForm19Data = async () => {
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/villageDetails/getOfficersDetails?cCode=${codeVillage}&revenuYear=${revenueYear}&isActive=1 `,
      'GET',
      null,
      (res) => {
        // console.log(res, '-----------------------det all data');

        setVillageForm19Data(
          res.data.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            designationName: row.designationName,
            districName: row.districName,
            name: row.name,
            districtCode: row.districtCode,
            email: row.email,
            isActive: row.isActive,
            mobileNumber: row.mobileNumber,
            revenueYear: row.revenueYear,
            talukaCode: row.talukaCode,
            talukaName: row.talukaName,
            updatedOn: row.updatedOn,
            villageName: row.villageName,
            cCode: row.cCode,
          })),
        );
        message.success('Records Fetched !');
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteForm19Data = async (record) => {
    setModalForDelete(false);
    sendRequest(
      `${URLS.BaseURL}/villageDetails/discardDetails?id=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.data.status == 'SUCCESS') {
          message.success('Record Deleted !');
          setVillageForm19Data([]);
          getForm19Data();
        }
      },
    );
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({
      id: record.id,
      cCode: record.cCode,
      designationName: record.designationName,
      name: record.name,
      districtCode: record.districtCode,
      districName: record.districName,
      email: record.email,
      isActive: record.isActive,
      mobileNumber: record.mobileNumber,
      revenueYear: record.revenueYear,
      talukaCode: record.talukaCode,
      talukaName: record.talukaName,
      updatedOn: record.updatedOn,
      villageName: record.villageName,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const showModalForEdit = (record) => {
    // console.log(record);

    form.resetFields();
    setDataInModal({
      id: record.id,
      cCode: record.Code,
      designationName: record.designationName,
      districName: record.districName,
      name: record.name,
      districtCode: record.districtCode,
      email: record.email,
      isActive: record.isActive,
      mobileNumber: record.mobileNumber,
      revenueYear: record.revenueYear,
      talukaCode: record.talukaCode,
      talukaName: record.talukaName,
      updatedOn: record.updatedOn,
      villageName: record.villageName,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const editForm19 = async () => {
    // form
    // .validateFields() // Validate all fields
    // .then((values) => {
    //   // Proceed with form data if validation passes
    //   console.log('Form submitted successfully:', values);
    // })
    // .catch((errorInfo) => {
    //   // Handle errors if validation fails
    //   console.log('Form validation failed:', errorInfo);
    // });
    console.log(dataInModal.email.length, '--------------------------leangth');

    if (dataInModal.email.length == 0) {
      setEditEmail(true);
      setIsModalVisible(true);
    } else if (dataInModal.mobileNumber.length == 0) {
      setEditMobile(true);
      setIsModalVisible(true);
    } else if (dataInModal.name.length == 0) {
      setIsModalVisible(true);
      setEditName(true);
    } else {
      callForSave();
    }
  };

  const callForSave = () => {
    setConfirmLoading(true);
    dataInModal.cCode = codeVillage;
    const parametersForEdit = {
      // id: dataInModal.id,
      cCode: dataInModal.cCode,
      districtCode: dataInModal.districtCode,
      talukaCode: dataInModal.talukaCode,
      districName: dataInModal.districName,
      talukaName: dataInModal.talukaName,
      villageName: dataInModal.villageName,
      revenueYear: dataInModal.revenueYear,
      name: dataInModal.name,
      mobileNumber: dataInModal.mobileNumber,
      email: dataInModal.email,
      designationName: dataInModal.designationName,

      // isActive: dataInModal.isActive,
      // updatedOn: dataInModal.updatedOn,
    };
    console.log(parametersForEdit, '---------------------------parametersForEdit');
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/villageDetails/editDetails/${dataInModal.id}`,
        'PUT',
        parametersForEdit,
        (res) => {
          console.log(res, '---------------------------------Edit');
          if (res.data.status == 'SUCCESS') {
            // alert('a')
            message.success('Data Updated!');
            getForm19Data();
            setConfirmLoading(false);
            setIsModalVisible(false);
          }
        },
        (err) => {
          setIsModalVisible(false);
          setConfirmLoading(false);
        },
      );
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };

  const columns = [
    {
      key: '1',
      width: '50px',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="Village level officials.form.designation" />,
      dataIndex: 'designationName',
    },
    {
      key: '3',
      title: <FormattedMessage id="Village level officials.form.name" />,
      dataIndex: 'name',
    },
    {
      key: '4',
      title: <FormattedMessage id="Village level officials.form.mobile" />,
      dataIndex: 'mobileNumber',
    },
    {
      key: '5',
      title: <FormattedMessage id="Village level officials.form.sarpanchEmail" />,
      dataIndex: 'email',
    },
    // {
    //   key: '5',
    //   title: <FormattedMessage id="villageForm19.form.dateOfPurchase" />,
    //   dataIndex: 'dateOfPurchase',
    // },
    {
      key: '6',
      title: <FormattedMessage id="Village level officials.form.districName" />,
      dataIndex: 'districName',
    },
    {
      key: '7',
      title: <FormattedMessage id="Village level officials.form.talukaName" />,
      dataIndex: 'talukaName',
    },
    {
      key: '8',
      title: <FormattedMessage id="Village level officials.form.villageName" />,
      dataIndex: 'villageName',
    },
    // {
    //   key: '9',
    //   title: <FormattedMessage id="villageForm19.form.dateOfCreditAtTreasury" />,
    //   dataIndex: 'villageName',
    // },
    // {
    //   key: '10',
    //   title: <FormattedMessage id="villageForm19.form.number" />,
    //   dataIndex: 'number',
    // },
    // {
    //   key: '11',
    //   title: <FormattedMessage id="villageForm19.form.value" />,
    //   dataIndex: 'value',
    // },
    {
      key: '12',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '80px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EditTwoTone onClick={() => showModalForEdit(record)} />
                <DeleteOutlined
                  onClick={() => deleteRecord(record)}
                  style={{ color: 'red', marginLeft: 12 }}
                />
                {/* <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
                /> */}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];
  return (
    <>
      <PageContainer>
        <Card>
          {/*
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setVillageForm19Data)}
            yearChange={setRevenueYear}
          /> */}
          <Row>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            <Col xl={20} lg={20} md={20} sm={24} xs={24}>
              <h2 style={{ marginBottom: '15px' }}>
                <center>
                  <FormattedMessage id="Village level officials form.form.title" />
                </center>
              </h2>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col>
          </Row>
          <Form layout="horizontal">
            <Row style={{ marginTop: 15 }}>
              <Col xl={4} lg={4} md={24} sm={24} xs={24}>
                <Form.Item label={<FormattedMessage id="villageSelector.label.district" />}>
                  <Select disabled placeholder={districtName}></Select>
                </Form.Item>
              </Col>

              <Col xl={1} lg={1}></Col>
              <Col xl={4} lg={4} md={24} sm={24} xs={24}>
                <Form.Item label={<FormattedMessage id="villageSelector.label.taluka" />}>
                  <Select disabled placeholder={talukaName}></Select>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1}></Col>
              <Col xl={4} lg={4} md={24} sm={24} xs={24}>
                <Form.Item label="गाव">
                  <Select disabled placeholder={village}></Select>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1}></Col>
              <Col xl={4} lg={4} md={24} sm={24} xs={24}>
                <Form.Item label="महसुल वर्ष">
                  <Select disabled placeholder={revenueYear}></Select>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  onClick={() => {
                    getForm19Data();
                  }}
                >
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              </Col>
              {/* <Col xl={1}></Col> */}
            </Row>
          </Form>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Table
                bordered
                loading={isLoading}
                scroll={{ x: 100 }}
                dataSource={villageForm19Data}
                columns={columns}
              />
            </Col>
          </Row>
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteForm19Data}
        ></Modal>
        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm19}
          confirmLoading={confirmLoading}
        >
          <Form layout="vertical" form={form}>
            <Card>
              <Divider orientation="left">
                <FormattedMessage id="formLanguage.form.echawdi" />
              </Divider>
              <Row>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="designationName"
                    label={<FormattedMessage id="Village level officials.form.designation" />}
                    // rules={[
                    //   {
                    //     required: 'true',
                    //     message: 'This field is required',
                    //   },
                    //   // { max: 50, message: 'No In List is Required' },
                    // ]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={true}
                      defaultValue={dataInModal && dataInModal.designationName}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          designationName: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>

                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="Village level officials.form.districName" />}
                    name="districName"
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={true}
                      defaultValue={dataInModal && dataInModal.districName}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          districName: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="Village level officials.form.talukaName" />}
                    name="talukaName"
                    // rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={true}
                      defaultValue={dataInModal && dataInModal.talukaName}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          talukaName: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="Village level officials.form.villageName" />}
                    name="villageName"
                    // rules={[{ required: true, message: 'Remarks is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={18}
                      disabled={true}
                      defaultValue={dataInModal && dataInModal.villageName}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          villageName: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="Village level officials.form.sarpanchEmail" />}
                    name="email"
                    rules={[
                      { required: true, message: 'Field is necessary!' },
                      {
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address!',
                      },
                    ]}
                  >
                    <Input
                      // onKeyPress={KeyPressEvents.isEmail}
                      max={100}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.email}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          email: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                  {editEmail && <p style={{ color: 'red' }}>Field shoud not be empty!</p>}
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="Village level officials.form.name" />}
                    name="name"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.name}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          name: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                  {editName && <p style={{ color: 'red' }}>Field shoud not be empty!</p>}
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="Village level officials.form.mobile" />}
                    name="mobileNumber"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      max={18}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.mobileNumber}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          mobileNumber: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                  {editMobile && <p style={{ color: 'red' }}>Field shoud not be empty!</p>}
                </Col>
              </Row>
            </Card>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
}

export default TableFormGramAdarsh;
