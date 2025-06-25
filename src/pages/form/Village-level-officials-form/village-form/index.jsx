import VillageSelector from '@/components/eComponents/VillageSelector';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
} from 'antd';
import { FormattedMessage, useModel } from 'umi';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import URLS from '@/URLs/urls';
import moment from 'moment';
import useAxios from '@/components/eComponents/use-axios';
import KeyPressEvents from '@/util/KeyPressEvents';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

function VillageForm19() {
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [cCode, setCCode] = useState('');
  const [villageSaja, setVillageSaja] = useState([]);
  const [villageSajjaCode, setVillageSajjaCode] = useState();
  const [villageSajjaName, setVillageSajjaName] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [form] = Form.useForm();
  const { servarthId, districtCode, talukaCode, districtName, talukaName, desig, villageData } =
    useModel('details');
  const [isLoading, setIsLoading] = useState(false);
  const [sahayyaks, setSahayyaks] = useState([{ name: '', mobile: '', email: '' }]);
  const [sarkariSansthaO, setSarkariSansthaO] = useState([{ name: '', mobile: '', email: '' }]);

  let history = useHistory();

  useEffect(() => {
    const result = villageData.filter(
      (thing, index, self) =>
        index ===
        self.findIndex(
          (t) => t.villageName === thing.villageName && t.villageCode === thing.villageCode,
        ),
    );

    console.log(result, '---------------result');
    setVillage(result[0].villageName);
    setCCode(result[0].cCode);
    setVillageSaja(
      result?.map((row) => ({
        label: row.villageName,
        value: row.villageCode,
      })),
    );
  }, []);

  const handleOnChange = (value, event) => {
    setVillageSajjaCode(value);
    setVillageSajjaName(event.label);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  };

  // const success = () => {
  //   message.success('Data Saved !!!');
  // };

  const resetForm = () => {
    form.resetFields();
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/Village-level-officials-form/table-form`,
    });
  };

  const handleAddSahayyak = () => {
    if (sahayyaks.length < 4) {
      setSahayyaks([...sahayyaks, { name: '', mobile: '', email: '' }]);
    }
  };

  const handleRemoveSahayyak = (index) => {
    const updated = [...sahayyaks];
    updated.splice(index, 1);
    setSahayyaks(updated);
  };

  const handleChangeSahayyak = (index, field, value) => {
    const updated = [...sahayyaks];
    updated[index][field] = value;
    setSahayyaks(updated);
  };

  // function sendRequest(url, method, data, onSuccess, onError) {
  //   fetch(url, {
  //     method: method,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then(async (response) => {
  //       const resData = await response.json();
  //       if (!response.ok) {
  //         throw new Error(resData.message || 'Something went wrong');
  //       }
  //       onSuccess(resData);
  //     })
  //     .catch((error) => {
  //       console.error('Request failed:', error);
  //       onError(error);
  //     });
  // }

  const onFormFinish = async (values) => {
    setIsLoading(true);

    // "districName":"रायगड",
    // "talukaName":"तळा ",
    // "villageName":"रोवले",
    // "revenueYear":"2024-25",
    const article = {
      cCode: cCode,
      districtCode: districtCode,
      talukaCode: talukaCode,
      districName: districtName,
      talukaName: talukaName,
      villageName: village,
      revenueYear: '2024-25',

      officerDetails: [
        {
          name: form.getFieldValue('sarpanch'),
          mobileNumber: form.getFieldValue('sarpanchMobile'),
          email: form.getFieldValue('sarpanchEmail'),
          designationName: 'सरपंच',
        },
        {
          name: form.getFieldValue('police'),
          mobileNumber: form.getFieldValue('policeMobile'),
          email: form.getFieldValue('policeEmail'),
          designationName: 'पोलीस पाटील',
        },
        {
          name: form.getFieldValue('gramsewak'),
          mobileNumber: form.getFieldValue('gramsewakMobile'),
          email: form.getFieldValue('gramsewakEmail'),
          designationName: 'ग्राम सेवक',
        },
        {
          name: form.getFieldValue('mahsulsewak'),
          mobileNumber: form.getFieldValue('mahsulsewakMobile'),
          email: form.getFieldValue('mahsulsewakEmail'),
          designationName: 'महसुलसेवक ',
        },
        {
          // कृषीसहाय्यक
          name: form.getFieldValue('krushiSahyak'),
          mobileNumber: form.getFieldValue('krushiSahyakMobile'),
          email: form.getFieldValue('krushiSahyakEmail'),
          designationName: 'कृषीसहाय्यक',
        },
        {
          name: form.getFieldValue('patishtit1'),
          mobileNumber: form.getFieldValue('patishtit1Mobile'),
          email: form.getFieldValue('patishtit1Email'),
          designationName: 'प्रतिष्ठित व्यक्ति १',
        },
        {
          name: form.getFieldValue('patishtit2'),
          mobileNumber: form.getFieldValue('patishtit2Mobile'),
          email: form.getFieldValue('patishtit2Email'),
          designationName: 'प्रतिष्ठित व्यक्ति २',
        },
      ],
    };

    console.log(article, '-----------------------------------article');
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/villageDetails/saveDetails`,
      'POST',
      article,
      (res) => {
        console.log(res, '✅ Response received');

        if (res.status === 201) {
          console.log(res, '✅ Article saved successfully');

          // success(); // your custom success function
          message.success('Data Saved!');
          resetForm();
        } else {
          console.warn('⚠️ Response received but status is not SUCCESS', res);
          message.error('Failed to save data');
        }

        setIsLoading(false);
      },
      (err) => {
        console.error('❌ Error occurred while saving data:', err);
        message.error('An error occurred while saving');
        setIsLoading(false);
      },
    );
  };
  return (
    <>
      {console.log(villageData)}
      <Card>
        <h2 style={{ marginBottom: '15px' }}>
          <center>
            <FormattedMessage id="Village level officials form.form.title" />
          </center>
        </h2>
        {/* <h2 style={{ textAlign: 'center' }}>
          <FormattedMessage id="villageForm19.label.talathiCircle" />
        </h2> */}
        {/* <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={setVillage}
          yearChange={setRevenueYear}
        /> */}
        <Form layout="horizontal">
          <Row style={{ marginTop: 15 }}>
            <Col xl={5} lg={5} md={24} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.district" />}>
                <Select disabled placeholder={districtName}></Select>
              </Form.Item>
            </Col>

            <Col xl={1} lg={1}></Col>
            <Col xl={5} lg={5} md={24} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.taluka" />}>
                <Select disabled placeholder={talukaName}></Select>
              </Form.Item>
            </Col>

            <Col xl={1} lg={1}></Col>
            <Col xl={5} lg={6} md={24} xs={24} sm={24}>
              <Form.Item label="गाव">
                <Select disabled placeholder={village}></Select>
              </Form.Item>
              {/* <Form.Item wrapperCol={{ xl: 20, lg: 15 }} label="गाव">
                <Select
                  options={villageSaja}
                  placeholder="गाव निवडा"
                  onSelect={(value, event) => handleOnChange(value, event)}
                ></Select>
              </Form.Item> */}
            </Col>
          </Row>
        </Form>
      </Card>

      <Form layout="vertical" /* onFinish={onFormFinish} */ form={form}>
        <Card>
          <Divider orientation="left">
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>
          <Row>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.sarpanch" />}
                name="sarpanch"
                rules={[
                  { required: true, message: 'Enter your full name.' },
                  {
                    max: 50,
                    message: 'Sarpanch field shoud be upto 100 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.sarpanchMobile" />}
                name="sarpanchMobile"
                rules={[
                  { required: true, message: 'Enter mobile number.' },
                  {
                    max: 10,
                    message: 'Number or Quantity shoud be upto 10 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={10} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.sarpanchEmail" />}
                name="sarpanchEmail"
                rules={[
                  { required: true, message: 'Enter e-mail id.' },
                  {
                    max: 100,
                    message: 'Number or Quantity shoud be upto 100 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.police" />}
                name="police"
                rules={[
                  { required: true, message: 'Enter your full name.' },
                  {
                    max: 50,
                    message: 'police field shoud be upto 100 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.policeMobile" />}
                name="policeMobile"
                rules={[
                  { required: true, message: 'Enter mobile number.' },
                  {
                    max: 10,
                    message: 'Number or Quantity shoud be upto 10 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={10} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.policeEmail" />}
                name="policeEmail"
                rules={[
                  { required: true, message: 'Enter e-mail id.' },
                  {
                    max: 100,
                    message: 'Number or Quantity shoud be upto 100 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.gramsewak" />}
                name="gramsewak"
                rules={[
                  { required: true, message: 'Enter your full name.' },
                  {
                    max: 50,
                    message: 'gramsewak field shoud be upto 100 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.gramsewakMobile" />}
                name="gramsewakMobile"
                rules={[
                  { required: true, message: 'Enter mobile number.' },
                  {
                    max: 10,
                    message: 'Number or Quantity shoud be upto 10 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={10} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.gramsewakEmail" />}
                name="gramsewakEmail"
                rules={[
                  { required: true, message: 'Enter e-mail id.' },
                  {
                    max: 100,
                    message: 'Number or Quantity shoud be upto 100 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.mahsulsewak" />}
                name="mahsulsewak"
                rules={[
                  // { required: true, message: 'Enter your full name.' },
                  {
                    max: 50,
                    message: 'mahsulsewak field shoud be upto 100 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.mahsulsewakMobile" />}
                name="mahsulsewakMobile"
                rules={[
                  // { required: true, message: 'Enter mobile number.' },
                  {
                    max: 10,
                    message: 'Number or Quantity shoud be upto 10 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={10} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.mahsulsewakEmail" />}
                name="mahsulsewakEmail"
                rules={[
                  // { required: true, message: 'Enter e-mail id.' },
                  {
                    max: 100,
                    message: 'Number or Quantity shoud be upto 100 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.krushiSahyak" />}
                name="krushiSahyak"
                rules={[
                  // { required: true, message: 'Enter your full name.' },
                  {
                    max: 50,
                    message: 'कृषीसहाय्यक field shoud be upto 100 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.krushiSahyakMobile" />}
                name="krushiSahyakMobile"
                rules={[
                  // { required: true, message: 'Enter mobile number.' },
                  {
                    max: 10,
                    message: 'Number or Quantity shoud be upto 10 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={10} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.krushiSahyakEmail" />}
                name="krushiSahyakEmail"
                rules={[
                  // { required: true, message: 'Enter e-mail id.' },
                  {
                    max: 100,
                    message: 'Input field shoud be upto 100 character',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {sahayyaks.map((sahayyak, index) => (
              <React.Fragment key={index}>
                <Col xl={5} lg={5} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={index === 0 ? 'Pik Pahani Sahayyak Name' : ''}
                    name={['sahayyaks', index, 'name']}
                    rules={[{ max: 100, message: 'Max 100 characters allowed' }]}
                  >
                    <Input
                      placeholder="Enter name"
                      value={sahayyak.name}
                      onChange={(e) => handleChangeSahayyak(index, 'name', e.target.value)}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      maxLength={100}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1}></Col>

                <Col xl={5} lg={5} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={index === 0 ? 'Mobile' : ''}
                    name={['sahayyaks', index, 'mobile']}
                    rules={[{ max: 10, message: 'Max 10 digits allowed' }]}
                  >
                    <Input
                      placeholder="Enter mobile number"
                      value={sahayyak.mobile}
                      onChange={(e) => handleChangeSahayyak(index, 'mobile', e.target.value)}
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={10}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1}></Col>

                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    label={index === 0 ? 'Email' : ''}
                    name={['sahayyaks', index, 'email']}
                    rules={[{ max: 100, message: 'Max 100 characters allowed' }]}
                  >
                    <Input
                      placeholder="Enter email"
                      value={sahayyak.email}
                      onChange={(e) => handleChangeSahayyak(index, 'email', e.target.value)}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      maxLength={100}
                    />
                  </Form.Item>
                </Col>

                {index === 0 && sahayyaks.length < 4 && (
                  <Col
                    xl={1}
                    style={{ display: 'flex', alignItems: 'center', paddingLeft: '40px' }}
                  >
                    <Button type="dashed" onClick={handleAddSahayyak} icon={<PlusOutlined />} />
                  </Col>
                )}

                {index > 0 && (
                  <Col xl={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <MinusCircleOutlined
                      style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => handleRemoveSahayyak(index)}
                    />
                  </Col>
                )}
              </React.Fragment>
            ))}
          </Row>
          <Row>
            {sarkariSansthaO.map((sarkariSansthaO, index) => (
              <React.Fragment key={index}>
                <Col xl={5} lg={5} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={index === 0 ? 'Sanstha Adhikari Name' : ''}
                    name={['sahayyaks', index, 'name']}
                    rules={[{ max: 100, message: 'Max 100 characters allowed' }]}
                  >
                    <Input
                      placeholder="Enter name"
                      value={sarkariSansthaO.name}
                      onChange={(e) => handleChangeSahayyak(index, 'name', e.target.value)}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      maxLength={100}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1}></Col>

                <Col xl={5} lg={5} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={index === 0 ? 'Mobile' : ''}
                    name={['sarkariSansthaO', index, 'mobile']}
                    rules={[{ max: 10, message: 'Max 10 digits allowed' }]}
                  >
                    <Input
                      placeholder="Enter mobile number"
                      value={sarkariSansthaO.mobile}
                      onChange={(e) => handleChangeSahayyak(index, 'mobile', e.target.value)}
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={10}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1}></Col>

                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    label={index === 0 ? 'Email' : ''}
                    name={['sarkariSansthaO', index, 'email']}
                    rules={[{ max: 100, message: 'Max 100 characters allowed' }]}
                  >
                    <Input
                      placeholder="Enter email"
                      value={sarkariSansthaO.email}
                      onChange={(e) => handleChangeSahayyak(index, 'email', e.target.value)}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      maxLength={100}
                    />
                  </Form.Item>
                </Col>

                {index === 0 && sarkariSansthaO.length < 4 && (
                  <Col
                    xl={1}
                    style={{ display: 'flex', alignItems: 'center', paddingLeft: '40px' }}
                  >
                    <Button type="dashed" onClick={handleAddSahayyak} icon={<PlusOutlined />} />
                  </Col>
                )}

                {index > 0 && (
                  <Col xl={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <MinusCircleOutlined
                      style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => handleRemoveSahayyak(index)}
                    />
                  </Col>
                )}
              </React.Fragment>
            ))}
          </Row>
          <Row>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.patishtit1" />}
                name="patishtit1"
                rules={[
                  // { required: true, message: 'Enter e-mail id.' },
                  {
                    max: 50,
                    message: 'प्रतिष्ठित व्यक्ति १ field shoud be upto 100 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.patishtit1Mobile" />}
                name="patishtit1Mobile"
                rules={[
                  // { required: true, message: 'Enter mobile number.' },
                  {
                    max: 10,
                    message: 'Number or Quantity shoud be upto 10 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={10} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.patishtit1Email" />}
                name="patishtit1Email"
                rules={[
                  // { required: true, message: 'Field is necessary!' },
                  {
                    max: 100,
                    message: 'Number or Quantity shoud be upto 100 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.patishtit2" />}
                name="patishtit2"
                rules={[
                  // { required: true, message: 'Enter your full name.' },
                  {
                    max: 50,
                    message: 'प्रतिष्ठित व्यक्ति २ field shoud be upto 100 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.patishtit2Mobile" />}
                name="patishtit2Mobile"
                rules={[
                  // { required: true, message: 'Enter mobile number.' },
                  {
                    max: 10,
                    message: 'Number or Quantity shoud be upto 10 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={10} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="Village level officials.form.patishtit2Email" />}
                name="patishtit2Email"
                rules={[
                  // { required: true, message: 'Enter e-mail id.' },
                  {
                    max: 100,
                    message: 'Number or Quantity shoud be upto 100 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100} />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.authorityOfPurchase" />}
                name="authorityOfPurchase"
                rules={[
                  { required: true, message: 'Field is necessary!' },

                  {
                    max: 50,
                    message: 'Authority of Purchase shoud be upto 50 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.dateOfPurchase" />}
                name="dateOfPurchase"
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </Col>
          </Row> */}
          {/* <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.authorityOfVoucher" />}
                name="authorityOfVoucher"
                rules={[
                  // { required: true, message: 'Field is necessary!' },
                  {
                    max: 50,
                    message: 'Authority of Voucher shoud be upto 50 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.amountWrittenOff" />}
                name="amountWrittenOff"
                rules={[
                  // { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Amount Written Off shoud be upto 18 Number',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>
          </Row> */}
          {/* <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.amountRealized" />}
                name="amountRealized"
                rules={[
                  {
                    max: 18,
                    message: 'Amount Realized shoud be upto 18 Number',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.dateOfCreditAtTreasury" />}
                name="dateOfCreditAtTreasury"
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </Col>
          </Row> */}
          {/* <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.number" />}
                name="number"
                rules={[
                  { required: true, message: 'Field is necessary!' },

                  {
                    max: 18,
                    message: 'Number shoud be upto 18 Numericals',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.value" />}
                name="value"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Value shoud be upto 18 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>
          </Row> */}
          {/* <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remark" />}
                name="remarks"
                rules={[
                  // { required: true, message: 'Field is necessary!' },
                  {
                    max: 200,
                    message: 'Remarks shoud be upto 200 characters',
                  },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} />
              </Form.Item>
            </Col>
          </Row> */}
          <Row>
            <Col xl={7} lg={7} md={7} sm={5}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              {/*  <Popconfirm
                  title={<FormattedMessage id="formLanguage.form.popFo₹ave" />}
                  onConfirm={onFinish}
                  onCancel={cancel}
                  okText={<FormattedMessage id="formLanguage.form.yes" />}
                  cancelText={<FormattedMessage id="formLanguage.form.no" />}
                > */}
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                onClick={
                  /* getForm19Data */ () => {
                    if (servarthId) {
                      onFormFinish();
                    }
                  }
                }
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
              {/*  </Popconfirm> */}
            </Col>
            <Col lg={2} md={2} sm={3} xs={8}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              <Button
                type=""
                onClick={resetForm}
                style={{ color: 'white', backgroundColor: 'orange' }}
              >
                <FormattedMessage id="formLanguage.button.reset" />
              </Button>
            </Col>
            <Col lg={2} md={2} sm={3} xs={8}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              <Button type="danger" onClick={cancelForm}>
                <FormattedMessage id="formLanguage.button.cancel" />
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
}

export default VillageForm19;
