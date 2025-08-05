import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Form,
  Divider,
  Table,
  Button,
  Modal,
  message,
  Image,
} from 'antd';
import moment from 'moment';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import React, { useEffect, useRef, useState } from 'react';
import Modeofpayment from '../common/modeofpayment';
import Axios from 'axios';
import { EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
const { TextArea } = Input;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function ChallanDetails() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [fileName, setFileName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState([]);
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const { sendRequest } = useAxios();
  const [downloadedImageName, setDownloadedImageName] = useState();
  const [downloadedImageName0045, setDownloadedImageName0045] = useState();
  const [downloadedImage, setDownloadedImage] = useState();
  const [file, setFile] = useState(null);
  const [file0045, setFile0045] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedImage1, setSelectedImage1] = useState();
  const [buttonFlag, setButtonFlag] = useState(true);
  const [buttonFlag2, setButtonFlag2] = useState(true);
  const [moneyStatus, setMoneyStatus] = useState();
  const [bankName, setBankName] = useState();
  const [bankReceiptNumber, setBankReceiptNumber] = useState();
  const [bankReceiptNumber0045, setBankReceiptNumber0045] = useState();
  const [bankAddress, setBankAddress] = useState();
  const [bankAmount, setBankAmount] = useState();
  const [saveButtonDisable, setSaveButtonDisable] = useState();
  const [detailState, setDetailState] = useState();
  const [modalDisabled, setModalDisabled] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [textVillage, setTextVillage] = useState();
  const [village, setVillage] = useState([]);
  const [challanData, setChallanData] = useState([]);
  const [savedChallan, setSavedChallan] = useState();
  const bankNameRef = useRef();
  const [codeVillage, setCodeVillage] = useState('');
  const [newImageState, setNewImageState] = useState();
  const [newImageState0045, setNewImageState0045] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [imageDownLoad, setImageDownLoad] = useState();
  const [imageDownLoad0045, setImageDownLoad0045] = useState();
  const [revenueYear, setRevenueYear] = useState('2025-26');
  const [isNirank, setIsNirank] = useState(false);
  const [okText, setOkText] = useState();
  const [upperModalData, setUpperModalData] = useState();
  const [modalButtonState, setModalButtonState] = useState('');
  const [modalData, setModalData] = useState();
  const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');
  const [challan0029Flag, setChallan0029Flag] = useState(false);
  const [challan0045Flag, setChallan0045Flag] = useState(false);
  const [file0029Flag, setFile0029Flag] = useState(false);
  const [file0045Flag, setFile0045Flag] = useState(false);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const onYearChange = (value, event) => {
    setRevenueYear(value);
  };

  const getRevenueYear = async () => {
    sendRequest(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, 'GET', null, (res) => {
      // var data = res.data?.revenueYearData?.slice(0, 2);
      var data = res.data?.revenueYearData;
      //console.log(data, '-------dataeeeeeeeee');
      setRevenueYearForVillage(
        // res.data.revenueYearData.map((row) => ({
        data.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        })),
      );
      // message.success('Records Fetched!!');
    });
  };
  useEffect(() => {
    getRevenueYear();
  }, []);

  const initvalues = {
    image: '',
  };
  const [myForm] = Form.useForm();
  const showModal = (record) => {
    setModalData();
    const body = {
      id: record.id,
      cCode: codeVillage,
    };
    sendRequest(`${URLS.BaseURL}/landRevenue/download`, 'POST', body, (res) => {
      setUpperModalData({
        bankName: res.data.bankName,
        id: res.data.id,
        challanNo: res.data.challanNo,
        challanDate: moment(res.data.challanDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        totalAmount: res.data.totalAmount,
        modeOfPayment: res.data.modeOfPayment,
        bankReceiptPath: res.data.bankReceiptPath,
        myfile: res.data.myfile,
        myfile1: res.data.myfile,
        path0029: res.data.path0029,
        path0045: res.data.path0045,
        actualFileName: res.data.actualFileName,
        actualFileName0045: res.data.actualFileName0045,
        bankAddress: res.data.bankAddress,
        bankReceiptNumber: res.data.bankReceiptNumber,
        bankReceiptNumber0045: res.data.bankReceiptNumber0045,
        challanNo0045: res.data.challanNo0045,
        totalOfHead0029: res.data.totalOfHead0029,
        totalOfHead0045: res.data.totalOfHead0045,
      });
    });

    setDataInModal({
      bankName: record.bankName,
      id: record.id,
      challanNo: record.challanNo,
      challanDate: record.challanDate,
      totalAmount: record.totalAmount,
      modeOfPayment: record.modeOfPayment,
      bankReceiptPath: record.bankReceiptPath,
      myfile: record.myfile,
      myfile1: record.myfile,
      actualFileName: record.actualFileName,
      actualFileName0045: record.actualFileName0045,
      bankAddress: record.bankAddress,
      bankReceiptNumber: record.bankReceiptNumber,
      bankReceiptNumber0045: record.bankReceiptNumber0045,
      challanNo0045: record.challanNo0045,
      totalOfHead0029: record.totalOfHead0029,
      totalOfHead0045: record.totalOfHead0045,
    });
    let bankNameDisabled = false,
      bankAddressDisabled = false,
      bankReceiptNumberDisabled = false,
      bankReceiptNumber0045Disabled = false;

    // bankReceiptPathDisabled = false;

    if (record.bankName != null) {
      bankNameDisabled = true;
    }
    if (record.bankAddress != null) {
      bankAddressDisabled = true;
    }
    if (record.bankReceiptNumber != null) {
      bankReceiptNumberDisabled = true;
    }
    if (record.bankReceiptNumber0045 != null) {
      bankReceiptNumber0045Disabled = true;
    }
    // if (record.bankReceiptPath != null) {
    //   bankReceiptPathDisabled = true;
    // }

    const showDownloadedImage = async () => {
      function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        setImageDownLoad(bytes);
        return bytes.buffer;
      }

      function base64ToArrayBuffer0045(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        setImageDownLoad0045(bytes);
        return bytes.buffer;
      }

      sendRequest(`${URLS.BaseURL}/landRevenue/download`, 'POST', body, (res) => {
        setModalData({
          bankName: res.data.bankName,
          id: res.data.id,
          challanNo: res.data.challanNo,
          challanDate: res.data.challanDate,
          totalAmount: res.data.totalAmount,
          modeOfPayment: res.data.modeOfPayment,
          bankReceiptPath: res.data.bankReceiptPath,
          myfile: res.data.myfile,
          myfile1: res.data.myfile,
          path0029: res.data.path0029,
          path0045: res.data.path0045,
          actualFileName: res.data.actualFileName,
          actualFileName0045: res.data.actualFileName0045,
          bankAddress: res.data.bankAddress,
          bankReceiptNumber: res.data.bankReceiptNumber,
          bankReceiptNumber0045: res.data.bankReceiptNumber0045,
          challanNo0045: res.data.challanNo0045,
          totalOfHead0029: res.data.totalOfHead0029,
          totalOfHead0045: res.data.totalOfHead0045,
        });

        setNewImageState('data:image/jpeg;base64,' + res.data.path0029);
        base64ToArrayBuffer(res.data.path0029);
        setNewImageState0045('data:image/jpeg;base64,' + res.data.path0045);
        base64ToArrayBuffer0045(res.data.path0045);
      });
    };
    if (record.actualFileName != null) {
      showDownloadedImage();
      setDownloadedImageName(record.actualFileName);
      setSelectedImage();
    }
    if (record.actualFileName0045 != null) {
      showDownloadedImage();
      setDownloadedImageName0045(record.actualFileName0045);
      setSelectedImage1();
    }
    setModalDisabled({
      bankNameDisabled,
      bankAddressDisabled,
      bankReceiptNumberDisabled,
      bankReceiptNumber0045Disabled,
    });
    setBankName(record.bankName);
    setBankReceiptNumber(record.bankReceiptNumber);
    setBankReceiptNumber0045(record.bankReceiptNumber0045);
    setBankAddress(record.bankAddress);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    enterLoading(0);
    // console.log(
    //   'bank deatils to be sent',
    //   dataInModal.id,
    //   bankReceiptNumber,
    //   bankAddress,
    //   bankName,
    //   bankReceiptNumber0045,
    // );
    saveChallan();
  };

  const enterLoading = (index) => {
    setLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoading((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };
  let formData = new FormData();

  const saveChallanMethod = async () => {
    if (modalButtonState == 'Not Deposited') {
      await Axios.put(
        `${URLS.BaseURL1}new/application/save`,
        formData,
        //formData1,
        {
          headers: {
            Authorization: Header,
            echHost: echHost,
            mhrHost: mhrHost,
            echDbName: echDbName,
            echSchemaName: echSchemaName,
            mhrDbName: mhrDbName,
            mhrSchemaName: mhrSchemaName,
          },
        },
      ).then((res) => {
        if (res.status === 204) {
          setSelectedImage();
          setSelectedImage1();
          message.success('Challan Details Saved!!');
          setBankName(res.bankName);
          // console.log('Challan Data Saved');
          // console.log('Saved Challan Data==> ', res.data);
          getChallan();
          setChallanData();
          setIsModalVisible(false);
          setChallan0029Flag(false);
          setChallan0045Flag(false);
          setFile0029Flag(false);
          setFile0045Flag(false);
        }
      });

      // setSelectedImage();
      // setSelectedImage1();
      // message.success('Challan Details Saved!!');
      // //setBankName(res.bankName);
      // getChallan();
      // setChallanData();
      // setIsModalVisible(false);

      setChallan0029Flag(false);
      setChallan0045Flag(false);
      setFile0029Flag(false);
      setFile0045Flag(false);
    } else {
      setIsModalVisible(false);
    }
  };

  const saveChallan = async () => {
    let myfile = file;
    let myFile1 = file0045;
    const val0029 = upperModalData.totalOfHead0029;
    const val0045 = upperModalData.totalOfHead0045;

    // new code

    //  if (val0029 != null && val0045 > 0 && file0029Flag == false && file0045Flag == false) {
    if (
      // (val0029 != null || val0029 > 0) &&
      // (val0045 != null || val0045 > 0) &&
      val0029 > 0 &&
      val0045 > 0 &&
      file0029Flag == false &&
      file0045Flag == false
    ) {
      message.error('कृपया 0029 आणि 0045 भरणा केलेले चलन अपलोड करा');
      // console.info('1');
    } else if ((val0029 != null || val0029 > 0) && val0045 == 0 && file0029Flag == true) {
      formData.append('file', myfile);
      // console.info('2');
      saveChallanMethod();
    } else if (
      (val0045 != null || val0045 > 0) &&
      (val0029 == 0 || val0029 == null) &&
      file0045Flag == true
    ) {
      formData.append('file0045', myFile1);
      // console.info('3');
      saveChallanMethod();
    } else if (val0029 > 0 && val0045 > 0 && file0045Flag == true && file0029Flag == false) {
      // console.info('4');
      message.error('कृपया 0029 भरणा केलेले चलन अपलोड करा');
    } else if (val0029 > 0 && val0045 == 0 && file0045Flag == false && file0029Flag == false) {
      // console.info('44');
      message.error('कृपया 0029 भरणा केलेले चलन अपलोड करा');
    } else if (val0029 > 0 && val0045 > 0 && file0029Flag == true && file0045Flag == false) {
      // console.info('5');
      message.error('कृपया 0045 भरणा केलेले चलन अपलोड करा');
    } else if (val0045 > 0 && val0029 == 0 && file0045Flag == false && file0029Flag == false) {
      // console.info('55');
      message.error('कृपया 0045 भरणा केलेले चलन अपलोड करा');
    } else {
      formData.append('file', myfile);
      formData.append('file0045', myFile1);
      // console.info('6');
      saveChallanMethod();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedImage();
    setSelectedImage1();
    setFile0029Flag(false);
    setFile0045Flag(false);
  };

  const handleOnChangeForStatus = (value, event) => {
    // console.log('current Value for Status', value);
    setMoneyStatus(value);
    setButtonFlag2(false);
    setChallanData([]);

    if (value == 'Deposited') {
      let text = <FormattedMessage id="challanDetails.button.saveokay" />;
      setOkText(text);
      setModalButtonState('Deposited');
    } else if (value == 'Not Deposited') {
      let text = <FormattedMessage id="challanDetails.button.save" />;
      setOkText(text);
      setModalButtonState('Not Deposited');
    }
  };

  const getChallan = async () => {
    setIsLoading(true);
    const article = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      status: moneyStatus,
    };
    sendRequest(
      `${URLS.BaseURL}/landRevenue/getChallanDetails`,
      'POST',
      article,
      (res) => {
        // console.log('res for get challan details', res.data);
        setChallanData(
          res.data.map((row) => ({
            id: row.id,
            challanNo: row.challanNo,
            challanDate: moment(row.challanDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            totalAmount: row.totalAmount,
            totalOfHead0029: row.totalOfHead0029,
            totalOfHead0045: row.totalOfHead0045,
            challanNo0045: row.challanNo0045,
            modeOfPayment: row.modeOfPayment,
            status: row.status,
            bankName: row.bankName,
            bankReceiptNumber: row.bankReceiptNumber,
            bankReceiptNumber0045: row.bankReceiptNumber0045,
            bankAddress: row.bankAddress,
            actualFileName: row.actualFileName,
            actualFileName0045: row.actualFileName0045,
            bankReceiptPath: row.bankReceiptPath,
            bankReceiptPath0045: row.bankReceiptPath0045,
          })),
        );
        if (res.data.length > 0) {
          message.success('Records Fetched !');
          setIsLoading(false);
        }
      },
      (err) => {
        message.info('No Records Found !');
        setIsLoading(false);
      },
    );
  };

  const handleFile = async (e) => {
    setFile0029Flag(true);
    function checkFileSize(fileSize) {
      if (fileSize >= 2097152) {
        message.error('File Should not be more than 2 MB !');
        myForm.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }
    function checkFileExtension(filename) {
      const extension = filename.split('.').pop();
      // console.log(extension);
      if (['jpeg', 'jpg', 'png', 'pdf'].indexOf(extension) < 0) {
        message.error('Please Select Valid File Format JPEG,JPG,PNG,PDF!');
        myForm.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }

    if (e.target.files && e.target.files.length > 0) {
      if (checkFileExtension(e.target.files[0].name)) {
        if (checkFileSize(e.target.files[0].size)) {
          setFile(e.target.files[0]);
          setSelectedImage(await getBase64(e.target.files[0]));
        }
      }
    } else {
      setSelectedImage(null);
    }
    e.target.files = null;
    // const myfile = URL.creatObjectURL(e.target.files[0]);
    // setFile(myfile);
    // console.log(e.target.files);
    // if (e.target.files && e.target.files.length > 0) {
    //   setSelectedImage(myfile);
    // }
  };

  const handleFile0045 = async (e) => {
    setFile0045Flag(true);
    function checkFileSize(fileSize) {
      if (fileSize >= 2097152) {
        message.error('File Should not be more than 2 MB !');
        myForm.setFieldsValue({ image1: '' });
        return false;
      } else {
        return true;
      }
    }
    function checkFileExtension(filename) {
      const extension = filename.split('.').pop();
      // console.log(extension);
      if (['jpeg', 'jpg', 'png', 'pdf'].indexOf(extension) < 0) {
        message.error('Please Select Valid File Format JPEG,JPG,PNG,PDF!');
        myForm.setFieldsValue({ image1: '' });
        return false;
      } else {
        return true;
      }
    }

    if (e.target.files && e.target.files.length > 0) {
      if (checkFileExtension(e.target.files[0].name)) {
        if (checkFileSize(e.target.files[0].size)) {
          setFile0045(e.target.files[0]);
          setSelectedImage1(await getBase64(e.target.files[0]));
        }
      }
    } else {
      setSelectedImage1(null);
    }
    e.target.files = null;
  };

  const handleUpload = (e) => {
    // console.log(file, 'this is the file data');
  };
  const showModalForImageModal = () => {
    setImageModalVisible(true);
    // console.log(selectedImage);
  };

  const handleOkForImageModal = () => {
    setImageModalVisible(false);
  };

  const handleCancelForImageModal = () => {
    setImageModalVisible(false);
  };

  const removeSelectedImage = () => {
    setSelectedImage();
  };

  const columns = [
    {
      title: <FormattedMessage id="challanDetails.table.challanNo0029" />,
      dataIndex: 'challanNo',
    },
    {
      title: <FormattedMessage id="challanDetails.table.totalAmount29" />,
      dataIndex: 'totalOfHead0029',
    },
    {
      title: <FormattedMessage id="challanDetails.table.challanNo0045" />,
      dataIndex: 'challanNo0045',
    },
    {
      title: <FormattedMessage id="challanDetails.table.totalAmount45" />,
      dataIndex: 'totalOfHead0045',
    },
    {
      title: <FormattedMessage id="challanDetails.table.challanDate" />,
      dataIndex: 'challanDate',
    },
    {
      title: <FormattedMessage id="challanDetails.table.paymentMode" />,
      dataIndex: 'modeOfPayment',
    },
    {
      title: <FormattedMessage id="challanDetails.table.totalAmount" />,
      dataIndex: 'totalAmount',
    },
    {
      title: <FormattedMessage id="challanDetails.table.action" />,
      render: (record) => {
        return (
          <div>
            <Button onClick={() => showModal(record)} size="small" type="link">
              {moneyStatus && moneyStatus === 'Not Deposited' && (
                <FormattedMessage id="challanDetails.table.uploadkara" />
              )}
              {moneyStatus && moneyStatus === 'Deposited' && (
                <FormattedMessage id="challanDetails.table.viewUpload" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Row style={{ marginBottom: 10 }}>
          <Col span={20}>
            <VillageSelector
              // pageType="withYear"
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={setButtonFlag}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>

          <Col xl={2} lg={2} md={24} sm={24} xs={24}>
            <Form.Item
              style={{ marginTop: 10, marginLeft: -440 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
                // style={{ width: 200, marginRight: '15px' }}
                options={revenueYearForVillage}
                style={{ width: 142 }}
                value={revenueYear}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
                // disabled
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col span={7}>
            <Form.Item
              name="test"
              label={<FormattedMessage id="challanDetails.table.status" />}
              rules={[{ required: true }]}
            >
              <Select
                onSelect={(value, event) => handleOnChangeForStatus(value, event)}
                style={{ width: 200 }}
                placeholder="Please Select Type"
              >
                <Select.Option value="Deposited">
                  <FormattedMessage id="challanDetails.table.moneyDeposited" />
                </Select.Option>
                <Select.Option value="Not Deposited">
                  <FormattedMessage id="challanDetails.table.moneyNotDeposited" />
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              /* disabled={buttonFlag || buttonFlag2} */ /* onClick={getChallan} */
              onClick={() => {
                if (textVillage && revenueYear && moneyStatus) {
                  getChallan();
                } else if (textVillage == null) {
                  message.info('Please Select Village !');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year !');
                } else if (moneyStatus == null) {
                  message.info('Please Select Money Status !');
                }
              }}
            >
              <FormattedMessage id="challanDetails.table.viewChallan" />
            </Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Table
          rowKey={(row) => row.id}
          loading={isLoading}
          bordered={true}
          columns={columns}
          dataSource={challanData}
        />
        <Modal
          width={1000}
          title={<FormattedMessage id="challanDetails.table.uploadChallan" />}
          visible={isModalVisible}
          okText={okText}
          onOk={handleOk}
          okButtonProps={{ disabled: saveButtonDisable }}
          cancelText={<FormattedMessage id="challanDetails.button.cancel" />}
          onCancel={handleCancel}
          confirmLoading={loading[0]}
        >
          <>
            <Card>
              <Row style={{ marginBottom: 20 }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.challanNo0029" />}
                    disabled
                    value={upperModalData && upperModalData.challanNo}
                  />
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.totalAmount29" />}
                    disabled
                    value={upperModalData && upperModalData.totalOfHead0029}
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.challanNo0045" />}
                    disabled
                    value={upperModalData && upperModalData.challanNo0045}
                  />
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.totalAmount45" />}
                    disabled
                    value={upperModalData && upperModalData.totalOfHead0045}
                    onChange={(e) => {
                      upperModalData.totalOfHead0045 != null
                        ? setChallan0045Flag(true)
                        : setChallan0045Flag(false);
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.paymentMode" />}
                    value={upperModalData && upperModalData.modeOfPayment}
                    disabled
                  />
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.challanDate" />}
                    value={upperModalData && upperModalData.challanDate}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.totalAmount" />}
                    addonAfter={'₹'}
                    value={upperModalData && upperModalData.totalAmount}
                    disabled
                  />
                </Col>
              </Row>
            </Card>

            <>
              <Row style={{ marginTop: '30px' }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item rules={[{ required: true, message: 'Bank Name is Required..' }]}>
                    <Input
                      addonBefore={<FormattedMessage id="challanDetails.table.bankName" />}
                      value={modalData && modalData.bankName}
                      disabled={modalDisabled.bankAddressDisabled}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          bankName: e.target.value,
                        }));
                      }}
                      maxLength={50}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    ></Input>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item rules={[{ required: true, message: 'Bank Branch is Required..' }]}>
                    <Input
                      addonBefore={<FormattedMessage id="challanDetails.table.bankBranch" />}
                      value={modalData && modalData.bankAddress}
                      disabled={modalDisabled.bankAddressDisabled}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          bankAddress: e.target.value,
                        }));
                      }}
                      maxLength={25}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    ></Input>
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <Row>
                {dataInModal && dataInModal.challanNo == null ? (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: 'Bank Challan Number is Required..' }]}
                    >
                      <Input
                        addonBefore={
                          <FormattedMessage id="challanDetails.table.grassChallanNo0029" />
                        }
                        // value={dataInModal && dataInModal.bankReceiptNumber}
                        disabled={true}
                        // onChange={(e) => {
                        //   setDataInModal((prevDataInModal) => ({
                        //     ...prevDataInModal,
                        //     bankReceiptNumber: e.target.value,
                        //   }));
                        // }}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      ></Input>
                    </Form.Item>
                  </Col>
                ) : (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: 'Bank Challan Number is Required..' }]}
                    >
                      <Input
                        addonBefore={
                          <FormattedMessage id="challanDetails.table.grassChallanNo0029" />
                        }
                        value={modalData && modalData.bankReceiptNumber}
                        disabled={modalDisabled.bankReceiptNumberDisabled}
                        onChange={(e) => {
                          setDataInModal((prevDataInModal) => ({
                            ...prevDataInModal,
                            bankReceiptNumber: e.target.value,
                          }));
                          setChallan0029Flag(true);
                        }}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      ></Input>
                    </Form.Item>
                  </Col>
                )}
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                {dataInModal && dataInModal.challanNo0045 == null ? (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: 'Bank Challan Number is Required..' }]}
                    >
                      <Input
                        addonBefore={
                          <FormattedMessage id="challanDetails.table.grassChallanNo0045" />
                        }
                        // value={dataInModal && dataInModal.bankReceiptNumber0045}
                        disabled={true}
                        // onChange={(e) => {
                        //   setDataInModal((prevDataInModal) => ({
                        //     ...prevDataInModal,
                        //     bankReceiptNumber0045: e.target.value,
                        //   }));
                        // }}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      ></Input>
                    </Form.Item>
                  </Col>
                ) : (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: 'Bank Challan Number is Required..' }]}
                    >
                      <Input
                        addonBefore={
                          <FormattedMessage id="challanDetails.table.grassChallanNo0045" />
                        }
                        value={modalData && modalData.bankReceiptNumber0045}
                        disabled={modalDisabled.bankReceiptNumber0045Disabled}
                        onChange={(e) => {
                          setDataInModal((prevDataInModal) => ({
                            ...prevDataInModal,
                            bankReceiptNumber0045: e.target.value,
                          }));
                        }}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      ></Input>
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.totalAmount" />}
                    addonAfter="₹"
                    value={dataInModal && dataInModal.totalAmount}
                    disabled={true}
                    onChange={(e) => setBankAmount(e.target.value)}
                    maxLength={10}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  ></Input>
                </Col>
              </Row>
              {moneyStatus && moneyStatus === 'Not Deposited' && (
                <Form form={myForm} initialValues={initvalues}>
                  <Row style={{ marginTop: '20px' }}>
                    {dataInModal &&
                    (dataInModal.challanNo == null || dataInModal.challanNo == 0) ? (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            disabled={true}
                            addonBefore="भरणा केलेले चलन अपलोड करा (0029)"
                            // accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file'}
                            // onChange={(e) => handleFile(e)}
                          ></Input>
                        </Form.Item>
                      </Col>
                    ) : (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            addonBefore="भरणा केलेले चलन अपलोड करा (0029)"
                            accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file'}
                            onChange={(e) => handleFile(e)}
                          ></Input>
                        </Form.Item>
                      </Col>
                    )}
                    <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                    {dataInModal &&
                    (dataInModal.challanNo0045 == null || dataInModal.challanNo0045 == 0) ? (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image1"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            disabled={true}
                            addonBefore="भरणा केलेले चलन अपलोड करा (0045)"
                            // accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file0045'}
                            // onChange={(e) => handleFile0045(e)}
                          ></Input>
                        </Form.Item>
                      </Col>
                    ) : (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image1"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            addonBefore="भरणा केलेले चलन अपलोड करा (0045)"
                            accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file0045'}
                            onChange={(e) => handleFile0045(e)}
                          ></Input>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                </Form>
              )}
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {selectedImage && <Image width={300} height={200} src={selectedImage} />}
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {selectedImage1 && <Image width={300} height={200} src={selectedImage1} />}
                </Col>
              </Row>
              {moneyStatus && moneyStatus === 'Deposited' && (
                <>
                  {dataInModal && dataInModal.challanNo == null ? (
                    ''
                  ) : (
                    <>
                      <Row style={{ marginTop: '20px' }}>
                        <Col span={8}>
                          <Image width={300} height={200} src={newImageState} />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={8}>
                          <p>
                            {<FormattedMessage id="challanDetails.table.fileName" />}
                            {downloadedImageName}
                          </p>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Button
                          type="primary"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = newImageState;
                            link.setAttribute('download', 'file.jpeg,file.png,file.pdf'); //or any other extension
                            document.body.appendChild(link);
                            link.click();
                          }}
                        >
                          <FormattedMessage id="challanDetails.table.download" />
                        </Button>
                      </Row>
                    </>
                  )}

                  {dataInModal && dataInModal.challanNo0045 == null ? (
                    ''
                  ) : (
                    <>
                      <Row style={{ marginTop: '10px' }}>
                        <Col span={8}>
                          <Image width={300} height={200} src={newImageState0045} />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={8}>
                          <p>
                            {<FormattedMessage id="challanDetails.table.fileName" />}
                            {downloadedImageName0045}
                          </p>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Button
                          type="primary"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = newImageState0045;
                            link.setAttribute('download', 'file.jpeg,file.png,file.pdf'); //or any other extension
                            document.body.appendChild(link);
                            link.click();
                          }}
                        >
                          <FormattedMessage id="challanDetails.table.download" />
                        </Button>
                      </Row>
                    </>
                  )}
                </>
              )}
            </>
          </>
        </Modal>
      </Card>
    </PageContainer>
  );
}
export default ChallanDetails;
