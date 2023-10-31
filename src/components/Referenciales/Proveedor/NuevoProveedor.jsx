

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createProveedor } from '../../../services/Proveedor';
import { Titulos } from '../../Utils/Titulos';
import { message } from 'antd';

function NuevoProveedor({ token }) {
    //Parte de nuevo registro por modal
    const [form] = Form.useForm();

    const [razon_social, setRazonSocial] = useState()
    const [ruc, setRuc] = useState()
    const [direccion, setDireccion] = useState()
    const [telefono, setTelefono] = useState()

    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await createProveedor({
            token: token, json: {
                razon_social: razon_social, 
                direccion,
                telefono,
                ruc,
                estado: "AC",
            }
        }).then((res) => {
            if (res?.estado !== 'error') {
                message.success(res?.mensaje);
                navigate('/proveedor');
            } else {
                message.error(res?.mensaje);
            }
        });
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/proveedor');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVA CIUDAD`} level={3}></Titulos>
            </div>
            <Form
                name="basic"
                layout="vertical"
                form={form}
                style={{ textAlign: `center`, marginLeft: `10px` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                autoComplete="off"
            >
                <Form.Item label='Razon social' name="razon_social" rules={[{ required: true, message: 'Cargue razon social de proveedor', },]}>
                    <Input placeholder='Razon social' value={razon_social} onChange={(e) => setRazonSocial(e.target.value)} />
                </Form.Item>
                <Form.Item label='Ruc' name="ruc" rules={[{ required: true, message: 'Cargue ruc de proveedor', },]}>
                    <Input placeholder='Ruc' value={ruc} onChange={(e) => setRuc(e.target.value)} />
                </Form.Item>
                <Form.Item label='Dirección' name="direccion" rules={[{ required: true, message: 'Cargue dirección de proveedor', },]}>
                    <Input placeholder='Dirección' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Item>
                <Form.Item label='Teléfono' name="telefono" rules={[{ required: true, message: 'Cargue teléfono de proveedor', },]}>
                    <Input placeholder='Teléfono' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
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

export default NuevoProveedor;
