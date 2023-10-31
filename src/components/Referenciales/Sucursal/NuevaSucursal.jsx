

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { createSucursal } from '../../../services/Sucursal';
import { Titulos } from '../../Utils/Titulos';
import Buscador from '../../Utils/Buscador/Buscador';
import { getCiudad } from '../../../services/Ciudad';

function NuevoSucursal({ token }) {
    const [form] = Form.useForm();
    const [sucursal, setSucursal] = useState('');
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [idciudad, setIdciudad] = useState(null);
    const [ciudades, setCiudades] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getLstCiudad();
        // eslint-disable-next-line
    }, []);

    const getLstCiudad = async () => {
        const res = await getCiudad({ token: token, param: 'get' });
        setCiudades(res.body);
    }

    //procedimiento para actualizar
    const create = async (e) => {

        await createSucursal({
            token: token, json: {
                estado: "AC",
                descripcion: sucursal,
                ruc,
                direccion,
                idciudad
            }
        }).then((res) => {
            if (res?.estado !== 'error') {
                message.success(res.mensaje);
                navigate('/sucursal');
            } else {
                message.error(res.mensaje);
            }
        })
    }

    const onChangeCiudad = (value) => {
        setIdciudad(value)
        form.setFieldValue('idciudad', value);
        console.log(`selected ${value}`);
    };
    
    const onSearch = (value) => {
        console.log('search:', value);
    };

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/sucursal');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVA SUCURSAL`} level={3}></Titulos>
            </div>
            <Form
                name="basic"
                form={form}
                style={{ textAlign: `center`, marginLeft: `10px` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                //onFinishFailed={create}
                layout="vertical"
                autoComplete="off" >

                <Form.Item label='Nombre de sucursal' name="sucursal" rules={[{ required: true, message: 'Cargue sucursal', },]}>
                    <Input placeholder='Sucursal' value={sucursal} onChange={(e) => setSucursal(e.target.value)} />
                </Form.Item>
                <Form.Item label='Ruc' name="ruc" rules={[{ required: true, message: 'Cargue ruc', },]}>
                    <Input placeholder='Ruc' value={ruc} onChange={(e) => setRuc(e.target.value)} />
                </Form.Item>
                <Form.Item label='Dirección' name="direccion" rules={[{ required: true, message: 'Cargue dirección', },]}>
                    <Input placeholder='Dirección' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label='Ciudad'
                    rules={[{ required: true, message: 'Seleccione ciudad', },]}>
                    {idciudad ?
                        <Input id='idciudad' name='idciudad' disabled value={idciudad} />
                        : null}
                    <Buscador title={'Ciudad'} label={'descripcion'} selected={idciudad} value={'idciudad'} data={ciudades} onChange={onChangeCiudad} onSearch={onSearch} />
                </Form.Item>
                <Form.Item
                    style={{ margin: `20px` }}>
                    <Button type="primary" htmlType="submit" style={{ margin: `20px` }} >
                        Guardar
                    </Button>
                    <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default NuevoSucursal;
