

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createMateria } from '../../../services/Materia';
import {Titulos} from '../../Utils/Titulos';

function NuevoMateria({ token }) {

    //Parte de nuevo registro por modal
    const [form] = Form.useForm();
    const [descripcion, setDescripcion] = useState('');
    const [observacion, setObservacion] = useState('');
    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await createMateria({ token: token, json: { descripcion: descripcion,observacion:observacion, estado: "AC" } });
        navigate('/materia');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/materia');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVA MATERIA`} level={3}></Titulos>
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
                //onFinishFailed={create}`
                autoComplete="off"
            >

                <Form.Item label='Descripción' name="descripcion" rules={[{ required: true, message: 'Cargue descripción de materia', },]}>
                    <Input placeholder='Descripción' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Item>
                <Form.Item label='Observación' name="obaservacion" rules={[{ required: false},]}>
                    <Input placeholder='Observación alternativa' value={observacion} onChange={(e) => setObservacion(e.target.value)} />
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

export default NuevoMateria;

/*

                

*/