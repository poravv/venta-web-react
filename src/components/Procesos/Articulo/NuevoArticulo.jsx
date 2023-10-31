

import {
    useEffect,
    //useEffect, 
    useState
} from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import UploadFile from '../../Utils/Upload';
import { createArticulo } from '../../../services/Articulo';
import { Titulos } from '../../Utils/Titulos';
import { getVwProveedor } from '../../../services/Proveedor';
import Buscador from '../../Utils/Buscador/Buscador';

function NuevoArticulo({ token }) {
    const [form] = Form.useForm();
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState(0);
    const [peso, setPeso] = useState(0);
    const navigate = useNavigate();
    const [previewImage1, setPreviewImage1] = useState();
    const [proveedores, setProveedores] = useState([]);
    const [idproveedor, setIdproveedor] = useState(null);

    useEffect(() => {
        getLstProveedor();
        // eslint-disable-next-line
    }, []);

    const getLstProveedor = async () => {
        const res = await getVwProveedor({ token: token, param: 'get' });
        setProveedores(res.body);
    }

    //procedimiento para actualizar
    const create = async (e) => {
        
        if (!previewImage1) { message.error('Debe cargar una imagen'); return; }
        
        try {
            await createArticulo({
                token: token, json: {
                    idproveedor: idproveedor,
                    estado: "AC",
                    img: previewImage1,
                    descripcion: descripcion,
                    precio,
                    peso
                }
            }).then((res) => {
                console.log(res)
                if (res?.estado !== 'error') {
                    message.success(res?.mensaje);
                    navigate('/articulo');
                } else {
                    message.error(res?.mensaje);
                }
            });
            
        } catch (error) {
            message.error('Error en la creacion de registro');
        }
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/articulo');
    }

    const onChangeProveedor = (value) => {
        setIdproveedor(value)
        form.setFieldValue('idproveedor', value);
        console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVO ARTICULO`} level={3}></Titulos>
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
                <Form.Item label='Nombre de articulo' name="articulo" rules={[{ required: true, message: 'Cargue articulo', },]}>
                    <Input placeholder='Descripción' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Item>
                <Form.Item label='Precio' name="precio" rules={[{ required: true, message: 'Cargue precio', },]}>
                    <Input type='number' placeholder='Precio' value={precio} onChange={(e) => setPrecio(e.target.value)} />
                </Form.Item>
                <Form.Item label='Peso' name="peso" rules={[{ required: true, message: 'Cargue peso', },]}>
                    <Input type='number' placeholder='Peso' value={peso} onChange={(e) => setPeso(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label='Proveedor'
                    rules={[{ required: true, message: 'Seleccione proveedor', },]}>
                    {idproveedor ?
                        <Input id='idproveedor' name='idproveedor' disabled value={idproveedor} />
                        : null}
                    <Buscador title={'Proveedor'} label={'razon_social'} selected={idproveedor} value={'idproveedor'} data={proveedores} onChange={onChangeProveedor} onSearch={onSearch} />
                </Form.Item>
                <Form.Item name="imagen" id='imagen' style={{ margin: `10px` }}  >
                    <UploadFile previewImage={previewImage1} setPreviewImage={setPreviewImage1} />
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

export default NuevoArticulo;
