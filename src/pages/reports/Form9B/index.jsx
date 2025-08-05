import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { Button, Card, Col, message, Row, Spin, Select, Form } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import { useModel } from 'umi';
import styles from './report.module.css';
import { FormattedMessage } from 'umi';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function Report9B() {
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
    //history.push({ pathname: '/homepageThalati' });
  };
  const history = useHistory();
  const [textVillage, setTextVillage] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [revenueYear, setRevenueYear] = useState('2025-26');
  const [isNirank, setIsNirank] = useState(false);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();
  const { sendRequest } = useAxios();

  const onYearChange = (value, event) => {
    setRevenueYear(value);
  };

  const getRevenueYear = async () => {
    sendRequest(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, 'GET', null, (res) => {
      // var data = res.data?.revenueYearData?.slice(0, 2);
      var data = res.data?.revenueYearData;
      // console.log(data, '-------dataeeeeeeeee');
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
  const getTableData = async () => {
    setLoading(true);

    sendRequest(
      revenueYear == '2023-24'
        ? `${URLS.BaseURL}/reports/getForm9BReportPre?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&revenueYear=${revenueYear}`
        : `${URLS.BaseURL}/reports/getForm9BReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.map((r, i) => ({
            srNo: i + 1,
            id: r.id,

            khataOwnerName: r.khataOwnerName,
            receiptDate: r.receiptDate,
            area: r.area,
            receiptNo: r.receiptNo,
            modeOfPayment: r.modeOfPayment,
            netAmount: r.netAmount,
          })),
        );
        setLoading(false);
      },
      (err) => {
        message.error('Reports Details Not Found');

        setLoading(false);
      },
    );
  };

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="formLanguage.form.name9b" />
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
          <Col span={16}>
            <VillageSelector
              // pageType="withYear"
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={(setVillage, setTableData)}
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
          <Col xl={2} lg={2} md={24} sm={24} xs={24}>
            <Button
              onClick={() => {
                if (textVillage && revenueYear) {
                  getTableData();
                } else if (textVillage == null) {
                  message.info('Please Select Village');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year');
                }
              }}
              type="primary"
              style={{ marginTop: 10, paddingLeft: 10, marginLeft: 85 }}
            >
              <FormattedMessage id="formLanguage.form.getData" />
            </Button>
          </Col>
        </Row>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '630px', marginTop: '20px' }} />
          ) : null}
        </Col>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
      />
    </div>
  );
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
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
              <table id="table-to-xls" bordered scroll={{ x: 100 }} className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan="11">
                      <h3 style={{ color: 'red' }}>
                        <b>
                          तलाठयाने ठेवावयची गाव नमुना नऊ ची पावती पुस्तके व इतर पावती पुस्तके
                          यांच्या संग्रहाची नोंदवही
                        </b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="11">
                      <h3 style={{ color: 'red' }}>
                        <b>
                          <FormattedMessage id="formLanguage.form.name9b" />
                        </b>
                      </h3>
                    </th>
                  </tr>

                  <tr>
                    <th colSpan="11">
                      <h3 style={{ color: 'red' }}>
                        <pre>
                          <b>
                            {<FormattedMessage id="villageForm.form.village" />}-
                            {this.props.village} {<FormattedMessage id="villageForm.form.taluka" />}
                            -{this.props.taluka}{' '}
                            {<FormattedMessage id="villageForm.form.distrcit" />}-{' '}
                            {this.props.district}
                          </b>
                        </pre>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <b>
                        <FormattedMessage id="formLanguage.form.serialNo" />
                      </b>
                    </th>
                    <th>
                      <b>
                        <FormattedMessage id="oneTimeEntry.form.khataOwner" />
                      </b>
                    </th>
                    <th>
                      <b>
                        <FormattedMessage id="challanDetails.table.receiptDate" />
                      </b>
                    </th>
                    <th>
                      <b>
                        <FormattedMessage id="demandGeneration.table.area" />
                      </b>
                    </th>

                    <th>
                      <b>
                        <FormattedMessage id="challanDetails.table.receiptNo" />
                      </b>
                    </th>

                    <th>
                      <b>
                        <FormattedMessage id="challanDetails.table.paymentMode" />
                      </b>
                    </th>

                    <th>
                      <b>
                        <FormattedMessage id="challanDetails.table.amount" />
                      </b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                  </tr>
                  {this.props.dataToMap &&
                    this.props.dataToMap.map((r, i) => (
                      <tr>
                        <td>{r.srNo}</td>
                        <td>{r.khataOwnerName}</td>
                        <td>{r.receiptDate}</td>
                        <td>{r.area}</td>

                        <td>{r.receiptNo}</td>

                        <td>{r.modeOfPayment}</td>

                        <td>{r.netAmount}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </Col>
    );
  }
}
export default Report9B;
