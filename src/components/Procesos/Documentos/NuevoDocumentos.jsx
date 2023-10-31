

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createDocumentos } from '../../../services/Documentos';
import {Titulos} from '../../Utils/Titulos';

function NuevoDocumentos({ token }) {
    const [form] = Form.useForm();
    const [descripcion, setDescripcion] = useState('');
    const navigate = useNavigate();

    const create = async (e) => {
        await createDocumentos({ token: token, json: { descripcion: descripcion, estado: "AC" } });
        navigate('/documentos');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/documentos');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
            <Titulos text={`NUEVO DOCUMENTO`} level={3}></Titulos>
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

                <Form.Item label='Documento' name="descripcion" rules={[{ required: true, message: 'Cargue documentos', },]}>
                    <Input placeholder='Descripción del documento' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
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

export default NuevoDocumentos;
