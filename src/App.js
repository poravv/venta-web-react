
import './App.css';
import { useEffect, useState } from 'react';
import ConfigBrows from './layouts/NavRoute'
import LoginForm from './components/LoginForm';
import { theme } from 'antd';
import { ConfigProvider } from 'antd';
import { FloatButton } from 'antd';
import { getSucursalById } from './services/Sucursal'
import { IoMoonOutline, IoColorWandSharp, IoSunnyOutline } from "react-icons/io5";
//import { Logout } from './services/Login';

function App() {
  const loggedUserJSON=window.localStorage.getItem('loggedUser')??null;
  const userJson = JSON.parse(loggedUserJSON);
  const [userApp, setUserApp] = useState(userJson??null);
  const [sucursal, setSucursal] = useState(null);
  
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const dark = {
    algorithm: [darkAlgorithm],
    token: {
      //fontFamily: 'Oxygen',
      fontSize: 12,
      borderRadius: 0,
      colorBgBase: `#060f18`
    }
  }
  
  const normal = {
    token: {
      defaultAlgorithm,
      //fontFamily: 'Oxygen',
      fontSize: 12
    }
  };

  const [temaSeleccionado, setTemaSeleccionado] = useState(normal);

  //BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  //'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  //'Noto Color Emoji';

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  const init = async () => {
    if (userJson) {
      const res = await getSucursalById({ token: userJson.token, param: userJson.body.idsucursal });
      setUserApp(userJson);
      setSucursal(res);
    } //else { Logout();}
  }
 
  return (
    <>
      <ConfigProvider
        theme={temaSeleccionado}>
        {
          userApp ? <ConfigBrows usuario={userApp??null} sucursal={sucursal} /> : <LoginForm />
        }
      </ConfigProvider>
      <FloatButton.Group icon={< IoColorWandSharp />}
        type="primary"
        trigger="click"
      >
        <FloatButton style={{ color: `red` }} onClick={() => setTemaSeleccionado(normal)} icon={<IoSunnyOutline />} />
        <FloatButton onClick={() => setTemaSeleccionado(dark)} icon={<IoMoonOutline />} />
      </FloatButton.Group>
    </>
  );
}
export default App;
