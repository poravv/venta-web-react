import React from 'react'
import { Typography } from 'antd';
const { Title, Text } = Typography;

export const Inicio = ({ token, usuario, idsucursal }) => {

    return (
        <div style={{
            //backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.5)),url(${require('../components/Utils/img/fondo.jpeg')})`,
            //backgroundImage: `url(${require('../components/Utils/img/fondo.jpeg')})`,
            width: `100%`,
            height: `100%`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            display: `flex`,
            justifyContent: `center`,
        }}>
            <div style={{
                width:`90%`,
                margin: `30px`,
                textAlign: `center`,
                //background: `red`
            }}>
                <Title level={2} style={{ color: `black` }}>Bienvenido</Title>
                <br />
                <Text style={{ color: `black` }}>Recuerde actualizar su contraseña y no compartir sus credenciales de seguridad</Text>
            </div>
        </div>
    );
}
export default Inicio;