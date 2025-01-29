import { Alert, Button, Card, Col, Form, Input, message, Modal, Row, Select, Spin } from 'antd';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'umi';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import axios from 'axios';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function Dyslr_akarband_bharnyasathi_kamkajsurukele1() {
  const { districtName, talukaName, roles, servarthId } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();
  const [districtCodee, setDistrictCode] = useState();
  const [districts, setDistricts] = useState();
  const [talukaCode, setTalukaCode] = useState();
  const [taluka, setTaluka] = useState();
  const [loading, setLoading] = useState([]);
  const location = useLocation();
  const [talukaCount, setTalukaCount] = useState();
  const [modal1Open, setModal1Open] = useState(false); // Modal state

  useEffect(() => {
    if (location?.state?.districtCode) {
      handleOnChangeDistrict();
    }
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: '/dashboard/analysis_copy' });
  };

  const showModel = () => {
    setModal1Open(true); // Set modal visibility to true
  };

  const handleOnChangeDistrict = async (e) => {
    let revenueYear = location?.state?.selectedYear;

    await axios
      .post(
        revenueYear == '2024-2025'
          ? `${URLS.AuthURL}/getVasooliCompletedVillageCount?districtCode=${location?.state?.districtCode}&talukaCode=${location?.state?.talukaCode}`
          : `${URLS.AuthURL}/getVasooliCompletedVillageCountPre?districtCode=${location?.state?.districtCode}&talukaCode=${location?.state?.talukaCode}`,
      )
      .then((res) => {
        try {
          setTableData(
            res.data.map((row, i) => ({
              srNo: i + 1,
              districtNameMarathi: row.districtNameMarathi,
              talukaMameMarathi: row.talukaMameMarathi,
              lgdVillageMame: row.lgdVillageMame,
            })),
          );
          setTalukaCount(res.data[0].talukaCount);
        } catch (err) {
          console.log(err, '----Error in getVasooliCompletedVillageCount2--');
        }
      });
  };

  return (
    <div>
      <Row>
        <Col span={8}></Col>
        <Col span={8}></Col>
        <Col span={8}>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="formLanguage.form.backhomeButton" />
          </Button>
        </Col>
      </Row>

      {/* Pass the showModel function as a prop to ComponentToPrint */}
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        districtName={location?.state?.district}
        totalPhase1Login={location?.state?.totalPhase1Login}
        talukaCount={talukaCount}
        showModel={showModel} // Prop for triggering modal
      />

      {/* Modal Component */}
      <Modal
        title="20px to Top"
        style={{
          top: 20,
        }}
        open={modal1Open}
        onOk={() => setModal1Open(false)} // Close modal
        onCancel={() => setModal1Open(false)} // Close modal
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
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
                  <th colSpan={24}>
                    <h3 style={{ color: 'red' }}>
                      <b>गाव नामुना ७ब मध्ये दाखल केलेले अर्ज</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="20">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>{this.props.districtName}</b>
                      </pre>
                    </h4>
                  </th>
                </tr>
                <tr>
                  <th>Sr No</th>
                  <th>अर्ज क्रमांक</th>
                  <th>अर्जदाराचे नाव</th>
                  <th>मंडळाचे नाव</th>
                  <th>साजा नाव</th>
                  <th>गावाचे नाव</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr key={i}>
                      <td>{r.srNo}</td>
                      <td>{r.districtNameMarathi}</td>
                      <td>{r.talukaMameMarathi}</td>
                      <td>{r.lgdVillageMame}</td>
                      <td>{r.lgdVillageMame}</td>
                      <td>{r.lgdVillageMame}</td>
                      <td>
                        <Button onClick={this.props.showModel} type="primary">
                          {' '}
                          {/* Trigger showModel on click */}
                          पहा
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Dyslr_akarband_bharnyasathi_kamkajsurukele1;
