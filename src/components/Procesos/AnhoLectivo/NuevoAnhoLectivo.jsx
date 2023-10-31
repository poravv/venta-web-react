

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createAnhoLectivo } from '../../../services/AnhoLectivo';
import {Titulos} from '../../Utils/Titulos';

function NuevoAnhoLectivo({ token }) {
    //Parte de nuevo registro por modal
    const [form] = Form.useForm();
    const [anho, setDescripcion] = useState('');
    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await createAnhoLectivo({ token: token, json: { anho: anho, estado: "AC" } });
        navigate('/anhoLectivo');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/anhoLectivo');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
            <Titulos text={`NUEVO AÑO`} level={3}></Titulos>
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

                <Form.Item label='Año' name="anho" rules={[{ required: true, message: 'Cargue año', },]}>
                    <Input placeholder='Año' value={anho} onChange={(e) => setDescripcion(e.target.value)} />
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

export default NuevoAnhoLectivo;

/*

                

*/