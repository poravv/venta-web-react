

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createAptitud } from '../../../services/Aptitud';
import {Titulos} from '../../Utils/Titulos';


function NuevaAptitud({ token }) {
    //Parte de nuevo registro por modal
    const [form] = Form.useForm();
    const [descripcion, setDescripcion] = useState('')
    const [puntos, setPuntos] = useState()
    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await createAptitud({ token: token, json: { descripcion: descripcion,punto:puntos, estado: "AC" } });
        navigate('/aptitud');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/aptitud');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVA APTIRUD MILITAR`} level={3}></Titulos>
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
                autoComplete="off"
            >

                <Form.Item label='Descripción' name="descripcion" rules={[{ required: true, message: 'Cargue descripción', },]}>
                    <Input placeholder='Descripción' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Item>
                <Form.Item label='Puntos' name="punto" rules={[{ required: true, message: 'Cargue punto', },]}>
                    <Input placeholder='Puntos a descontar' value={puntos} onChange={(e) => setPuntos(e.target.value)} />
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

export default NuevaAptitud;

