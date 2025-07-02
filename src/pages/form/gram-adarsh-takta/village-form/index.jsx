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
  Typography,
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
import { set, values } from 'lodash';

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
  const [kuranArea, setKuranArea] = useState('');
  const [bagayatArea, setBagayatArea] = useState('');
  const [mahsulMagniAll, setMahsulMagniAll] = useState({
    current: {
      niyat: 0,
      sankirn: 0,
      total: 0,
    },
    previous: {
      niyat: 0,
      sankirn: 0,
      total: 0,
    },
  });

  // Initialize state with matching keys
  const [itaritarmaganiData, setItaritarmaganiData] = useState({
    current: {
      shikshanupkar: 0,
      rojgarhami: 0,
    },
    previous: {
      shikshanupkar: 0,
      rojgarhami: 0,
    },
  });
  const [wellsData, setWellsData] = useState([
    {
      label: 'जलसिंचन विहीरिंची संख्या',
      inuse: '',
      notInUse: '',
    },
  ]);

  const [akrushakData, setAkrushakData] = useState([
    {
      label: 'अकृषिक आकारणीची एकूण मागणी',
      chaluVarsh: '',
      maghilVarsh: '',
    },
  ]);

  const [VillageCCode1, setVillageCCode1] = useState();

  const [totalAmountPrevious, setTotalAmountPrevious] = useState();
  const [vanJaminArea, setVanJaminArea] = useState('');
  const [villageSite, setVillageSite] = useState(0);
  const [potKharabArea, setPotKharabArea] = useState(0);
  const [mahsulMafKshetra, setMahsulMafKshetra] = useState('');
  const [akrushakArea, setAkrushakArea] = useState();
  const [landTypes] = useState([
    { key: 'kharip', label: 'खरीप', payloadKey: 'kharipArea' },
    { key: 'rabbi', label: 'रबी', payloadKey: 'rabbiArea' },
    { key: 'total', label: 'एकूण', payloadKey: 'kharipRabbiTotalArea' },
  ]);
  const [khsetrafalArea, setKhsetrafalArea] = useState({
    bindumalaArea: '',
    dumalaArea: '',
    totalArea: '',
  });
  const [population, setPopulation] = useState({
    male: '',
    female: '',
    total: '',
  });
  const [khatedarKshetra, setKhatedarKshetra] = useState({
    entries: [
      { khatedarSankhya: '', kshetra: '' },
      { khatedarSankhya: '', kshetra: '' },
    ],
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
  const modul=useModel('details');
  const [form15] = Form.useForm();
  const [form] = useForm();
  const [formAnimal] = Form.useForm();        // For animal form
  const [jalsinchanForm] = Form.useForm();        // For jalsinchan sadhane form
  const [cropForm] = Form.useForm();        // For jalsinchan sadhane form
  const [resoursesForm] = Form.useForm();        // For jalsinchan sadhane form


  let history = useHistory();
  const location = useLocation();
  const Khatedarlabels = [
    '(अ) २.०२३ हेक्टरपेक्षा कमी ( म्हणजेच ५ एकरांपेक्षा कमी) जमीन धारण करणारे.',
    '(ब) २.०२३ हेक्टरपेक्षा जास्त (म्हणजेच ५ एकरापेक्षा अधिक) जमीन धारण करणारे.',
  ];

  

  useEffect(() => {
    console.log(modul,"modul==========================================");
    const male = parseInt(population.male) || 0;
    const female = parseInt(population.female) || 0;
    const total = male + female;

    // Update both state and form value
    setPopulation((prev) => ({ ...prev, total: total.toString() }));
    form15.setFieldsValue({ totalPopulation: total });
  }, [population.male, population.female]);
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
    getMahsulMafKshetra();
    getJalSInchanWellData();
    getBindumalaAndDumalaAreas();
    getKuranandBagayatAreas();
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
          // setBidumalaNiyatCurrent(res.data.bidumalaNiyatCurrent);
          // setSankirnCurrent(res.data.sankirnCurrent);
          // setTotalAmountCurrent(res.data.totalAmountCurrent);
          //           setTotalAmountPrevious(res.data.totalAmountPrevious);
          //  setSankirnPrevious(res.data.sankirnPrevious);
          // setBidumalaNiyatPrevious(res.data.bidumalaNiyatPrevious);
          setMahsulMagniAll({
            current: {
              niyat: res.data.bidumalaNiyatCurrent || 0,
              sankirn: res.data.sankirnCurrent || 0,
              total: res.data.totalAmountCurrent || 0,
            },
            previous: {
              niyat: res.data.bidumalaNiyatPrevious || 0,
              sankirn: res.data.sankirnPrevious || 0,
              total: res.data.totalAmountPrevious || 0,
            },
          });

          setItaritarmaganiData({
            current: {
              shikshanupkar: res.data.educationalCessCurrent,
              rojgarhami: res.data.employeeGuaranteeSchemeCurrent,
            },
            previous: {
              shikshanupkar: res.data.educationalCessPrevious,
              rojgarhami: res.data.employeeGuaranteeSchemePrevious,
            },
          });
          setAkrushakData([
            {
              label: 'अकृषिक आकारणीची एकूण मागणी',
              chaluVarsh: res.data.akrushakCurrent,
              maghilVarsh: res.data.akrushakPrevious,
            },
          ]);

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
        console.log(res.data, 'checkkkkkk khatakshetra api data');
        if (res.status == 200) {
          setKhatedarKshetra({
            entries: [
              {
                khatedarSankhya: res.data.khataCountBelow2023.toString(),
                kshetra: res.data.areaBelow2023.toString(),
              },
              {
                khatedarSankhya:res.data.khataCountAbove2023.toString(), // Or set another value if needed
                kshetra: res.data.areaAbove2023.toString(),
              },
            ],
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

  const getMahsulMafKshetra = () => {
    const VillageCCode = villageData[0].cCode;
    sendRequest(
      `${URLS.BaseURL}/gramAdarshTakta/getMahasulMafOrKamakariJaminiData?cCode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
          setMahsulMafKshetra(res.data.kamAkariArea);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  const getJalSInchanWellData = async () => {
    const VillageCCode = villageData[0].cCode;

    sendRequest(
      `${URLS.BaseURL}/gramAdarshTakta/getJalsinchanWellCountByccode?cCode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
          setWellsData([
            {
              label: 'जलसिंचन विहीरिंची संख्या',
              inuse: res.data.inUsedWell,
              notInUse: res.data.notInUsedWell,
            },
          ]);
          //  setMahsulMafKshetra(res.data.kamAkariArea)
        }
      },
      (err) => {
        console.log(
          err,
          'Error in /getJalsinchanWellCountByccode?cCode==========================================',
        );
        setIsLoading(false);
      },
    );
  };

  const getBindumalaAndDumalaAreas = async () => {
    const VillageCCode = villageData[0].cCode;
    sendRequest(
      `${URLS.BaseURL}/gramAdarshTakta/getBindumalaAndDumalaAreas?ccode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
          setKhsetrafalArea({
            bindumalaArea: res.data.bindumalaArea,
            dumalaArea: res.data.dumalaArea,
            totalArea: res.data.totalArea,
          });
          //  setMahsulMafKshetra(res.data.kamAkariArea)
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  const getKuranandBagayatAreas = async () => {
    const VillageCCode = villageData[0].cCode;
    sendRequest(
      `${URLS.BaseURL}/gramAdarshTakta/getKuranAndBagayatAreaByccode?cCode=${VillageCCode}`,

      'GET',
      null,
      (res) => {
        if (res.status == 200) {
          setKuranArea(res.data.kuran);
          setBagayatArea(res.data.sumOfBgayatArea);
          console.log(res.data, 'res.data.kuran_bagayat==========================================');
          //  setMahsulMafKshetra(res.data.kamAkariArea)
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
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

// Initialize default values for all crops
const initialCropValues = Object.fromEntries(
  crops.map((_, index) => [
    index,
    {
      jalashay: { hectare: 0 },
      koradahu: { hectare: 0 },
      itar: { hectare: 0 },
      total: { hectare: 0 }
    }
  ]
)
)

// const [cropForm] = Form.useForm();

// Data source for the table
const dataSource = crops.map((crop, index) => ({
  key: index,
  crop
}));

// Table columns configuration
const columns = [
  {
    title: 'पिकाचे नाव',
    key: 'crop',
    render: (_, record) => <b>{record.crop}</b>,
  },
  {
    title: 'जलसिंचित क्षेत्र',
    children: [{
      title: 'हेक्टर.आर',
      render: (_, record) => (
        <Form.Item 
          name={[record.key, 'jalashay', 'hectare']}
          rules={[{ required: true, message: 'आवश्यक' }]}
          initialValue={0}
          style={{ margin: 0 }}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }}
            onChange={() => calculateTotal(record.key)}
          />
        </Form.Item>
      ),
    }],
  },
  {
    title: 'कोरडवाहू क्षेत्र',
    children: [{
      title: 'हेक्टर.आर',
      render: (_, record) => (
        <Form.Item 
          name={[record.key, 'koradahu', 'hectare']}
          rules={[{ required: true, message: 'आवश्यक' }]}
          initialValue={0}
          style={{ margin: 0 }}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }}
            onChange={() => calculateTotal(record.key)}
          />
        </Form.Item>
      ),
    }],
  },
  {
    title: 'इतर क्षेत्र',
    children: [{
      title: 'हेक्टर.आर',
      render: (_, record) => (
        <Form.Item 
          name={[record.key, 'itar', 'hectare']}
          rules={[{ required: true, message: 'आवश्यक' }]}
          initialValue={0}
          style={{ margin: 0 }}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }}
            onChange={() => calculateTotal(record.key)}
          />
        </Form.Item>
      ),
    }],
  },
  {
    title: 'एकूण',
    children: [{
      title: 'हेक्टर.आर',
      render: (_, record) => (
        <Form.Item 
          name={[record.key, 'total', 'hectare']}
          style={{ margin: 0 }}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }}
            readOnly
            className="total-field"
          />
        </Form.Item>
      ),
    }],
  },
];

// Calculate total automatically
const calculateTotal = (key) => {
  const values = cropForm.getFieldsValue();
  const { jalashay = { hectare: 0 }, koradahu = { hectare: 0 }, itar = { hectare: 0 } } = values[key] || {};
  
  const total = Number(jalashay.hectare || 0) + 
                Number(koradahu.hectare || 0) + 
                Number(itar.hectare || 0);
  
  cropForm.setFieldsValue({
    [key]: {
      ...values[key],
      total: { hectare: total }
    }
  });
};

// Initialize form with default values
useEffect(() => {
  cropForm.setFieldsValue(initialCropValues);
}, [cropForm]);
 
  const handleInputforAkrushakChange = (index, field, value) => {
    const newData = [...akrushakData];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    setAkrushakData(newData);
  };
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
        <Input
          placeholder="चालू वर्ष"
          value={akrushakData[index]?.chaluVarsh}
          onChange={(e) => handleInputforAkrushakChange(index, 'chaluVarsh', e.target.value)}
        />
      ),
    },
    {
      title: 'मागील वर्ष',
      dataIndex: 'maghilVarsh',
      key: 'maghilVarsh',
      render: (_, record, index) => (
        <Input
          placeholder="मागील वर्ष"
          value={akrushakData[index]?.maghilVarsh}
          onChange={(e) => handleInputforAkrushakChange(index, 'maghilVarsh', e.target.value)}
        />
      ),
    },
  ];
  const kshetrafalcolumns = [
    {
      title: 'एकूण क्षेत्रफळ',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'बिन-दुमाला क्षेत्रफळ',
      dataIndex: 'bindumalaKshetr',
      key: 'bindumalaKshetr',
      render: () => (
        <Input
          value={khsetrafalArea.bindumalaArea}
          onChange={(e) => handlekshetrafalInputChange('bindumalaArea', e.target.value)}
        />
      ),
    },
    {
      title: 'दुमाला क्षेत्रफळ',
      dataIndex: 'dumalaKshetr',
      key: 'dumalaKshetr',
      render: () => (
        <Input
          value={khsetrafalArea.dumalaArea}
          onChange={(e) => handlekshetrafalInputChange('dumalaArea', e.target.value)}
        />
      ),
    },
    {
      title: 'संपूर्ण क्षेत्रफळ',
      dataIndex: 'totalKshetr',
      key: 'totalKshetr',
      render: () => (
        <Input
          value={khsetrafalArea.totalArea}
          onChange={(e) => handlekshetrafalInputChange('totalArea', e.target.value)}
        />
      ),
    },
  ];
  const handlekshetrafalInputChange = (fieldName, value) => {
    setKhsetrafalArea((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

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
    const initialValues = {
    };
    initialValues.animalWithHorn = 0;
    initialValues.animalWithoutHorn = 0;
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
    { key: 'current', year: 'चालू वर्ष' },
    { key: 'previous', year: 'मागील वर्ष' },
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
        <InputNumber
          min={0}
          value={mahsulMagniAll[record.key]?.niyat}
          onChange={(value) => handleMahsulMaganiValueChange(record.key, 'niyat', value)}
          size="small"
          style={{ width: '200px' }}
        />
      ),
    },
    {
      title: 'संकीर्ण',
      dataIndex: 'sankirn',
      key: 'sankirn',
      render: (_, record) => (
        <InputNumber
          min={0}
          value={mahsulMagniAll[record.key]?.sankirn}
          onChange={(value) => handleMahsulMaganiValueChange(record.key, 'sankirn', value)}
          size="small"
          style={{ width: '200px' }}
        />
      ),
    },
    {
      title: 'एकूण',
      dataIndex: 'total',
      key: 'total',
      render: (_, record) => <span>{mahsulMagniAll[record.key]?.total}</span>,
    },
  ];

  const handleMahsulMaganiValueChange = (yearKey, field, value) => {
    setMahsulMagniAll((prev) => ({
      ...prev,
      [yearKey]: {
        ...prev[yearKey],
        [field]: value || 0,
        total:
          field === 'niyat'
            ? (value || 0) + prev[yearKey].sankirn
            : prev[yearKey].niyat + (value || 0),
      },
    }));
  };

  const handleItaritarmaganiValueChange = (yearKey, field, value) => {
    setItaritarmaganiData((prev) => ({
      ...prev,
      [yearKey]: {
        ...prev[yearKey],
        [field]: value || 0,
      },
    }));
  };

  const itaritarmaganiYearcolumns = [
    {
      title: 'वर्ष',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'शिक्षण कर',
      dataIndex: 'shikshanupkar',
      key: 'shikshanupkar',
      render: (_, record) => (
        <InputNumber
          min={0}
          value={itaritarmaganiData[record.key]?.shikshanupkar}
          onChange={(value) => handleItaritarmaganiValueChange(record.key, 'shikshanupkar', value)}
          size="small"
          style={{ width: '200px' }}
        />
      ),
    },
    {
      title: 'रोजगार हमी कर',
      dataIndex: 'rojgarhami',
      key: 'rojgarhami',
      render: (_, record) => (
        <InputNumber
          min={0}
          value={itaritarmaganiData[record.key]?.rojgarhami}
          onChange={(value) => handleItaritarmaganiValueChange(record.key, 'rojgarhami', value)}
          size="small"
          style={{ width: '200px' }}
        />
      ),
    },
  ];


// Set initial values when data is available
useEffect(() => {
  const initialValues = {};
  waterSypplytype.forEach(type => {
    initialValues[type.key] = {
      wellsNo: 0,
      riverNo: 0,
      tubewellsNo: 0,
      kalvaNo: 0,
      talaavNo: 0
    };
  });
  resoursesForm.setFieldsValue(initialValues);
}, []);




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
      key: 'animalWithHorn',
      render: (_, record, index) => (
        <Form.Item  
          name={`animalWithHorn`} // Changed to direct field name
          rules={[{ required: true, message: 'शिंग असलेली संख्या द्या' }]}
          noStyle
        >
          <InputNumber placeholder="संख्या" style={{ width: '100%' }} />
        </Form.Item>
      ),
    },
    {
      title: 'शिंग नसलेली',
      key: 'animalWithoutHorn',
      render: (_, record, index) => (
        <Form.Item
          name={`animalWithoutHorn`} // Changed to direct field name
          rules={[{ required: true, message: 'शिंग नसलेली संख्या द्या' }]}
          noStyle
        >
          <InputNumber placeholder="संख्या" style={{ width: '100%' }} />
        </Form.Item>
      ),
    },
  ];

  // Simplified data source
  const animaldataSource = [
    {
      key: '1',
      label: 'एकूण प्राणी',
    },
  ];
  const irrigatedwellsSource = [
    {
      key: '1',
      label: '',
    },
  ];
  // const animaldataSource = [
  //   {
  //     key: '1',
  //     label: '',
  //   },
  // ];
  const handleInputWellDataChange = (index, field, value) => {
    const newData = [...wellsData];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    setWellsData(newData);
  };

  const irrigatedwellsColumns = [
    {
      title: 'जलसिंचन विहीरिंची संख्या',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'वापरात असलेल्या विहीरिंची संख्या',
      dataIndex: 'inuse',
      key: 'inuse',
      render: (_, record, index) => (
        <Input
          placeholder="वापरात असलेल्या विहीरिंची संख्या"
          value={wellsData[index]?.inuse}
          onChange={(e) => handleInputWellDataChange(index, 'inuse', e.target.value)}
        />
      ),
    },
    {
      title: 'वापरात नसलेल्या विहीरिंची संख्या',
      dataIndex: 'notInUse',
      key: 'notInUse',
      render: (_, record, index) => (
        <Input
          placeholder="वापरात नसलेल्या विहीरिंची संख्या"
          value={wellsData[index]?.notInUse}
          onChange={(e) => handleInputWellDataChange(index, 'notInUse', e.target.value)}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // First validate all fields
      await form15.validateFields(); 
        await form.validateFields();
      await cropForm.validateFields(); 
await resoursesForm.validateFields();

      const formValues = form15.getFieldsValue(true);
      const Values = form.getFieldsValue(true);
      const animalValues = formAnimal.getFieldsValue(true);
      const jalsinchantypesValues = jalsinchanForm.getFieldsValue(true);
  const resoursesValues = resoursesForm.getFieldsValue(true);
console.log('resoursesValues:', resoursesValues);

// Process water supply resources data
const waterSupplyResources = waterSypplytype.map(type => {
  const typeData = resoursesValues[type.key] || {};
  return {
    supplyType: type.supply,
    wellsNo: typeData.wellsNo || 0,
    riverNo: typeData.riverNo || 0,
    tubewellsNo: typeData.tubewellsNo || 0,
    kalvaNo: typeData.kalvaNo || 0,
    talaavNo: typeData.talaavNo || 0,
  };
});

console.log('Processed water supply resources:', waterSupplyResources);
      const dynamicLandPayload = {};
      landTypes.forEach((item) => {
        dynamicLandPayload[item.payloadKey] = parseFloat(Values[`land_${item.key}`]) || 0;
      });
      




// crop

await cropForm.validateFields();
    
    // Get all form values
    const cropValues = cropForm.getFieldsValue(true);
    console.log('Form values:', formValues);
    
    // Map to required payload structure
    const cropAreas = crops.map((crop, index) => {
      const cropData = cropValues[index] || {};
      return {
        cropName: crop,
        irrigationArea: Number(cropData?.jalashay?.hectare) || 0,
        koradwahuArea: Number(cropData?.koradahu?.hectare) || 0,
        otherArea: Number(cropData?.itar?.hectare) || 0,
        totalCropArea: Number(cropData?.total?.hectare) || 0,
      };
    });
    
    console.log('Processed crop areas:', cropAreas);












      const payload = {
        ...dynamicLandPayload,
        districtCode: parseInt(districtCode),
        talukaCode: parseInt(talukaCode),
        ccode: villageData[0].cCode,
        revenueYear: '2024-2025', // You may want to make this dynamic
        villageTotalArea: parseFloat(formValues.area) || 0,
        villagePopulation: parseInt(population.total) || 0,
        malePopulation: parseInt(population.male), // Add these fields to your form if needed
        femalePopulation: parseInt(population.female),
        otherPopulation: 0,
        KhataCountAbove2023: parseInt(khatedarKshetra.entries[1]?.khatedarSankhya) || 0,
        KhataCountBelow2023: parseInt(khatedarKshetra.entries[0]?.khatedarSankhya) || 0,
        khatedarBhogwataAreaGrater: parseFloat(khatedarKshetra.entries[1].kshetra) || 0,
        khatedarBhogwataAreaLess: parseFloat(khatedarKshetra.entries[0].kshetra) || 0,
        landlessFarmLaborers: parseInt(formValues.landlessworkers) || 0,
        numberOfArtisans: parseInt(formValues.craftsmenno) || 0,
        bindumalaArea: parseFloat(khsetrafalArea.bindumalaArea) || 0,
        dumalaArea: parseFloat(khsetrafalArea.dumalaArea) || 0,
        bindumalaDumalaTotalArea: parseFloat(khsetrafalArea.totalArea) || 0,
        //  kharipArea: parseFloat(formValues.land_kharip) || 0,
        // rabbiArea: parseFloat(formValues.land_rabbi) || 0,
        // kharipRabbiTotalArea: parseFloat(formValues.land_total) || 0,
        akrushik: parseFloat(akrushakArea) || 0,
        govPadikLandArea: parseFloat(formValues.sarkariPaditKshetra) || 0,
        padikLandArea: parseFloat(formValues.padikKshetra) || 0,
        potkharabaArea: parseFloat(potKharabArea) || 0,
        gavthanArea: parseFloat(villageSite) || 0,
        forestLandArea: parseFloat(vanJaminArea) || 0,
        kuranArea: parseFloat(kuranArea) || 0, // Add to form if needed
        plargroundArea: parseFloat(formValues.playgroundArea) || 0,
        mahsulmafOrKamakariLandArea: parseFloat(mahsulMafKshetra) || 0,
        areaUnderEncroachment: parseFloat(formValues.encroachmentArea) || 0,
        agriTotalDemand: mahsulMagniAll.current.total || 0,
        agriTotalNiyatDemand: mahsulMagniAll.current.niyat || 0,
        agriTotalSankirnDemand: mahsulMagniAll.current.sankirn || 0,
        agriTotalDemandPrevious: mahsulMagniAll.previous.total || 0,
        agriTotalNiyatDemandPrevious: mahsulMagniAll.previous.niyat || 0,
        agriTotalSankirnDemandPrevious: mahsulMagniAll.previous.sankirn || 0,
        akrushakTotalDemand: akrushakData[0]?.chaluVarsh || 0,
        akrushakTotalDemandPrevious: akrushakData[0]?.maghilVarsh || 0,
        educationalCessCurrent: itaritarmaganiData.current.shikshanupkar || 0,
        educationalCessPrevious: itaritarmaganiData.previous.shikshanupkar || 0,
        employeeGuaranteeSchemeCurrent: itaritarmaganiData.current.rojgarhami || 0,
        employeeGuaranteeSchemePrevious: itaritarmaganiData.previous.rojgarhami || 0,
        sankirnCurrent: mahsulMagniAll.current.sankirn || 0,
        sankirnPrevious: mahsulMagniAll.previous.sankirn || 0,
        averageRainfall: parseFloat(formValues.rainfall) || 0,
        drinkingWaterResourceCount: parseInt(formValues.waterResoursesnos) || 0,
        irrWellsUsed: parseInt(wellsData[0]?.inuse) || 0,
        irrWellsUnused: parseInt(wellsData[0]?.notInUse) || 0,
         irrKalwaArea: jalsinchantypesValues[1]?.hectare || 0,
  irrBandhArea: parseInt(jalsinchantypesValues[2]?.hectare) || 0,
  irrWellMotaArea: parseInt(jalsinchantypesValues['3a']?.hectare) || 0,
  irrWellOilEnginArea: parseInt(jalsinchantypesValues['3b']?.hectare) || 0,
  irrWellElectricMotarArea: parseInt(jalsinchantypesValues['3c']?.hectare) || 0,
  irrUgharanArea: parseInt(jalsinchantypesValues['3d']?.hectare) || 0,

  irrWellPumpSanchArea: parseInt(jalsinchantypesValues['3e']?.hectare) || 0,
  irrWellArea: parseInt(jalsinchantypesValues[3]?.hectare) || 0,
  irrBudkiArea: parseInt(jalsinchantypesValues[4]?.hectare) || 0,
  otherIrrigation: parseInt(jalsinchantypesValues[5]?.hectare) || 0,

  // count
     irrKalwaCount: jalsinchantypesValues[1]?.number || 0,
  irrBandhCount: parseInt(jalsinchantypesValues[2]?.number) || 0,
  irrWellMotaCount: parseInt(jalsinchantypesValues['3a']?.number) || 0,
  irrWellOilEnginCount: parseInt(jalsinchantypesValues['3b']?.number) || 0,
  irrWellElectricMotarCount: parseInt(jalsinchantypesValues['3c']?.number) || 0,
  irrUgharanCount: parseInt(jalsinchantypesValues['3d']?.number) || 0,
   
  irrWellPumpSanchCount: parseInt(jalsinchantypesValues['3e']?.number) || 0,
  irrWellCount: parseInt(jalsinchantypesValues[3]?.number) || 0,
  irrBudkiCount: parseInt(jalsinchantypesValues[4]?.number) || 0,
  other_irrigation_count: parseInt(jalsinchantypesValues[5]?.number) || 0,

  //   "irrKalwaCount": 3,
  // "irrBandhCount": 2,
  // "irrWellMotaCount": 4,
  // "irrWellOilEnginCount": 5,
  // "irrWellElectricMotarCount": 6,
  // "irrWellPumpSanchCount": 3,
  // "irrWellCount": 18,
  // "irrBudkiCount": 7,
  // "irrUgharanCount": 2,
        bagayatArea: parseFloat(bagayatArea) || 0,
        animalWithHorn: animalValues.animalWithHorn || 0,
        animalWithoutHorn: animalValues.animalWithoutHorn || 0,
        gramPanchayatOrGroupGramGramPanchayat: parseInt(formValues.grampanchayat) || 0,
        judiciary: parseInt(formValues.nyaypanchyayct) || 0,
        panchayatCommittee: parseInt(formValues.panchayatSamiti) || 0,
        nearestPoliceStation: parseInt(formValues.policeStation) || 0,
        postalOffice: parseInt(formValues.postOffice) || 0,
        primarySchool: parseInt(formValues.primarySchool) || 0,
        secondarySchool: parseInt(formValues.secondarySchool) || 0,
        college: parseInt(formValues.colleges) || 0,
        publicHospital: parseInt(formValues.hospitals) || 0,
        transport: parseInt(formValues.transportations) || 0,
        coOrganization: parseInt(formValues.GovOrg) || 0,
        coOperativeFactories: parseInt(formValues.CooperativeFactories) || 0,
        library: 0, // Add to form if needed
        nearestRailwayStation: 0, // Add to form if needed
        railwayStationDistanceFromVillage: formValues.NearestRailwayStationandDistance, // Add to form if needed
        chawadi: 0, // Add to form if needed
        rashanShopCount: parseInt(formValues.rashanshop) || 0,
        sarpanchName: formValues.sarpanch || '',
        policePatilName: formValues.PolicePatil || '',
        kotwalCount: parseInt(formValues.kotvalCount) || 0,
        kotwalName: formValues.kotval || '',
        cropAreas: cropAreas,
        total_eseva_kendra: parseInt(formValues.eSevakendraNos) || 0,
//         1
// : 
// kalvaNo
// : 
// 5
// riverNo
// : 
// 5
// talaavNo
// : 
// 5
// tubewellsNo
// : 
// 5
// wellsNo
// : 
// 5
         panipuravathaDrinkingWellCount: resoursesValues[1].wellsNo,
    panipuravathaDrinkingRiverCount: resoursesValues[1].riverNo,
    panipuravathaDrinkingVindhanVihirCount: resoursesValues[1].tubewellsNo,
    panipuravathaDrinkingKalwaCount: resoursesValues[1].kalvaNo,
    panipuravathaDrinkingTalawCount: resoursesValues[1].talaavNo,
    panipuravathaAgriWellCount: resoursesValues[2].wellsNo,
    panipuravathaAgriRiverCount: resoursesValues[2].riverNo,
    panipuravathaAgriVindhanVihirCount: resoursesValues[2].tubewellsNo,
    panipuravathaAgriKalwaCount: resoursesValues[2].kalvaNo,
    panipuravathaAgriTalawCount: resoursesValues[2].talaavNo,
      };

      // Submit to API
      const response = await sendRequest(
        `${URLS.BaseURL}/gramAdarshTakta/saveGramAdarshTaktaData`,
        'POST',
        payload,
        (res) => {
          message.success('Form submitted successfully!');
          setIsLoading(false);
          
          form15.resetFields();
          resoursesForm.resetFields();
          jalsinchanForm.resetFields();
          form.resetFields();
          formAnimal.resetFields();
           history.push({
      pathname: `/reports/village-form-1`,
    });
        },
        (err) => {
          message.error('Error submitting form');
          setIsLoading(false);
        },
      );
    } catch (error) {
      console.error('Validation or submission error:', error);
      setIsLoading(false);

      // Only show validation error message if it's a validation error
      if (error.errorFields) {
        message.error('कृपया सर्व फील्ड्स भरा.');
      } else {
        message.error('Error submitting form');
      }
    }
  };

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
                <Input
                  maxLength={12}
                  value={mahsulMafKshetra}
                  onChange={(e) => setMahsulMafKshetra(e.target.value)}
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
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
                label={<FormattedMessage id="gramAdarshTakta.pastureArea" />}
              >
                <Input
                  maxLength={12}
                  value={kuranArea}
                  onChange={(e) => setKuranArea(e.target.value)}
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
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
                <Input
                  maxLength={12}
                  value={akrushakArea}
                  onChange={(e) => setAkrushakArea(e.target.value)}
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
                name={'padikKshetra'}
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
                  { required: true, message: 'Area of ​​irrigated land is Required' },
                  { max: 12, message: 'Area of ​​irrigated land should be upto 12 Characters' },
                ]}
                label={<FormattedMessage id="gramAdarshTakta.bagayatJaminKshetra" />}
              >
                <Input
                  maxLength={12}
                  value={bagayatArea}
                  onChange={(e) => setBagayatArea(e.target.value)}
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* kshetrafal */}
          <Form
            form={form}
            name="akrushak_jamin_mahsul"
            autoComplete="off"
            style={{ marginBottom: 20 }}
          >
            <Table
              columns={kshetrafalcolumns}
              dataSource={akrushakdataSource}
              pagination={false}
              bordered
              size="middle"
            />
          </Form>
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
                        onChange={(e) =>
                          handleInputChange(index, 'khatedarSankhya', e.target.value)
                        }
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

            {landTypes.map((item) => (
              <Row gutter={16} key={item.key} style={{ marginBottom: 8 }}>
                <Col span={8}>
                  <Typography.Text strong>{item.label}</Typography.Text>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={`land_${item.key}`}
                    rules={[
                      {
                        required: true,
                        message: `${item.label} क्षेत्र आवश्यक आहे`,
                      },
                    ]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="हेक्टर" />
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
          <Form form={jalsinchanForm} name="water_resources_table" autoComplete="off">
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
          {/* <h4> लोकसंख्या </h4> */}

          <Row gutter={[16, 16]}>
            {/* Male Population */}
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                name="malePopulation"
                label="पुरुषांची लोकसंख्या"
                rules={[
                  { required: true, message: 'पुरुषांची लोकसंख्या आवश्यक आहे' },
                  { max: 12, message: 'कमाल १२ अंक' },
                ]}
              >
                <Input
                  maxLength={12}
                  value={population.male}
                  onChange={(e) => setPopulation({ ...population, male: e.target.value })}
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
              </Form.Item>
            </Col>

            {/* Female Population */}
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item
                name="femalePopulation"
                label="स्त्रियांची लोकसंख्या"
                rules={[
                  { required: true, message: 'स्त्रियांची लोकसंख्या आवश्यक आहे' },
                  { max: 12, message: 'कमाल १२ अंक' },
                ]}
              >
                <Input
                  maxLength={12}
                  value={population.female}
                  onChange={(e) => setPopulation({ ...population, female: e.target.value })}
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
              </Form.Item>
            </Col>

            {/* Total Population */}
            <Col xl={4} lg={4} md={4} sm={8} xs={8}>
              <Form.Item name="totalPopulation" label="एकूण लोकसंख्या">
                <Input
                  maxLength={12}
                  value={population.total}
                  readOnly
                  style={{ background: '#f5f5f5' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
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

          <Form form={formAnimal} name="animal_count_form" autoComplete="off">
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
            form={resoursesForm}
            name="water_supply_resources"
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
       <Form
  form={cropForm}
  name="land_crop_table"
  preserve={true}
  initialValues={initialCropValues}
  onFinish={handleSubmit}
>
  <Table
    dataSource={dataSource}
    columns={columns}
    pagination={false}
    bordered
    rowKey="key"
    style={{ marginBottom: 24 }}
  />
 
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
                name={'sarpanch'}
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
                <Select disabled placeholder={villageData[0].villageName}></Select>
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
                        handleSubmit();
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
