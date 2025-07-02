import React, { useEffect, useRef, useState } from 'react';
import styles from './report.module.css';

import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, message, Row, Select, Form, Tooltip } from 'antd';
import Axios from 'axios';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import { useReactToPrint } from 'react-to-print';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function GramAdarshTakta() {
  const { sendRequest } = useAxios();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };
  const { districtName, talukaName, districtCode, talukaCode,villageData } = useModel('details');
  const [textVillage, setTextVillage] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [villageForm4Abstract, setVillageForm4Abstract] = useState();
  const [revenueYear, setRevenueYear] = useState('2024-25');
  const [sthanikUpkar, setSthanikUpkar] = useState();
  const [jaminMahsul, setJaminMahsul] = useState();
  const [ekunJaminMahsul, setEkunJaminMahsul] = useState();
  const [sthanikUpkarAslela, setSthanikUpkarAslela] = useState();
  const [sthanikUpkarNaslela, setSthanikUpkarNaslela] = useState();
  const [vasuli, setVasuli] = useState();
  const [shillakh, setShillakh] = useState();
  const componentRef = useRef();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();
  const [data, setData] = useState({});

  const Maindata = {
    year: '2024-25',
    kshetra: 12345.12,
    population: 123456,
    bhumihinShetmajur: 1234,
    vadaList: [
      {
        name: 'वाडा 1',
        population: 1234,
      },
      {
        name: 'वाडा 1',
        population: 1234,
      },
      {
        name: 'वाडा 1',
        population: 1234,
      },
    ],
    lessThan2023No: 1234,
    lessThan2023Area: 1232,
    GreaterThan2023No: 1234,
    GreaterThan2023Area: 1232,
    craftaman: 122,
    bindumalaKhestra: 123,
    dumalaKshetra: 123,
    TotalKshetrfal: 7878,
    akrushakLand: 8588,
    sarkariPaditLand: 2323,
    padikLand: 212,
    potkharabLand: 2212,
    gavthanacheKshetra: 11112,
    vanjaminKshetra: 1258582,
    kurancheKshetra: 1212,
    playGroudArea:9859,
    kamakariKshetra: 2585,
    atikramanakhalilKshetra: 45856.20,
    
  };

  useEffect(() => {
    // console.log(villageData[0].cCode, "villageData[0].cCode");
    setCodeVillage(villageData[0].cCode)
    ;
    getDataForForm4()
    getRevenueYear();
  }, []);

  const onYearChange = (value, event) => {
    setRevenueYear(value);
    setVillageForm4Abstract();
    setSthanikUpkar();
    setJaminMahsul();
    setSthanikUpkarAslela();
    setSthanikUpkarNaslela();
    setEkunJaminMahsul();
    setVasuli();
    setShillakh();
  };

  const getRevenueYear = async () => {
    sendRequest(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, 'GET', null, (res) => {
      setRevenueYearForVillage(
        res.data.revenueYearData.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        })),
      );
      // message.success('Records Fetched!!');
    });
  };

  const getDataForForm4 = async () => {
    sendRequest(
      `${URLS.BaseURL}/gramAdarshTakta/getAllGramAdarshTakaDataBycCode/${villageData[0].cCode}`,
      'GET',
      null,
      (r) => {
        setData(r.data[0])
      console.log(r.data[0],"dataaaaaaaaaaaaaaaaaaaaaa")

        
        message.success('Records Fetched!!');
        console.log(data,"check dataaaaaaaaaaaaaaaaaaaaaaa")
      },
    );
  };

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="gramAdarshTakta.heading" />
        </h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="formLanguage.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="formLanguage.form.backhomeButton" />
          </Button>
        </div>
        <Row style={{ marginBottom: 10, padding: 10 }}>
          <Col span={19}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={5} lg={5} md={24} sm={24} xs={24}>
            <Form.Item
              style={{ marginTop: 10 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
                // style={{ width: 200, marginRight: '15px' }}
                options={revenueYearForVillage}
                value={revenueYear}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
                // disabled
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <Button
          onClick={() => {
            if (textVillage && revenueYear) {
            } else if (textVillage == null) {
              message.info('Please Select Village');
            } else if (revenueYear == null) {
              message.info('Please Select Revenue Year');
            }
          }}
          type="primary"
        >
          <FormattedMessage id="formLanguage.form.getData" />
        </Button>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={villageForm4Abstract}
        sthanikUpkar={sthanikUpkar}
        ekunJaminMahsul={ekunJaminMahsul}
        jaminMahsul={jaminMahsul}
        sthanikUpkarAslela={sthanikUpkarAslela}
        sthanikUpkarNaslela={sthanikUpkarNaslela}
        vasuli={vasuli}
        shillakh={shillakh}
        data={Maindata}
      />
    </div>
  );
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div style={{ padding: '13px' }}>
        <div className="report">
          <Card>
            <ReactHtmlTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="table-to-xls"
              filename="Reportxls"
              sheet="tablexls"
              buttonText="Download as XLS"
            />

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>
                    <h2 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="gramAdarshTakta.heading" />
                      </b>
                    </h2>
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>
                          गाव-{this.props.village} तालुका-{this.props.taluka} जिल्हा-
                          {this.props.district}
                        </b>
                      </pre>
                    </h4>
                  </th>
                </tr>
                <tr>
                  <td>Hiii</td>
                  {/*   <td>
                    <b>
                      <FormattedMessage id="form1abstract.area" />
                      <br />
                      (हे.आर.चौमी)
                    </b>
                  </td> */}
                  <td>
                    <b>
                      <FormattedMessage id="form1abstract.assessment" />
                      <br />
                      (रु.पैसे)
                    </b>
                  </td>
                  {/* <td>
                    <b>
                      <FormattedMessage id="form1abstract.remarks" />
                    </b>
                  </td> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>
                      <span>1. वर्ष</span>
                    </b>
                  </td>
                  <td>{this.props.data.year}</td>
                  {/* <td>{this.props.tenureAssessment}</td> */}
                  {/* <td></td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>2. क्षेत्र (चौ. कि. मी. मध्ये)</span>
                    </b>
                  </td>
                  <td>{this.props.data.kshetra}</td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>3. लोकसंख्या -</span>
                    </b>

                    <br />
                  </td>
                  <td>{this.props.data.population}</td>
                  {/* <td>{this.props.tenureAssessment}</td> */}
                  {/* <td></td> */}
                </tr>
                <tr>
  <td colSpan={4} style={{fontWeight:'bold'}} className="fw-bold text-center">
    4. खातेदारांची संख्या व त्यांच्या भोगवट्याखालील जमिनीचे क्षेत्र..
  </td>
</tr>

{/* Sub-headers */}
<tr className="text-center fw-semibold">
  <td></td>
  <td>संख्या / क्षेत्र </td>
 
</tr>

{/* Row for below 223 */}
<tr>
  <td>2.023 हेक्टर पेक्षा जास्त </td>
  <td>संख्या {this.props.data.GreaterThan2023No}<br/>क्षेत्र  {this.props.data.GreaterThan2023Area}</td>
</tr>

{/* Row for above 223 */}
<tr>
  <td>2.023 हेक्टर पेक्षा कमी </td>
  <td>संख्या {this.props.data.lessThan2023No}<br/>क्षेत्र  {this.props.data.lessThan2023Area}</td>
</tr>

                
                <tr>
                  <td>
                    <b>
                      <span>5. भूमिहीन शेत मजुरांची संख्या</span>
                    </b>
                  </td>
                  <td>{this.props.data.bhumihinShetmajur}</td>
                  {/* <td>{this.props.tenure4Assessment}</td>
                  <td>{}</td> */}
                </tr>
               <tr>
  <td>
    <b>
      <span>6. कारागिरांची संख्या</span>
    </b>
  </td>
  <td>{this.props.data.craftaman}</td>
</tr>

<tr>
  <td>
    <b>7. एकूण क्षेत्रफळ</b>
  </td>
  <td>
    <table className="table table-bordered mt-2 w-100">
      <thead></thead>
      <tbody>
        <tr> 
          <td style={{fontWeight:'bold'}} >बिंदुमाला - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
        <tr>
          <td style={{fontWeight:'bold'}}>दुमाला - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
        <tr>
          <td style={{fontWeight:'bold'}}>एकूण - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
<tr>
  <td>
    <b>8. लागवडयोग्य जमिनीचे क्षेत्र
</b>
  </td>
  <td>
    <table className="table table-bordered mt-2 w-100">
      <thead></thead>
      <tbody>
        <tr> 
          <td style={{fontWeight:'bold'}} >खरीप  - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
        <tr>
          <td style={{fontWeight:'bold'}}>रब्बी  - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
        <tr>
          <td style={{fontWeight:'bold'}}>एकूण - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>

                <tr>
                  <td>
                    <b>
                      <span>9. अकृषिक वापराखालील जमिनीचे क्षेत्र</span>
                    </b>
                  </td>

                  <td>{this.props.data.akrushakLand}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>10. सरकारी पडीत जमिनीचे क्षेत्र </span>
                    </b>
                  </td>

                  <td>{this.props.data.sarkariPaditLand}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>11. पडीक जमिनीचे क्षेत्र</span>
                    </b>
                  </td>

                  <td>{this.props.data.padikLand}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>12. पोट खराब जमिनीचे क्षेत्र</span>
                    </b>
                  </td>

                  <td>{this.props.data.potkharabLand}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>13. गावठाणाचे क्षेत्र</span>
                    </b>
                  </td>

                  <td>{this.props.data.gavthanacheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>14. वन जमिनीचे क्षेत्र</span>
                    </b>
                  </td>

                  <td>{this.props.data.vanjaminKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>15. कुरणाचे क्षेत्र</span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>16. क्रीडांगणाखालील क्षेत्र </span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>17. महसुलमाफ किंवा विशेषरित्या कमआकारी जमिनीचे क्षेत्र</span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>18.<FormattedMessage id="gramAdarshTakta.encroachment" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
     
                <tr>
                  <td>
                    <b>
                      <span>19.<FormattedMessage id="gramAdarshTakta.pramukhPike" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <span>20.<FormattedMessage id="gramAdarshTakta.TotalJaminMahsul" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                           <tr>
                  <td>
                    <b>
                      <span>21.<FormattedMessage id="gramAdarshTakta.akrushakAkarniMagnichi" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                           <tr>
                  <td>
                    <b>
                      <span>22.<FormattedMessage id="gramAdarshTakta.etarMahsulMagani" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                           <tr>
                  <td>
                    <b>
                      <span>23.<FormattedMessage id="gramAdarshTakta.rainfall" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                           <tr>
                  <td>
                    <b>
                      <span>24.पाणी पुरवठ्याची साधने (Water Supply Resources) </span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
  <td>
    <b>25. <FormattedMessage id="gramAdarshTakta.irrigationWells" />
</b>
  </td>
  <td>
    <table className="table table-bordered mt-2 w-100">
      <thead></thead>
      <tbody>
        <tr> 
          <td style={{fontWeight:'bold'}} >वापरात असलेल्या विहीरिंची संख्या   - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
        <tr>
          <td style={{fontWeight:'bold'}}>वापरात नसलेल्या विहीरिंची संख्या   - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
   
      </tbody>
    </table>
  </td>
</tr>

    <tr>
                  <td>
                    <b>
                      <span>26.<FormattedMessage id="gramAdarshTakta.bagayatJaminKshetra" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
    <tr>
                  <td>
                    <b>
                      <span>27.<FormattedMessage id="gramAdarshTakta.IrrigationequipmentAndArea" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>

 <tr>
  <td>
    <b>28. <FormattedMessage id="gramAdarshTakta.domesticAnimal" />
</b>
  </td>
  <td>
    <table className="table table-bordered mt-2 w-100">
      <thead></thead>
      <tbody>
        <tr> 
          <td style={{fontWeight:'bold'}} >शिंग असलेली  - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
        <tr>
          <td style={{fontWeight:'bold'}}>शिंग नसलेली   - </td>
          <td>{this.props.data.craftaman}</td>
        </tr>
   
      </tbody>
    </table>
  </td>
</tr>

    <tr>
  <td colSpan={4} style={{fontWeight:'bold'}} className="fw-bold text-center">
    29.सार्वजनिक आणि सहकारी संस्था 
  </td>
</tr>

   <tr>
                  <td>
                    <b>
                      <span>29-(A) . <FormattedMessage id="gramAdarshTakta.grampanchayat" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (B) . <FormattedMessage id="gramAdarshTakta.panchayatSamiti" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (C) . <FormattedMessage id="gramAdarshTakta.nyaypanchyayct" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (D) . <FormattedMessage id="gramAdarshTakta.policeStation" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (E) . <FormattedMessage id="gramAdarshTakta.postOffice" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (F) . <FormattedMessage id="gramAdarshTakta.primarySchool" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (G) . <FormattedMessage id="gramAdarshTakta.secondarySchool" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (H) . <FormattedMessage id="gramAdarshTakta.madhyamikSchool" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (H) . <FormattedMessage id="gramAdarshTakta.college" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (I) . <FormattedMessage id="gramAdarshTakta.hospitals" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (J) . <FormattedMessage id="gramAdarshTakta.transportations" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (K) . <FormattedMessage id="gramAdarshTakta.GovOrg" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (L) . <FormattedMessage id="gramAdarshTakta.CooperativeFactories" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (M) . <FormattedMessage id="gramAdarshTakta.NearestRailwayStationandDistance" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
                  <td>
                    <b>
                      <span>  (N) . <FormattedMessage id="gramAdarshTakta.eSevakendra" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
                 <tr><td>
                   
                  </td></tr>
   <tr>
   
                  <td>
                    <b>
                      <span> 30 . <FormattedMessage id="gramAdarshTakta.rashanshop" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
   
                  <td>
                    <b>
                      <span> 31 . <FormattedMessage id="gramAdarshTakta.Sarpanch" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
   
                  <td>
                    <b>
                      <span> 31 . <FormattedMessage id="gramAdarshTakta.PolicePatil" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
   <tr>
   
                  <td>
                    <b>
                      <span> 31 . <FormattedMessage id="gramAdarshTakta.kotval" /></span>
                    </b>
                  </td>

                  <td>{this.props.data.kurancheKshetra}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>

              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default GramAdarshTakta;
