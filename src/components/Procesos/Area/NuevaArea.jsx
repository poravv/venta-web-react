

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createArea } from '../../../services/Area';
import {Titulos} from '../../Utils/Titulos';

function NuevaArea({ token }) {
    //Parte de nuevo registro por modal
    const [form] = Form.useForm();
    const [area, setArea] = useState('')
    const [linea_investigacion, setLineaInvestigacion] = useState('')
    const [sublinea, setsublinea] = useState('')
    const navigate = useNavigate();
    
    const create = async () => {
        await createArea({ token: token, json: { area: area,linea_investigacion:linea_investigacion,sublinea:sublinea, estado: "AC" } });
        navigate('/area');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/area');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVO REGISTRO`} level={3}></Titulos>
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

                <Form.Item label='Área' name="area" rules={[{ required: true, message: 'Cargue área', },]}>
                    <Input placeholder='Área' value={area} onChange={(e) => setArea(e.target.value)} />
                </Form.Item>
                <Form.Item label='Línea' name="linea" rules={[{ required: true, message: 'Cargue línea de investigación', },]}>
                    <Input placeholder='Línea de investigación' value={linea_investigacion} onChange={(e) => setLineaInvestigacion(e.target.value)} />
                </Form.Item>
                <Form.Item label='Sub Línea' name="Sub línea" rules={[{ required: true, message: 'Cargue sub línea de investigación', },]}>
                    <Input placeholder='Sub Línea' value={sublinea} onChange={(e) => setsublinea(e.target.value)} />
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

export default NuevaArea;
