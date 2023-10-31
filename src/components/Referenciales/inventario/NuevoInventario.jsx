import {
    useEffect,
    //useEffect, 
    useState
} from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { getInventarioProducto, updateInventario } from '../../../services/Inventario';
import { Titulos } from '../../Utils/Titulos';
import { getArticulo } from '../../../services/Articulo';
import Buscador from '../../Utils/Buscador/Buscador';

function NuevoInventario({ token }) {
    const [form] = Form.useForm();
    const [cantidad, setCantidad] = useState(0);
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [idproducto, setIdproducto] = useState(null);

    useEffect(() => {
        getLstProductos();
        // eslint-disable-next-line
    }, []);

    const getLstProductos = async () => {
        const res = await getArticulo({ token: token, param: 'get' });
        setProductos(res.body);
    }

    //procedimiento para actualizar
    const create = async (e) => {
        if (cantidad <=0) { message.error('Cargue cantidad valida'); return; }
        getInventarioProducto({ token, param: idproducto }).then(async (res) => {
            //console.log(res)
            const json = {
                idinventario: res?.body[0].idinventario,
                estado: 'AC',
                cantidad_total: (parseInt(res?.body[0].cantidad_total) + parseInt(cantidad)),
            }

            await updateInventario({ token: token, param: res?.body[0].idinventario, json: json }).then((res) => {
                if (res?.estado !== 'error') {
                    message.success(res?.mensaje);
                    navigate('/inventario');
                } else {
                    message.error(res?.mensaje);
                }
            });
        })

    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/inventario');
    }

    const onChangeProducto = (value) => {
        setIdproducto(value)
        form.setFieldValue('idproducto', value);
        //console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVO INVENTARIO`} level={3}></Titulos>
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
                <Form.Item
                    label='Articulo'
                    rules={[{ required: true, message: 'Seleccione proveedor', },]}>
                    {idproducto ?
                        <Input id='idproducto' name='idproducto' disabled value={idproducto} />
                        : null}
                    <Buscador title={'Articulo'} label={'descripcion'} selected={idproducto} value={'idproducto'} data={productos} onChange={onChangeProducto} onSearch={onSearch} />
                </Form.Item>
                <Form.Item label='Cantidad' name="cantidad" rules={[{ required: true, message: 'Cargue cantidad', },]}>
                    <Input type="number" placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
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

export default NuevoInventario;
