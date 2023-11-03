import React from 'react'
import { Typography } from 'antd';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import { getAnalisisInv } from '../services/Inventario';
const { Title } = Typography;

export const Inicio = ({ token, usuario, idsucursal }) => {

    const [lstAnalisisInv, setLstAnalisisInv] = useState();
    useEffect(() => {
        getLstAnalisisInv()
        // eslint-disable-next-line
    }, []);

    const getLstAnalisisInv = async () => {
        const res = await getAnalisisInv({ token: token, param: 'get' });
        //console.log(res.body);
        setLstAnalisisInv(res?.body);
    }
    //console.log(lstAnalisisInv)

    return (
        <div style={{
            width: `100%`,
            height: `100%`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            display: `flex`,
            justifyContent: `center`,
        }}>
            <div style={{
                width: `90%`,
                margin: `30px`,
                textAlign: `center`,

                //background: `red`
            }}>
                <Title style={{ textAlign: `start`, }} level={2} >Bienvenido</Title>
                <Title style={{ textAlign: `start` }} level={5} >Recuerde actualizar su contraseña y no compartir sus credenciales de seguridad</Title>
                <Divider orientation="left">Estadistica de Inventario</Divider>

                <div style={{ display: `flex`, flexWrap: `wrap` }}>
                    {lstAnalisisInv?.map((list, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: `${parseInt(list.cantidad_total) <= 5 ? `#F7524F` : parseInt(list.cantidad_total) <= 10 ? `#F78A4F` : `#5E92FE`}`,
                                padding: '8px',
                                fontSize: `16px`,
                                color: `white`,
                                borderRadius: `5px`,
                                margin: `5px`,
                                minWidth: `200px`,
                                maxWidth: `300px`,
                            }}>
                            <b>{parseInt(list.cantidad_total) <= 5 ? `Alerta!` : parseInt(list.cantidad_total) <= 10 ? `Alerta!` : `Se está agotando..`}</b>
                            <br />
                            {list.descripcion}
                            <br />
                            <b style={{ fontSize: `24px`, }}>{list.cantidad_total}</b>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}
export default Inicio;