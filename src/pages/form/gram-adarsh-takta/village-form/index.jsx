// import ESelector from '@/components/eComponents/ESelector';
// import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi';
import moment from 'moment';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { useHistory, useLocation } from 'react-router';
import { useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import { InfoCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { useForm } from 'antd/es/form/Form';
import { set } from 'lodash';

const { Step } = Steps;

function GramAdarshChart() {
  const [currentStep, setCurrentStep] = useState(0);
  const [codeVillage, setCodeVillage] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [noOfList, setNoOfList] = useState();
  const [villageSaja, setVillageSaja] = useState([]);
  const [villageSajjaCode, setVillageSajjaCode] = useState();
  const [villageSajjaName, setVillageSajjaName] = useState();
  const [VillageCCode1, setVillageCCode1] = useState();

  const [bidumalaNiyatCurrent, setBidumalaNiyatCurrent] = useState();
  const [akrushakCurrent, setAkrushakCurrent] = useState();
  const [sankirnCurrent, setSankirnCurrent] = useState();
  const [educationalCessCurrent, setEducationalCessCurrent] = useState();
  const [employeeGuaranteeSchemeCurrent, setEmployeeGuaranteeSchemeCurrent] = useState();
  const [totalAmountCurrent, setTotalAmountCurrent] = useState();
  const [bidumalaNiyatPrevious, setBidumalaNiyatPrevious] = useState();
  const [akrushakPrevious, setAkrushakPrevious] = useState();
  const [sankirnPrevious, setSankirnPrevious] = useState();
  const [educationalCessPrevious, setEducationalCessPrevious] = useState();
  const [employeeGuaranteeSchemePrevious, setEmployeeGuaranteeSchemePrevious] = useState();
  const [totalAmountPrevious, setTotalAmountPrevious] = useState();
  const [vanJaminArea, setVanJaminArea] = useState('');
  const [villageSite, setVillageSite] = useState(0);
  const [potKharabArea, setPotKharabArea] = useState(0);
  const [mahsulMafKshetra,setMahsulMafKshetra]=useState('')
  const [akrushakArea, setAkrushakArea] = useState();
 const [khatedarKshetra, setKhatedarKshetra] = useState({
    entries: [
      { khatedarSankhya: '', kshetra: '' },
      { khatedarSankhya: '', kshetra: '' }
    ]
  });
  const desgNew = localStorage.getItem('desg');
  const { sendRequest } = useAxios();
  const {
    servarthId,
    districtCode,
    talukaCode,
    districtName,
    talukaName,
    desig,
    villageData,
    villageName,
  } = useModel('details');
  const [form15] = Form.useForm();
  const [form] = useForm();

  let history = useHistory();
  const location = useLocation();
  const Khatedarlabels = [
    '(अ) २.०२३ हेक्टरपेक्षा कमी ( म्हणजेच ५ एकरांपेक्षा कमी) जमीन धारण करणारे.',
    '(ब) २.०२३ हेक्टरपेक्षा जास्त (म्हणजेच ५ एकरापेक्षा अधिक) जमीन धारण करणारे.',
  ];
  const landTypes = [
    { key: 'kharip', label: 'खरीप' },
    { key: 'rabbi', label: 'रबी' },
    { key: 'उन्हाळी', label: 'उन्हाळी' },
    { key: 'total', label: 'एकूण' },
  ];

  useEffect(() => {
    setCodeVillage(villageData[0].cCode);

    const result = villageData.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => t.sajjaName === thing.sajjaName && t.sajjaCode === thing.sajjaCode),
    );
    setVillageSaja(
      result?.map((row) => ({
        label: row.sajjaName,
        value: row.sajjaCode,
      })),
    );
    setVillageCCode1(villageData[0].cCode);
    getAllTaxCalculationBycCode();
    getForestAndGaothanKshetra();
    getAkrushakAndPothkhrabAreaByccode();
    getKhatedarCountAndBelowArea();
    getMahsulMafKshetra()
    getJalSInchanWellData()
    getBindumalaAndDumalaAreas()
  }, []);

  const handleOnChange = (value, event) => {
    setVillageSajjaCode(value);
    setVillageSajjaName(event.label);
  };

  const handleChangeForList = (e) => {
    setNoOfList(e);
  };


  const getAllTaxCalculationBycCode = async () => {
    const VillageCCode = villageData[0].cCode;

    sendRequest(
      // `${URLS.BaseURL}/gramAdarshTakta/getAllTaxCalculationBycCode?ccode=272400110296420000`,
      // console.log(codeVillage,"codeVillage==========================================1"),
      `${URLS.BaseURL}/gramAdarshTakta/getAllTaxCalculationBycCode?ccode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
          setBidumalaNiyatCurrent(res.data.bidumalaNiyatCurrent);
          setAkrushakCurrent(res.data.akrushakCurrent);
          setSankirnCurrent(res.data.sankirnCurrent);
          setEducationalCessCurrent(res.data.educationalCessCurrent);
          setEmployeeGuaranteeSchemeCurrent(res.data.employeeGuaranteeSchemeCurrent);
          setTotalAmountCurrent(res.data.totalAmountCurrent);
          setBidumalaNiyatPrevious(res.data.bidumalaNiyatPrevious);
          setAkrushakPrevious(res.data.akrushakPrevious);
          setSankirnPrevious(res.data.sankirnPrevious);
          setEducationalCessPrevious(res.data.educationalCessPrevious);
          setEmployeeGuaranteeSchemePrevious(res.data.employeeGuaranteeSchemePrevious);
          setTotalAmountPrevious(res.data.totalAmountPrevious);

          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  const getForestAndGaothanKshetra = async () => {
    const VillageCCode = villageData[0].cCode;
    console.log(villageData[0].cCode, 'villageData==========================================');
    sendRequest(
      // `${URLS.BaseURL}/gramAdarshTakta/getForestAndGaothanKshetra?cCode=272400110296420000`,
      `${URLS.BaseURL}/gramAdarshTakta/getForestAndGaothanKshetra?cCode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
          setVanJaminArea(res.data.vanJaminArea);
     

          setVillageSite(res.data.villageSite);
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
const handleInputChange = (index, field, value) => {
    const newEntries = [...khatedarKshetra.entries];
    newEntries[index][field] = value;
    setKhatedarKshetra({ ...khatedarKshetra, entries: newEntries });
  };
  const getKhatedarCountAndBelowArea = async () => {
    const VillageCCode = villageData[0].cCode;
    console.log(villageData[0].cCode, 'villageData==========================================');
    sendRequest(
      // `${URLS.BaseURL}/gramAdarshTakta/getForestAndGaothanKshetra?cCode=272400110296420000`,
      `${URLS.BaseURL}/gramAdarshTakta/getKhatedarCountAndBelowArea?ccode=${VillageCCode}&revenueYear=2024-25`,

      'GET',
      null,
      (res) => {
        console.log(res.data,"checkkkkkk khatakshetra api data")
        if (res.status == 200) {
  setKhatedarKshetra({
        entries: [
          { 
            khatedarSankhya: res.data.khataCountWithName.toString(),
            kshetra: res.data.areaBelow2023.toString() 
          },
          { 
            khatedarSankhya: '', // Or set another value if needed
            kshetra: res.data.areaAbove2023.toString() 
          }
        ]
      });
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  const getAkrushakAndPothkhrabAreaByccode = async () => {
    const VillageCCode = villageData[0].cCode;

    sendRequest(
      // `${URLS.BaseURL}/gramAdarshTakta/getAllTaxCalculationBycCode?ccode=272400110296420000`,
      // console.log(codeVillage,"codeVillage==========================================1"),
      `${URLS.BaseURL}/gramAdarshTakta/getAkrushakAndPothkhrabAreaByccode?ccode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
          console.log(
            res.data.potKharabArea,
            'res.data.potKharabArea==========================================',
          );
          setAkrushakArea(res.data.akrushakArea);
          setPotKharabArea(res.data.potKharabArea);
          setIsLoading(false);
          form.setFieldsValue({
            potKharabKshetra: res.data.potKharabArea,
          });
          console.log(potKharabArea, 'potKharabArea==========================================');
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };


  const getMahsulMafKshetra=()=>{
        const VillageCCode = villageData[0].cCode;
         sendRequest(
      `${URLS.BaseURL}/gramAdarshTakta/getMahasulMafOrKamakariJaminiData?cCode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
         
         setMahsulMafKshetra(res.data.kamAkariArea)
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );

  }


  const getJalSInchanWellData = async () => {
            const VillageCCode = villageData[0].cCode;

   sendRequest(
      `${URLS.BaseURL}/gramAdarshTakta/getJalsinchanWellCountByccode?cCode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
          console.log(
            res.data,
            'res.data./getJalsinchanWellCountByccode?cCode==========================================',
          );
        //  setMahsulMafKshetra(res.data.kamAkariArea)
        }
      },
      (err) => {
        console.log(err, 'Error in /getJalsinchanWellCountByccode?cCode==========================================');
        setIsLoading(false);
      },
    );

  }


const getBindumalaAndDumalaAreas = async () => {
          const VillageCCode = villageData[0].cCode;
sendRequest(
      `${URLS.BaseURL}/gramAdarshTakta/getBindumalaAndDumalaAreas?ccode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
         
        //  setMahsulMafKshetra(res.data.kamAkariArea)
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );

}

  useEffect(() => {
    console.log('Updated potKharabArea:', potKharabArea);
  }, [potKharabArea]);
  const nextStep = () => {
    // Validate current step before proceeding
    form15
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((err) => {
        console.log('Validation failed:', err);
      });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const crops = ['भात', 'खरीप ज्वारी', 'रबी ज्वारी', 'गहू', 'भुईमूग', 'ऊस', 'कडधान्य', 'इतर पिके'];

  const columns = [
    {
      title: 'पिकाचे नाव',
      dataIndex: 'crop',
      key: 'crop',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'जलसिंचित क्षेत्र',
      children: [
        {
          title: 'हेक्टर.आर',
          dataIndex: ['jalashay', 'hectare'],
          render: (_, record) => (
            <Form.Item name={[record.key, 'jalashay', 'hectare']} style={{ margin: 0 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          ),
        },
      ],
    },
    {
      title: 'कोरडवाहू क्षेत्र',
      children: [
        {
          title: 'हेक्टर.आर',
          dataIndex: ['koradahu', 'hectare'],
          render: (_, record) => (
            <Form.Item name={[record.key, 'koradahu', 'hectare']} style={{ margin: 0 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          ),
        },
      ],
    },
    {
      title: 'इतर क्षेत्र',
      children: [
        {
          title: 'हेक्टर.आर',
          dataIndex: ['itar', 'hectare'],
          render: (_, record) => (
            <Form.Item name={[record.key, 'itar', 'hectare']} style={{ margin: 0 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          ),
        },
      ],
    },
    {
      title: 'एकूण',
      children: [
        {
          title: 'हेक्टर.आर',
          dataIndex: ['total', 'hectare'],
          render: (_, record) => (
            <Form.Item name={[record.key, 'total', 'hectare']} style={{ margin: 0 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          ),
        },
      ],
    },
  ];

  const dataSource = crops.map((crop, index) => ({
    key: index,
    crop,
  }));

  useEffect(() => {
    const initialValues = {};
    dataSource.forEach((item) => {
      initialValues[item.key] = {
        jalashay: { hectare: 0, are: 0 },
        koradahu: { hectare: 0, are: 0 },
        itar: { hectare: 0, are: 0 },
        total: { hectare: 0, are: 0 },
      };
    });
    form.setFieldsValue(initialValues);
  }, [form, dataSource]);

  const akrushakcolumns = [
    {
      title: 'अकृषिक आकारणीची एकूण मागणी',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'चालू वर्ष',
      dataIndex: 'chaluVarsh',
      key: 'chaluVarsh',
      render: (_, record, index) => (
        <Form.Item
          name={['mahgani', index, 'chaluVarsh']}
          rules={[{ required: true, message: 'Enter Chalu Varsh' }]}
          noStyle
        >
          <Input placeholder="चालू वर्ष" />
        </Form.Item>
      ),
    },
    {
      title: 'मागील वर्ष ',
      dataIndex: 'maghilVarsh',
      key: 'maghilVarsh',
      render: (_, record, index) => (
        <Form.Item
          name={['mahgani', index, 'maghilVarsh']}
          rules={[{ required: true, message: 'Enter Maghil Varsh' }]}
          noStyle
        >
          <Input placeholder="मागील वर्ष" />
        </Form.Item>
      ),
    },
  ];

  const akrushakdataSource = [
    {
      key: '1',
      label: '',
    },
  ];

  // --------------------------------------

  const data = [
    { key: '1', name: '१. कालवे' },
    { key: '2', name: '२. बांध' },
    { key: '3', name: '३. विहिरी ' },
    { key: '3a', name: 'अ. मोटा' },
    { key: '3b', name: 'ब. तेल इंजिन' },
    { key: '3c', name: 'क. विजेवर मोटारी' },
    { key: '3d', name: 'ड. उघरण जलसिंचन' },
    { key: '3e', name: 'ई. पंप संच' },
    { key: '4', name: '४. बुडकी' },
    { key: '5', name: '५. इतर' },
  ];

  const waterResoursescolumns = [
    {
      title: 'साधनाचे नाव',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'संख्या',
      dataIndex: 'number',
      key: 'number',
      render: (_, record) => (
        <Form.Item name={[record.key, 'number']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '120px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'क्षेत्रफळ (हेक्टर.आर) ',
      dataIndex: 'hectare',
      key: 'hectare',
      render: (_, record) => (
        <Form.Item name={[record.key, 'hectare']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '120px' }} />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    const initialValues = {};
    const setDefaults = (items) => {
      items.forEach((item) => {
        initialValues[item.key] = { number: 0, hectare: 0, are: 0 };
        if (item.children) setDefaults(item.children);
      });
    };
    setDefaults(data);
    form.setFieldsValue(initialValues);
  }, [form]);

  const Yeardata = [
    { key: '1', year: 'चालू वर्ष' },
    { key: '2', year: 'मागील वर्ष' },
  ];

  const maganiYearcolumns = [
    {
      title: 'वर्ष',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'नियत',
      dataIndex: 'niyat',
      key: 'niyat',
      render: (_, record) => (
        <Form.Item name={[record.key, 'niyat']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'संकीर्ण',
      dataIndex: 'sankirn',
      key: 'sankirn',
      render: (_, record) => (
        <Form.Item name={[record.key, 'sankirn']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'एकूण',
      dataIndex: 'ekun',
      key: 'ekun',
      render: (_, record, index) => {
        return (
          <Form.Item shouldUpdate style={{ margin: 0 }}>
            {({ getFieldValue }) => {
              const niyat = getFieldValue([record.key, 'niyat']) || 0;
              const sankirn = getFieldValue([record.key, 'sankirn']) || 0;
              const total = niyat + sankirn;
              return <span>{total}</span>;
            }}
          </Form.Item>
        );
      },
    },
  ];

  const itaritarmaganiYearcolumns = [
    {
      title: 'वर्ष',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'शिक्षण कर ',
      dataIndex: 'shikshanupkar',
      key: 'shikshanupkar',
      render: (_, record) => (
        <Form.Item name={[record.key, 'shikshanupkar']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'रोजगार हमी कर',
      dataIndex: 'rojgarhami',
      key: 'rojgarhami',
      render: (_, record) => (
        <Form.Item name={[record.key, 'rojgarhami']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },

    {
      title: 'पाटबंधारे विषयक येणे रक्कम ',
      dataIndex: 'pathbandharerakkam',
      key: 'pathbandharerakkam',
      render: (_, record) => (
        <Form.Item name={[record.key, 'pathbandharerakkam']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'इतर कर ',
      dataIndex: 'itarkar',
      key: 'itarkar',
      render: (_, record) => (
        <Form.Item name={[record.key, 'itarkar']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
  ];

  const waterSypplytype = [
    { key: '1', supply: 'पिण्यासाठी' },
    { key: '2', supply: 'शेतीसाठी' },
  ];
  const waterSupplyresourses = [
    {
      title: 'पुरवठा प्रकार',
      dataIndex: 'supply',
      key: 'supply',
    },
    {
      title: 'विहीर संख्या',
      dataIndex: 'wellsNo',
      key: 'wellsNo',
      render: (_, record) => (
        <Form.Item name={[record.key, 'wellsNo']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'नदी संख्या',
      dataIndex: 'riverNo',
      key: 'riverNo',
      render: (_, record) => (
        <Form.Item name={[record.key, 'riverNo']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'विंधणविहीर संख्या',
      dataIndex: 'tubewellsNo',
      key: 'tubewellsNo',
      render: (_, record) => (
        <Form.Item name={[record.key, 'tubewellsNo']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'कालवा संख्या ',
      dataIndex: 'kalvaNo',
      key: 'kalvaNo',
      render: (_, record) => (
        <Form.Item name={[record.key, 'kalvaNo']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
    {
      title: 'तलाव संख्या ',
      dataIndex: 'talaavNo',
      key: 'talaavNo',
      render: (_, record) => (
        <Form.Item name={[record.key, 'talaavNo']} style={{ margin: 0 }}>
          <InputNumber min={0} defaultValue={0} size="small" style={{ width: '200px' }} />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    const initialValues = {};
    Yeardata.forEach((item) => {
      initialValues[item.key] = { niyat: 0, sankirn: 0 };
    });
    form.setFieldsValue(initialValues);
  }, [form]);

  // --------------------------------------

  const animalColumns = [
    {
      title: 'गुरांची आणि पशू संख्या',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'शिंग असलेली',
      dataIndex: 'shingAsleli',
      key: 'shingAsleli',
      render: (_, record, index) => (
        <Form.Item
          name={['animals', index, 'shingAsleli']}
          rules={[{ required: true, message: 'शिंग असलेली संख्या द्या' }]}
          noStyle
        >
          <Input placeholder="शिंग असलेली" />
        </Form.Item>
      ),
    },
    {
      title: 'शिंग नसलेली',
      dataIndex: 'shingNasleli',
      key: 'shingNasleli',
      render: (_, record, index) => (
        <Form.Item
          name={['animals', index, 'shingNasleli']}
          rules={[{ required: true, message: 'शिंग नसलेली संख्या द्या' }]}
          noStyle
        >
          <Input placeholder="शिंग नसलेली" />
        </Form.Item>
      ),
    },
  ];

  const irrigatedwellsSource = [
    {
      key: '1',
      label: '',
    },
  ];
  const animaldataSource = [
    {
      key: '1',
      label: '',
    },
  ];

  const irrigatedwellsColumns = [
    {
      title: 'जलसिंचन विहीरिंची संख्या',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'वापरात असलेल्या विहीरिंची संख्या ',
      dataIndex: 'inuse',
      key: 'inuse',
      render: (_, record, index) => (
        <Form.Item name={['inUsewells', index, 'inuse']} noStyle>
          <Input placeholder="वापरात असलेल्या विहीरिंची संख्या" />
        </Form.Item>
      ),
    },
    {
      title: 'वापरात नसलेल्या  विहीरिंची संख्या',
      dataIndex: 'notInUse',
      key: 'notInUse',
      render: (_, record, index) => (
        <Form.Item name={['notInUsewells', index, 'notInUse']} noStyle>
          <Input placeholder="वापरात नसलेल्या  विहीरिंची संख्या" />
        </Form.Item>
      ),
    },
  ];

  const steps = [
    {
      title: '',
      content: (
        <>
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Area is Required' },
                  { max: 12, message: 'Area should be upto 12 Characters' },
                ]}
                name={'area'}
                label={<FormattedMessage id="gramAdarshTakta.area" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                // rules={[
                //   { required: true, message: 'Playground Area is Required' },
                //   { max: 12, message: 'Playground Area should be upto 12 Characters' },
                // ]}
                name={'playgroundArea'}
                label={<FormattedMessage id="gramAdarshTakta.playground" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                // rules={[
                //   { required: true, message: 'Encroachment Area is Required' },
                //   { max: 12, message: 'Encroachment Area should be upto 12 Characters' },
                // ]}
                name={'encroachmentArea'}
                label={<FormattedMessage id="gramAdarshTakta.encroachment" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={6} lg={6} md={6} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Revenue-exempt Area is Required' },
                  { max: 12, message: 'Revenue-exempt Area should be upto 12 Characters' },
                ]}
                label={<FormattedMessage id="gramAdarshTakta.mahsulMafJaminKshetra" />}
              >
                <Input maxLength={12}  
                  value={mahsulMafKshetra}
                  onChange={(e) => setMahsulMafKshetra(e.target.value)}
                  onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Pasture Area is Required' },
                  { max: 12, message: 'Pasture Area should be upto 12 Characters' },
                ]}
                name={'pastureArea'}
                label={<FormattedMessage id="gramAdarshTakta.pastureArea" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Area of ​​land under non-agricultural use is Required',
                  },
                  {
                    max: 12,
                    message:
                      'Area of ​​land under non-agricultural use should be upto 12 Characters',
                  },
                ]}
                label={<FormattedMessage id="gramAdarshTakta.AkrushikJaminKshetra" />}
              >
                <Input maxLength={12}  
                  value={akrushakArea}
                  onChange={(e) => setAkrushakArea(e.target.value)}
                  onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Government wasteland area is Required' },
                  { max: 12, message: 'Government wasteland area should be upto 12 Characters' },
                ]}
                name={'sarkariPaditKshetra'}
                label={<FormattedMessage id="gramAdarshTakta.sarkariPaditKshetra" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Wasteland area is Required' },
                  { max: 12, message: 'Wasteland area should be upto 12 Characters' },
                ]}
                name={'pastureArea'}
                label={<FormattedMessage id="gramAdarshTakta.padikKshetra" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
          </Row>
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                label={<FormattedMessage id="gramAdarshTakta.potKharabKshetra" />}
                rules={[
                  { required: true, message: 'Government wasteland area is Required' },
                  { max: 12, message: 'Government wasteland area should be up to 12 characters' },
                ]}
               
              >
                <Input
                  maxLength={12}
                  value={potKharabArea}
                  onChange={(e) => setPotKharabArea(e.target.value)}
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Gaothan area is Required' },
                  { max: 12, message: 'Gaothan area should be up to 12 characters' },
                ]}
                label={<FormattedMessage id="gramAdarshTakta.gavthanKshetra" />}
              >
                <Input
                  value={villageSite}
                  onChange={(e) => setVillageSite(e.target.value)}  
                   maxLength={12} 
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
  <Form.Item
    rules={[
      { required: true, message: 'Government wasteland area is Required' },
      { max: 12, message: 'Government wasteland area should be upto 12 Characters' },
    ]}
    label={<FormattedMessage id="gramAdarshTakta.vanJaminKshetra" />}
  >
    <Input 
      value={vanJaminArea}
      onChange={(e) => setVanJaminArea(e.target.value)}
      maxLength={12} 
      onKeyPress={KeyPressEvents.isInputNumber} 
    />
  </Form.Item>
</Col>  
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Area is Required' },
                  { max: 12, message: 'Area should be upto 12 Characters' },
                ]}
                name={'kArea'}
                label={<FormattedMessage id="gramAdarshTakta.kshetrfal" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Area of ​​irrigated land is Required' },
                  { max: 12, message: 'Area of ​​irrigated land should be upto 12 Characters' },
                ]}
                name={'bagayatJaminKshetra'}
                label={<FormattedMessage id="gramAdarshTakta.bagayatJaminKshetra" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form>
              <Row>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 16 }}>
                  <FormattedMessage
                    style={{ textAlign: 'center' }}
                    id="gramAdarshTakta.KhatedarSankhyaAndKshetra"
                  />
                </h3>
                {/* (अ) २.०२३ हेक्टरपेक्षा कमी ( म्हणजेच ५ एकरांपेक्षा कमी) जमीन धारण करणारे.
(ब) २.०२३ हेक्टरपेक्षा जास्त (म्हणजेच ५ एकरापेक्षा अधिक) जमीन धारण करणारे. */}
              </Row>
              <Row gutter={16}>
                <Col span={10}>
                  <strong>क्र.</strong>
                </Col>
                <Col span={6}>
                  <strong>खतेदारांची संख्या </strong>
                </Col>
                <Col span={4}>
                  <strong style={{ paddingLeft: '10' }}>क्षेत्र </strong>
                </Col>
              </Row>

              {Khatedarlabels.map((label, index) => (
        <Row key={index} style={{ marginTop: 8 }}>
          <Col span={10}>{label}</Col>
          <Col span={4}>
            <Form.Item
              // label={index === 0 ? "Khatedar Sankhya" : ""}
              rules={[
                { required: true, message: 'Khatedar Sankhya is required' },
                { max: 12, message: 'Max 12 characters' },
              ]}
            >
              <Input 
                value={khatedarKshetra.entries[index].khatedarSankhya}
                onChange={(e) => handleInputChange(index, 'khatedarSankhya', e.target.value)}
                maxLength={12} 
              />
            </Form.Item>
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
          <Col style={{ paddingLeft: '10' }} span={6}>
            <Form.Item
              // label={index === 0 ? "Kshetra" : ""}
              rules={[{ required: true, message: 'Kshetra is required' }]}
            >
              <Input 
                value={khatedarKshetra.entries[index].kshetra}
                onChange={(e) => handleInputChange(index, 'kshetra', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      ))}
            </Form>
          </Row>

          <Form form={form} name="land_form_table" autoComplete="off">
            <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>लागवडयोग्य जमिनीचे क्षेत्र </h3>

            <Row gutter={16} style={{ fontWeight: 'bold', marginBottom: 2 }}>
              <Col span={8}>जमीन प्रकार</Col>
              <Col span={8}>क्षेत्र (हेक्टर.आर)</Col>
            </Row>

            {landTypes.map((item, index) => (
              <Row gutter={16} key={item.key} style={{ marginBottom: 2 }}>
                <Col span={8}>{item.label}</Col>
                <Col span={8}>
                  <Form.Item
                    name={[item.key, 'hectare']}
                    rules={[{ required: true, message: 'हेक्टर आवश्यक आहे' }]}
                  >
                    <Input defaultValue={0} placeholder="क्षेत्र" />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Form>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
            जलसिंचनाची साधने व क्षेत्रफळ (Water Irrigation Resources and Area)
          </h3>
          {/* <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>
      </Title> */}
          <Form form={form} name="water_resources_table" autoComplete="off">
            <Table
              columns={waterResoursescolumns}
              dataSource={data}
              pagination={false}
              bordered
              size="small"
            />
          </Form>
        </>
      ),
    },
    {
      title: '',
      content: (
        <>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
            एकूण जमीन महसूल मागणी (EKUN JAMIN MAHSUL MAGANI)
          </h3>

          <Form
            form={form}
            name="ekun_jamin_mahsul"
            autoComplete="off"
            style={{ marginBottom: 20 }}
          >
            <Table
              columns={maganiYearcolumns}
              dataSource={Yeardata}
              pagination={false}
              bordered
              size="small"
            />
          </Form>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
            इतर महसुली मागण्या (Other Revenue Demands)
          </h3>

          <Form
            form={form}
            name="itar_jamin_mahsul"
            autoComplete="off"
            style={{ marginBottom: 20 }}
          >
            <Table
              columns={itaritarmaganiYearcolumns}
              dataSource={Yeardata}
              pagination={false}
              bordered
              size="medium"
            />
          </Form>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
            अकृषिक आकारणीची एकूण मागणी (Total Demand for Non-Agricultural Land)
          </h3>
          <Form
            form={form}
            name="akrushak_jamin_mahsul"
            autoComplete="off"
            style={{ marginBottom: 20 }}
          >
            <Table
              columns={akrushakcolumns}
              dataSource={akrushakdataSource}
              pagination={false}
              bordered
              size="middle"
            />
          </Form>

          <Row xl={1} lg={1} md={1} sm={1} xs={1}></Row>
        </>
      ),
    },
    {
      title: '',
      content: (
        <>
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                name="population"
                label={
                  <Space>
                    <FormattedMessage id="gramAdarshTakta.population" />
                    <Tooltip title="चालू केलेल्या जनगणणे अनुसार असलेली लोकसंख्या">
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    </Tooltip>
                  </Space>
                }
                rules={[
                  { required: true, message: 'Population is Required' },
                  { max: 12, message: 'Population should be up to 12 characters' },
                ]}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of Landless workers is Required' },
                  { max: 12, message: 'No. Of Landless workers should be upto 12 Characters' },
                ]}
                name={'landlessworkers'}
                label={<FormattedMessage id="gramAdarshTakta.landless" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of Craftsmen is Required' },
                  { max: 12, message: 'No. Of Craftsmen should be upto 12 Characters' },
                ]}
                name={'craftsmenno'}
                label={<FormattedMessage id="gramAdarshTakta.craftsmen" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
          </Row>

          <Form form={form} name="animal_count_form" autoComplete="off">
            <Table
              columns={animalColumns}
              dataSource={animaldataSource}
              pagination={false}
              bordered
              size="small"
            />
          </Form>

          <Form form={form} name="well_count_form" autoComplete="off" style={{ marginTop: 20 }}>
            <Table
              columns={irrigatedwellsColumns}
              dataSource={irrigatedwellsSource}
              pagination={false}
              bordered
              size="small"
            />
          </Form>
          <Form
            form={form}
            name="dynamic_vasti_form"
            initialValues={{ vadyanchiList: [{}] }}
            autoComplete="off"
          >
            <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 16 }}>
              गावातील वाड्यांची नावे व त्यांची लोकसंख्या
            </h3>

            <Form.List name="vadyanchiList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} style={{ marginBottom: 8, alignItems: 'center' }}>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'nave']}
                          rules={[{ required: true, message: 'वाड्याचे नाव आवश्यक आहे' }]}
                        >
                          <Input placeholder="वाड्याचे नाव" />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'loksankhya']}
                          rules={[{ required: true, message: 'लोकसंख्या आवश्यक आहे' }]}
                        >
                          <Input placeholder="लोकसंख्या" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ fontSize: 20, color: 'red', cursor: 'pointer' }}
                          />
                        )}
                      </Col>
                    </Row>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      नवा वाडा जोडा
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </>
      ),
    },

    {
      title: '',
      content: (
        <>
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of Water Resources is Required' },
                  { max: 12, message: 'No. Of Water Resources should be upto 12 Characters' },
                ]}
                name={'waterResoursesnos'}
                label={<FormattedMessage id="gramAdarshTakta.waterResourses" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'rainfall value is Required' },
                  { max: 12, message: 'rainfall value should be upto 12 Characters' },
                ]}
                name={'rainfall'}
                label={<FormattedMessage id="gramAdarshTakta.rainfall" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
            पाणी पुरवठ्याची साधने (Water Supply Resources)
          </h3>

          <Form
            form={form}
            name="itar_jamin_mahsul"
            autoComplete="off"
            style={{ marginBottom: 20 }}
          >
            <Table
              columns={waterSupplyresourses}
              dataSource={waterSypplytype}
              pagination={false}
              bordered
              size="medium"
            />
          </Form>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>प्रमुख पिके </h3>
          <Form form={form} name="land_crop_table" autoComplete="off">
            <Table dataSource={dataSource} columns={columns} pagination={false} bordered />
          </Form>
        </>
      ),
    },

    {
      title: '',
      content: (
        <div>
          {/* sankhya */}

          <h2 style={{ fontWeight: 'bold', color: 'blue' }}>सार्वजनिक आणि सहकारी संस्था : </h2>
          <br />
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of Grampanchayat  is Required' },
                  { max: 12, message: 'No of Grampanchayat  should be upto 12 Characters' },
                ]}
                name={'grampanchayat'}
                label={<FormattedMessage id="gramAdarshTakta.grampanchayat" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of PanchayatSamiti is Required' },
                  { max: 12, message: 'No of PanchayatSamiti should be upto 12 Characters' },
                ]}
                name={'panchayatSamiti'}
                label={<FormattedMessage id="gramAdarshTakta.panchayatSamiti" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of Nyaypanchyayct is Required' },
                  { max: 12, message: 'No of Nyaypanchyayct should be upto 12 Characters' },
                ]}
                name={'nyaypanchyayct'}
                label={<FormattedMessage id="gramAdarshTakta.nyaypanchyayct" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of Government Organizations is Required' },
                  {
                    max: 12,
                    message: 'No of Government Organizations should be upto 12 Characters',
                  },
                ]}
                name={'GovOrg'}
                label={<FormattedMessage id="gramAdarshTakta.GovOrg" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of E-seva kendra is Required' },
                  { max: 12, message: 'No. Of E-seva kendra should be upto 12 Characters' },
                ]}
                name={'eSevakendraNos'}
                label={<FormattedMessage id="gramAdarshTakta.eSevakendra" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of policeStation is Required' },
                  { max: 12, message: 'No. Of policeStation should be upto 12 Characters' },
                ]}
                name={'policeStation'}
                label={<FormattedMessage id="gramAdarshTakta.policeStation" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of Post Office is Required' },
                  { max: 12, message: 'No. Of Post Office should be upto 12 Characters' },
                ]}
                name={'postOffice'}
                label={<FormattedMessage id="gramAdarshTakta.postOffice" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of Primary Schools is Required' },
                  { max: 12, message: 'No. Of Primary Schools should be upto 12 Characters' },
                ]}
                name={'primarySchool'}
                label={<FormattedMessage id="gramAdarshTakta.primarySchool" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of Secondary Schools is Required' },
                  { max: 12, message: 'No. Of Secondary Schools should be upto 12 Characters' },
                ]}
                name={'secondarySchool'}
                label={<FormattedMessage id="gramAdarshTakta.secondarySchool" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of MNadhyamik Schools is Required' },
                  { max: 12, message: 'No of MNadhyamik Schools should be upto 12 Characters' },
                ]}
                name={'madhyamikSchool'}
                label={<FormattedMessage id="gramAdarshTakta.madhyamikSchool" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of colleges is Required' },
                  { max: 12, message: 'No of colleges should be upto 12 Characters' },
                ]}
                name={'colleges'}
                label={<FormattedMessage id="gramAdarshTakta.colleges" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of Transportations is Required' },
                  { max: 12, message: 'No of Transportations should be upto 12 Characters' },
                ]}
                name={'transportations'}
                label={<FormattedMessage id="gramAdarshTakta.transportations" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
            {/* <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item label="गावातील पिके घेण्यात येणार हंगाम">
                <Select placeholder="हंगाम निवडा">
                  <Select.Option value="flow-smooth">खरीप</Select.Option>
                  <Select.Option value="flow-polyline">रब्बी</Select.Option>
                  <Select.Option value="flow-polyline-round">उन्हाळी</Select.Option>
                  <Select.Option value="flow-polyline-round">संपूर्ण</Select.Option>
                </Select>
              </Form.Item>
              
            </Col> */}
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of Cooperative Factories is Required' },
                  { max: 12, message: 'No of Cooperative Factories should be upto 12 Characters' },
                ]}
                name={'CooperativeFactories'}
                label={<FormattedMessage id="gramAdarshTakta.CooperativeFactories" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of hospitals is Required' },
                  { max: 12, message: 'No. Of hospitals should be upto 12 Characters' },
                ]}
                name={'hospitals'}
                label={<FormattedMessage id="gramAdarshTakta.hospitals" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'No of Ration shop is Required' },
                  { max: 12, message: 'No of Ration shop should be upto 12 Characters' },
                ]}
                name={'rashanshop'}
                label={<FormattedMessage id="gramAdarshTakta.rashanshop" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Nearest Railway Station and Distance is Required' },
                  {
                    max: 12,
                    message: 'Nearest Railway Station and Distance should be upto 12 Characters',
                  },
                ]}
                name={'NearestRailwayStationandDistance'}
                label={<FormattedMessage id="gramAdarshTakta.NearestRailwayStationandDistance" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
          </Row>

          {/* ///////////////////////////////////////////////// */}
          <h3 style={{ fontWeight: 'bold', color: 'blue' }}>
            {' '}
            <FormattedMessage id="gramAdarshTakta.VillageOfficersName" />
          </h3>
          <Row>
            <Col xl={6} lg={6} md={6} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Sarpanch name is Required' },
                  { max: 50, message: 'Sarpanch name should be upto 50 Characters' },
                ]}
                name={'library'}
                label={<FormattedMessage id="gramAdarshTakta.Sarpanch" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={6} lg={6} md={6} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Police Patil Name is Required' },
                  { max: 50, message: 'Police Patil Name should be upto 50 Characters' },
                ]}
                name={'PolicePatil'}
                label={<FormattedMessage id="gramAdarshTakta.PolicePatil" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={6} lg={6} md={6} sm={8} xs={8}>
              <Form.Item
                rules={[
                  { required: true, message: 'Kotval Name is Required' },
                  { max: 12, message: 'Kotval Name should be upto 12 Characters' },
                ]}
                name={'kotval'}
                label={<FormattedMessage id="gramAdarshTakta.kotval" />}
              >
                <Input maxLength={12} onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
          </Row>

          <h3>Please review your information before submitting</h3>
          <p>You can go back to previous steps to make changes if needed.</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Row>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}></Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <h2>
              <FormattedMessage id="gramAdarshTakta.heading" />
            </h2>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}></Col>
        </Row>
        <Form layout="horizontal">
          <Row style={{ marginTop: 10 }}>
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
            <Col xl={5} lg={5} md={24} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.village" />}>
                <Select disabled placeholder={villageName}></Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          {steps.map((step) => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>

        <Form form={form15} layout="vertical">
          <div className="steps-content">{steps[currentStep].content}</div>

          <div className="steps-action" style={{ marginTop: 24 }}>
            <Row>
              {currentStep > 0 && (
                <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                  <Button onClick={prevStep}>Previous</Button>
                </Col>
              )}

              {currentStep < steps.length - 1 && (
                <Col xs={2} sm={2} md={2} lg={2} xl={2} offset={currentStep > 0 ? 1 : 0}>
                  <Button type="primary" onClick={nextStep}>
                    Next
                  </Button>
                </Col>
              )}

              {currentStep === steps.length - 1 && (
                <>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Button
                      type="primary"
                      loading={isLoading}
                      onClick={() => {
                        if (servarthId) {
                          saveForm15();
                        }
                      }}
                    >
                      <FormattedMessage id="formLanguage.button.save" />
                    </Button>
                  </Col>
                  <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
                  <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                    <Button
                      onClick={() => {
                        form15.resetFields();
                      }}
                      type="default"
                      style={{ color: 'white', backgroundColor: 'orange' }}
                    >
                      <FormattedMessage id="formLanguage.button.reset" />
                    </Button>
                  </Col>
                  <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
                  <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                    <Button
                      onClick={() => {
                        history.push({
                          pathname: '/form/village-form-15/table-form',
                        });
                      }}
                      type="danger"
                    >
                      <FormattedMessage id="formLanguage.button.cancel" />
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          </div>
        </Form>
      </Card>
    </>
  );
}

export default GramAdarshChart;
