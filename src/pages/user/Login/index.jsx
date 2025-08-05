import { ArrowRightOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { Alert, Button, Col, Form, Input, message, Modal, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import { login } from '@/services/ant-design-pro/api';
import mainImage from './../../../../public/maha_map.svg';
import FirstAugustTitle from './../../../../public/eChawadi_1_August.webp';
import URLS from '@/URLs/urls';
import './index.css';
import YouTube from 'react-youtube';
import { Avatar, Card, CardContent, CardHeader, Grid } from '@mui/material';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import LiveHelpTwoToneIcon from '@mui/icons-material/LiveHelpTwoTone';
import { AES, enc } from 'crypto-js';
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';
// import one from '../../../../public/one.pdf';
// import two from './../../../../public/two.pdf';

// const LoginMessage = ({ content }) => (
//   <Alert
//     style={{
//       marginBottom: 24,
//     }}
//     message={content}
//     type="error"
//     showIcon
//   />
// );
var login_attempts = 3;
const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  // const [userValues, setUserValues] = useState();
  const { authLogin } = useModel('Auth');
  const { details } = useModel('details');
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [dyslrLogin, setDyslrLogin] = useState(false);
  const [modalHelp, setModalHelp] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [useDetails, setuseDetails] = useState(null);
  const [aToken, setAToken] = useState('');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const key = 'wXhN%8T@hS$Z@Q';
  // const plainText = password;
  // console.log('keykey', key);
  const CryptoJS = require('crypto-js');
  const encrypted = CryptoJS.AES.encrypt(password, key);
  // console.log('encrypted', encrypted.ciphertext.toString());
  // const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
  // console.log('decrypted', decrypted);
  const reload = () => {
    var myArray = [{}];
    localStorage.setItem('villageData1', JSON.stringify(myArray));
    var myRevenue = [{}];
    localStorage.setItem('revenueYear1', JSON.stringify(myRevenue));
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

 const handleSubmit = async (values) => {
  let user_captcha_value = document.getElementById('user_captcha_input').value;
  let loginStatus;

  try {
    enterLoading(2); // Start loading
    
    const article = {
      servarthId: username,
      password: encrypted.toString(),
    };

    const res = await Axios.post(
      `${URLS.AuthURL}/authenticateUserByUsernameAndPassword`, 
      article
    );

    if (res.status === 200 && validateCaptcha(user_captcha_value) ){
      loginStatus = 'ok';
      
      // Process successful login
      details(
        res.data.challanHeads,
        res.data.servarthId,
        res.data.districtCode,
        res.data.districtName,
        res.data.talukaCode,
        res.data.talukaName,
        res.data.marathiName,
        res.data.desg,
        res.data.echDbName,
        res.data.echSchemaName,
        res.data.mhrDbName,
        res.data.mhrSchemaName,
        res.data.echHost,
        res.data.mhrHost,
        res.data.villages,
        res.data.revenueYear,
        res.data.roles,
        res.data.niranks,
      );

      const userDetails = {
        challanHeads: res.data.challanHeads,
        servarthId: res.data.servarthId,
        districtCode: res.data.districtCode,
        districtName: res.data.districtName,
        talukaCode: res.data.talukaCode,
        talukaName: res.data.talukaName,
        marathiName: res.data.marathiName,
        desg: res.data.desg,
        echDbName: res.data.echDbName,
        echSchemaName: res.data.echSchemaName,
        mhrDbName: res.data.mhrDbName,
        mhrSchemaName: res.data.mhrSchemaName,
        echHost: res.data.echHost,
        mhrHost: res.data.mhrHost,
        villages: res.data.villages,
        revenueYear: res.data.revenueYear,
        roles: res.data.roles,
        niranks: res.data.niranks,
      };

      setuseDetails(userDetails);
      setAToken(res.data.token);
      localStorage.setItem('redirectUserDetails', JSON.stringify(userDetails));
      authLogin(res.data.token, 3600000);

      // Login message handling
      const msg = await login({ ...values, type });
      
      if (loginStatus !== null && msg.status === loginStatus) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'Login Successful',
        });
        
        let ROLES = JSON.parse(localStorage.getItem('roles'));
        
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        
        // Role-based redirection
        if (ROLES[0] === 'ROLE_COLLECTOR') {
          history.push(redirect || '/dashboard/analysis');
        } else if (ROLES[0] === 'ROLE_DYSLR') {
          history.push(redirect || '/homepageDYSLR');
        } else if (ROLES[0] === 'ROLE_TEHSILDAR') {
          history.push(redirect || '/dashboard/analysis_copy');
        } else if ([
          'ROLE_SDO',
          'ROLE_COLLECTOR',
          'ROLE_DEPUTY_COLLECTOR',
          'ROLE_ACOL',
          'ROLE_CIRCLE_OFFICER',
          'ROLE_TAHSILDAR',
          'ROLE_NTAH'
        ].includes(ROLES[0])) {
          const redirectUrl = `http://localhost:9091/#/dashboard?data=${aToken}`;
          window.location.href = redirectUrl;
        } else {
          history.push(redirect || '/homepageThalati');
        }
      } else {
        throw new Error('Login status mismatch');
      }
    } else {
      alert('Captcha Does Not Match');
      throw new Error('Captcha validation failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle login attempts
    if (login_attempts == 0) {
      alert('No Login Attempts Available');
    } else {
      login_attempts = login_attempts - 1;
      alert(`Login Failed. Now Only ${login_attempts} Login Attempts Available`);
      if (login_attempts == 0) {
        document.getElementById('username1').disabled = true;
        document.getElementById('password1').disabled = true;
        document.getElementById('btnbtn').disabled = true;
      }
    }
    
    const defaultLoginFailureMessage = intl.formatMessage({
      id: 'pages.login.failure',
      defaultMessage: 'Login failed, please try again!',
    });
    message.error(defaultLoginFailureMessage);
    
    throw error; // Re-throw to be caught by button's onClick
  } finally {
    // Always clear loading state
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[2] = false;
      return newLoadings;
    });
  }
};

  useEffect(() => {
    console.log(useDetails, 'usercheckkkkkkDetails==================');
  }, [useDetails]); // This will run whenever useDetails changes
  const [loadings, setLoadings] = useState([]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 50000);
  };

  const onCancelForHelp = () => {
    setModalHelp(false);
  };

  const newsModal = () => {
    setModalHelp(true);
  };

  const info = () => {
    Modal.info({
      okType: 'danger',
      okText: 'रद्द करा ',

      //cancelText: <FormattedMessage id="formLanguage.form.no" />,
      title: 'इ-चावडी माहिती आणि मदत',
      content: (
        <div>
          <a href={`${URLS.AuthURL}/file/1`} target="_blank" rel="noreferrer">
            १) गाव नमुना एक ते एकवीस बाबत माहिती
          </a>{' '}
          <br></br>
          <br />
          <a href={`${URLS.AuthURL}/file/2`} target="_blank" rel="noreferrer">
            २) इ-चावडी सर्वसमावेशक सूचना
          </a>
        </div>
      ),
      onCancel() {},
    });
  };
  const SiteStop = () => {
    Modal.info({
      okType: 'danger',
      okText: 'रद्द करा ',

      //cancelText: <FormattedMessage id="formLanguage.form.no" />,

      title: 'इ-चावडी माहिती आणि मदत',
      content: (
        <div>
          <p>
            {/* ई - चावडी प्रणाली मेंटेनन्स कामकाज करिता आज दिनांक १४ फेब्रुवारी २०२४, रात्री १० ते ११ या वेळेत बंद राहील...     */}
            {/* ई - चावडी प्रणाली मेंटेनन्स कामकाज करिता आज रात्री १० ते उद्या सकाळी ३ या वेळेत बंद
            राहील... */}
            ई - चावडी प्रणाली मेंटेनन्स कामकाज करिता १० ऑगस्ट २०२४ आणि ११ ऑगस्ट २०२४ या दिवशी बंद
            राहील...
            {/*  ई - चावडी प्रणाली मेंटेनन्स कामकाज करिता आज दिनांक ८ फेब्रुवारी संध्याकाळी १० ते ११  डिसेंबर सकाळी २ या वेळेत बंद राहील...           */}
          </p>
          <br />
          {/* <p>ई-चावड़ी हेल्प डेस्क,पुणे</p> */}
        </div>
      ),
      onCancel() {},
    });
  };

  const { status, type: loginType } = userLoginState;

  useEffect(() => {
    loadCaptchaEnginge(6, 'skyblue');
  }, []);

  // const doSubmit = () => {
  //   //  let's assume there is an HTML input text box with id 'user_captcha_input' to get user input
  //   let user_captcha_value = document.getElementById('user_captcha_input').value;

  //   if (validateCaptcha(user_captcha_value) == true) {
  //     alert('Captcha Matched');
  //   } else {
  //     alert('Captcha Does Not Match');
  //   }
  // };
  const handleClick = () => {
    history.push('/dashboard/collectorMis');
  };

  return (
    <div className="loginscreen">
      <div>
        <img className="loginImage" src={mainImage} />

        <marquee>
          <h3 style={{ color: 'blueviolet' }}>
            {/*  मागणी निश्चिती केल्यावर पण काही दुरुस्ती बाकी असल्यास खातेदारांची मागणी दुरुस्तीची
            सुविधा देण्यात आलेली आहे. */}
            गाव नमुना निरंक आणि गाव नमुना कामकाज पूर्ण निवडण्याचा पर्याय सुविधा देण्यात आली आहे.
            इ-चावडी मधील MIS बघण्यासाठी User id/pw ची आवश्यकता नाही. ई चावडी MIS बघण्यासाठी वरील
            लिंकवर क्लिक करा.
          </h3>
        </marquee>

        {/* <div className="video">
          <Row>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Example />
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Example1 />
            </Col>
          </Row>
        </div> */}
      </div>

      <div className="rightSide">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <Button type="primary" className="go-to-mis-button" onClick={handleClick}>
            <ArrowRightOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
            <FormattedMessage id="login.gotoMis" />
            <img src="/new.gif" alt="New" className="new-gif" />
          </Button>

          <div className="translator" data-lang>
            {SelectLang && <SelectLang className="trans" />}
          </div>
        </div>
        <div className="loginForm" id="loginForm1">
          {/* <img className="firstAugustImage" src={FirstAugustTitle} /> */}
          <h1>
            <FormattedMessage id="pages.login.title" />
          </h1>
          {/* <Button type="primary" size="large" onClick={() => setDyslrLogin(true)}>
              DYSLR Login
            </Button> */}
          {/* <h3 className="loginname">
              <FormattedMessage id="pages.login.button.final" />
            </h3> */}
          <div className="username-div">
            <Input
              id="username1"
              required
              maxLength={15}
              onChange={(e) => {
                setUsername(e.target.value);
                document.getElementById('empty-username').style.opacity = '0';
              }}
              prefix={<UserOutlined className="usersymb" />}
              type="text"
              className="username"
              placeholder="Username"
            />
            <label id="empty-username">*Please enter a username</label>
          </div>
          <div className="password-div">
            <Input.Password
              id="password1"
              required
              maxLength={25}
              onChange={(e) => {
                setPassword(e.target.value);
                document.getElementById('empty-pass').style.opacity = '0';
              }}
              prefix={<LockOutlined className="locksymb" />}
              type="password"
              className="password"
              placeholder="Password"
            />
            <label id="empty-pass">*Please enter a password</label>
          </div>
          <div>
            <div className="container">
              <div className="form-group">
                <div className="col mt-3">
                  <LoadCanvasTemplate />
                </div>

                <div>
                  <div className="password">
                    <input
                      style={{ width: '100%' }}
                      placeholder="Enter Captcha Value"
                      id="user_captcha_input"
                      name="user_captcha_input"
                      type="text"
                    ></input>
                  </div>
                </div>

                {/* <div className="col mt-3">
                  <div>
                    <button className="btn btn-primary" onClick={() => doSubmit()}>
                      Submit
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
            {/* <LoadCanvasTemplate /> */}
          </div>
          {/* <Button
            id="btnbtn"
            className="loginbttn"
            loading={loadings[2]}
            type="primary"
            onClick={() => SiteStop()}
          >
            <FormattedMessage id="pages.login.button.final" />
          </Button> */}

         <Button
  id="btnbtn"
  className="loginbttn"
  loading={loadings[2]}
  type="primary"
  onClick={async () => {
    if (!username && !password) {
      document.getElementById('empty-username').style.opacity = '1';
      document.getElementById('empty-pass').style.opacity = '1';
    } else if (!username) {
      document.getElementById('empty-username').style.opacity = '1';
    } else if (!password) {
      document.getElementById('empty-pass').style.opacity = '1';
    } else {
      try {
        await handleSubmit();
      } catch (error) {
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[2] = false;
          return newLoadings;
        });
      }
    }
  }}
