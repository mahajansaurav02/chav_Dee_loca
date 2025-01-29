import {
  Alert,
  Button,
  Image,
  Card,
  Col,
  Form,
  Input,
  Modal,
  message,
  Row,
  Select,
  Spin,
  Dropdown,
  Space,
} from 'antd';
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
import { DownOutlined } from '@ant-design/icons';
//import Modal from '@material-ui/core/Modal';

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

  const location = useLocation();
  const [talukaCount, setTalukaCount] = useState();
  const [modal1Open, setModal1Open] = useState(false); // Modal state
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location?.state?.districtCode) {
      handleOnChangeDistrict();
    }
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: '/dashboard/analysis_copy' });
  };

  // const showModel = () => {
  //   alert('000');
  //   setModal1Open(true); // Set modal visibility to true
  // };

  const showModal = (e) => {
    //alert('ShowModeal ');
    console.log(e, '--------------model');

    setOpen(true);
  };
  const handleOpen = () => {
    alert('ShowModeal ');
    setOpen(true);
  };
  const handleOk = (e) => {
    console.log(e, '----------------ok');
    // setLoading(true);
    setOpen(false);

    // setTimeout(() => {
    //   setLoading(false);
    //   setOpen(false);
    // }, 3000);
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
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

  const items = [
    {
      value: '0',
      label: 'Remark1',
    },
    {
      value: '1',
      label: 'Remark2',
    },
    {
      value: '2',
      label: 'Remark3',
    },
    {
      value: '3',
      label: 'Remark4',
      disabled: true,
    },
  ];

  const handleOnChangeRemark = (e) => {
    // alert('00');
    console.log(e, '-----------remark');
  };

  return (
    <>
      <Modal
        title="Details"
        visible={open}
        okButtonProps={{
          disabled: false,
        }}
        cancelButtonProps={{
          disabled: false,
        }}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            दाखल करून घेण्यात येत आहे.
          </Button>,
        ]}
      >
        <p>
          Document1
          <Button type="primary" onClick={() => setVisible(true)}>
            show Document1 preview
          </Button>{' '}
          <Select
            defaultValue="lucy"
            style={{
              width: 120,
            }}
            onChange={handleOnChangeRemark}
            options={items}
          />
          <br />
          <br />
          Document2
          <Button type="primary" onClick={() => setVisible(true)}>
            show Document2 preview
          </Button>
          <Select
            defaultValue="lucy"
            style={{
              width: 120,
            }}
            onChange={handleOnChangeRemark}
            options={items}
          />
        </p>

        <Image
          width={200}
          style={{
            display: 'none',
          }}
          // src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
          src="data:image/png;base64,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"
          preview={{
            visible,
            // scaleStep,
            // src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // src: 'data:image/png;base64,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',
            onVisibleChange: (value) => {
              setVisible(value);
            },
          }}
        />
      </Modal>
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
                  {/* <tr>
                    <th colSpan="20">
                      <h4 style={{ color: 'red' }}>
                        <pre>
                          <b>{districtName}</b>
                        </pre>
                      </h4>
                    </th>
                  </tr> */}
                  <tr>
                    <th>Sr No</th>
                    <th>अर्ज क्रमांक</th>
                    <th>अर्जदाराचे नाव</th>
                    <th>मंडळाचे नाव</th>
                    <th>साजा नाव</th>
                    <th>गावाचे नाव</th>
                    <th>Action</th>
                  </tr>
                  <tr>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                    <th>7</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData &&
                    tableData.map((r, i) => (
                      <tr key={i}>
                        <td>{r.srNo}</td>
                        <td>{r.districtNameMarathi}</td>
                        <td>{r.talukaMameMarathi}</td>
                        <td>{r.lgdVillageMame}</td>
                        <td>{r.lgdVillageMame}</td>
                        <td>{r.lgdVillageMame}</td>
                        <td>
                          <Button type="primary" onClick={(e) => showModal(e)}>
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
      </div>
    </>
  );
}

export default Dyslr_akarband_bharnyasathi_kamkajsurukele1;
