

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createCargos } from '../../../services/Cargos';
import {Titulos} from '../../Utils/Titulos';

function NuevoCargos({ token }) {

    //Parte de nuevo registro por modal
    const [form] = Form.useForm();
    const [descripcion, setDescripcion] = useState();
    const [det1, setDet1] = useState();
    const [det2, setDet2] = useState();
    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await createCargos({ token: token, json: { descripcion: descripcion, estado: "AC" } });
        navigate('/cargos');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/cargos');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVO CARGO`} level={3}></Titulos>
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
                //onFinishFailed={create}
                autoComplete="off"
                >
           

                <Form.Item label='Descripción' name="descripcion" rules={[{ required: true, message: 'Cargue descripción de cargos', },]}>
                    <Input placeholder='Descripción' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Item>

                <Form.Item label='Label 1' name="label1" >
                    <Input placeholder='Label 1' value={det1} onChange={(e) => setDet1(e.target.value)} />
                </Form.Item>

                <Form.Item label='Label 2' name="label2" >
                    <Input placeholder='Label 2' value={det2} onChange={(e) => setDet2(e.target.value)} />
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

export default NuevoCargos;