>
  <FormattedMessage id="pages.login.button.final" />
</Button>

          {/* <a
            href="https://drive.google.com/u/0/uc?id=1AodMBTimjwcisfdNsPprClpk5ViMOJFr&export=download"
            target="_blank"
          >
            <FormattedMessage id="login.downloadTranslator" />
          </a> */}
          {/* <Space wrap>
            <a style={{ color: '#1890ff', marginTop: 10 }} onClick={() => info()}></a>
          </Space> */}
          <Card sx={{ width: 310, height: 190, overflow: 'auto' }}>
            <CardHeader
              sx={{ position: 'static', backgroundColor: 'skyblue', height: 50 }}
              avatar={
                <Avatar sx={{ backgroundColor: '#ffd700' }}>
                  <LiveHelpTwoToneIcon />
                </Avatar>
              }
              title={
                <b>
                  <h3>
                    <FormattedMessage id="login.newsHelp" />
                  </h3>
                </b>
              }
            ></CardHeader>

            <CardContent>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a
                    href="https://drive.google.com/u/0/uc?id=1AodMBTimjwcisfdNsPprClpk5ViMOJFr&export=download"
                    target="_blank"
                  >
                    <FormattedMessage id="login.downloadTranslator" />
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/10`} target="_blank" rel="noreferrer">
                    इ-चावडी भाग - १ आकारणी विषयक अद्ययावतीकरण
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/9`} target="_blank" rel="noreferrer">
                    Live Data मधील फरक
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/7`} target="_blank" rel="noreferrer">
                    जमीन महसूल आकारणी पुर्णांक कार्यपद्धती
                    {/* जमीन महसूल पुर्णांक कार्यपद्धती */}
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/8`} target="_blank" rel="noreferrer">
                    जमीन महसूल ज्यादा वसूली
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/5`} target="_blank" rel="noreferrer">
                    इ-चावडी भाग-1 (महसूल मागणी व वसुली)
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/6`} target="_blank" rel="noreferrer">
                    इ-चावडी भाग-2 ( दप्तर अद्यायवत आणि अहवाल )
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href="https://forms.gle/B3d6dyscKc5hK9LZA" target="_blank" rel="noreferrer">
                    इ-चावडी मधील काही समस्या अथवा सुधारणा असल्यास फॉर्म भरा
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/1`} target="_blank" rel="noreferrer">
                    गाव नमुना एक ते एकवीस बाबत माहिती
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/2`} target="_blank" rel="noreferrer">
                    इ-चावडी सर्वसमावेशक सूचना
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/3`} target="_blank" rel="noreferrer">
                    इ-चावडी जमीन महसूल वसुली बाबत माहिती
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/4`} target="_blank" rel="noreferrer">
                    जमीन महसुलात सूटवजा बाबत परिपत्रक
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/11`} target="_blank" rel="noreferrer">
                    इ-चावडी प्रणाली -मार्गदर्शक सूचना
                  </a>
                </Grid>
              </Grid>

              {/* <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href="https://youtu.be/hdR8IvHex98" target="_blank" rel="noreferrer">
                    इ-चावडी भाग १ (संपूर्ण विडीओ)
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }}></ArrowForwardTwoToneIcon>
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href="https://youtu.be/6kqh8iujKQk" target="_blank" rel="noreferrer">
                    इ-चावडी भाग २ (संपूर्ण विडीओ)
                  </a>
                </Grid>
              </Grid> */}
            </CardContent>
          </Card>
          <Modal
            visible={modalForDelete}
            okText="Yes"
            okType="danger"
            // onCancel={onCancelForDeleteModal}
            // onOk={deleteForm17ById}
          >
            <FormattedMessage id="formLanguage.form.popForDelete" />
          </Modal>
          {/* <Form.Item label={<FormattedMessage id="login.newsHelp" />} name="surveyHissaNo">
            <Select
              // options={surveyHissaNumberValue}
              // value={surveyHissaNoValue}
              // onSelect={(value) => {
              //   getTotalAreaAndUom(value);
              // }}
              placeholder={<FormattedMessage id="login.newsHelp" />}
            />
          </Form.Item> */}
          {/* <Modal
            title="इ-चावडी माहिती आणि मदत"
            visible={modalHelp}
            okText={<FormattedMessage id="formLanguage.form.yes" />}
            okType="danger"
            cancelText={<FormattedMessage id="formLanguage.form.no" />}
            onCancel={onCancelForHelp}
            // onOk={deleteForm6BData}
          >

            <a href="http://localhost:8091/echawdi/auth/file/1" target="_blank" rel="noreferrer">
              १) गाव नमुना एक ते एकवीस बाबत माहिती
            </a>{' '}
            <br></br>
            <br />
            <a href="http://localhost:8091/echawdi/auth/file/2" target="_blank" rel="noreferrer">
              २) इ-चावडी सर्वसमावेशक सूचना
            </a>
          </Modal> */}
        </div>

        <div className="footer">
          <h4>© 2023 महसूल विभाग महाराष्ट्र</h4>
        </div>
      </div>
    </div>
    // <a href="https://echawadi.mahabhumi.gov.in" target="_blank">
    //   <article style={{ backgroundColor: '#d6433b' }}>
    //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 202.24 202.24">
    //       <defs>{/* <style>.cls-1{fill:#fff;}</style> */}</defs>
    //       <title>Asset 3</title>
    //       <g id="Layer_2" data-name="Layer 2">
    //         <g id="Capa_1" data-name="Capa 1">
    //           <path
    //             className="cls-1"
    //             d="M101.12,0A101.12,101.12,0,1,0,202.24,101.12,101.12,101.12,0,0,0,101.12,0ZM159,148.76H43.28a11.57,11.57,0,0,1-10-17.34L91.09,31.16a11.57,11.57,0,0,1,20.06,0L169,131.43a11.57,11.57,0,0,1-10,17.34Z"
    //           />
    //           <path
    //             className="cls-1"
    //             d="M101.12,36.93h0L43.27,137.21H159L101.13,36.94Zm0,88.7a7.71,7.71,0,1,1,7.71-7.71A7.71,7.71,0,0,1,101.12,125.63Zm7.71-50.13a7.56,7.56,0,0,1-.11,1.3l-3.8,22.49a3.86,3.86,0,0,1-7.61,0l-3.8-22.49a8,8,0,0,1-.11-1.3,7.71,7.71,0,1,1,15.43,0Z"
    //           />
    //         </g>
    //       </g>
    //     </svg>
    //     {/* <h1>We&rsquo;ll be back soon!</h1> */}
    //     <div>
    //       <p>नवीन इ-चावडी आज्ञावली साठी खालील संकेतस्थळावर क्लिक करा.</p>
    //       <h2>
    //         {' '}
    //         <u>
    //           {' '}
    //           <a href="https://echawadi.mahabhumi.gov.in/">https://echawadi.mahabhumi.gov.in</a>
    //         </u>
    //       </h2>
    //       <br />
    //       <br />
    //       <br />
    //       <br />
    //       <p>
    //         &mdash; इ-चावडी हेल्प डेस्क <br />
    //         जमाबंदी आयुक्त कार्यालय, पुणे{' '}
    //       </p>
    //     </div>
    //   </article>
    // </a>
  );
};

class Example extends React.Component {
  render() {
    const opts = {
      height: '150vh',
      width: '300vw',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    return <YouTube videoId="hdR8IvHex98" opts={opts} onReady={this._onReady} />;
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}

class Example1 extends React.Component {
  render() {
    const opts = {
      height: '150vh',
      width: '300vw',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    return <YouTube videoId="6kqh8iujKQk" opts={opts} onReady={this._onReady} />;
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}

export default Login;

//https://youtu.be/hdR8IvHex98
//https://www.youtube.com/watch?v=hdR8IvHex98
