

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, Radio, Row, Divider, Col, message } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getLikeCliente, createCliente, updateCliente } from '../../../services/Cliente';
import { getCiudad } from '../../../services/Ciudad';
import { Titulos } from '../../Utils/Titulos';


function NuevoCliente({ token }) {
    const [form] = Form.useForm();
    const [razon_social, setRazonSocial] = useState('');
    const [ruc, setRuc] = useState(null);
    const [contRuc, setContRuc] = useState(false);
    const [direccion, setDireccion] = useState(null);
    const [sruc, setSRuc] = useState(null);
    const [tipo_cli, setTipoCli] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [valueSexo, setValueSexo] = useState('');
    const [ciudades, setCiudades] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [idciudad, setIdciudad] = useState(null);
    const [idcliente, setIdcliente] = useState(null);
    const [btn, setBtn] = useState(false);

    useEffect(() => {
        getLstCiudad();
        // eslint-disable-next-line
    }, []);

    const btnClear = async (e) => {
        e.preventDefault();
        setBtn(false)
        setSRuc(null)
        setClientes([])
        //console.log('Elemento:', element);
        setRazonSocial('');
        setRuc(null);
        setContRuc(false);
        setValueSexo('');
        setDireccion('');
        setTipoCli('');
        setCorreo('');
        setTelefono('');
        setIdciudad('');
        setIdcliente(0);
        form.setFieldValue('buscadoc', '');
        form.setFieldValue('razon_social', '');
        form.setFieldValue('ruc', '');
        form.setFieldValue('sexo', '');
        form.setFieldValue('direccion', '');
        form.setFieldValue('correo', '');
        form.setFieldValue('telefono', '');
        form.setFieldValue('idciudad', '');
        form.setFieldValue('idcliente', '');
    }

    const onChangeRadio = (e) => {
        console.log('radio checked', e.target.value);
        setValueSexo(e.target.value);
    };

    const onChangeRadioTipoCli = (e) => {
        console.log('radio checked', e.target.value);
        setTipoCli(e.target.value);
    };


    const getLstCiudad = async () => {
        const res = await getCiudad({ token: token, param: 'get' });
        setCiudades(res.body);
    }

    const getLstClientes = async (valor) => {
        const res = await getLikeCliente({ token: token, param: valor });
        setClientes(res.body);
    }

    const onChangeCiudad = (value) => {
        setIdciudad(value)
        form.setFieldValue('idciudad', value);
        console.log(`selected ${value}`);
    };

    const navigate = useNavigate();

    const btnBuscador = async (e) => {
        e.preventDefault();
        if (sruc === null) return;
        setBtn(true)
        await getLstClientes(sruc);
    }

    const create = async (e) => {
        let saveCliente = {
            razon_social: razon_social,
            sexo: valueSexo,
            ruc: ruc,
            estado: 'AC',
            direccion: direccion,
            tipo_cli: tipo_cli,
            correo: correo,
            telefono: telefono,
            idciudad: idciudad,
        };

        await getLikeCliente({ token: token, param: ruc }).then(async (rsper) => {
            if (rsper.body.length !== 0) {
                rsper.body.map(async (per) => {
                    if (per.ruc === ruc) {
                        saveCliente.idcliente = per.idcliente;
                        await updateCliente({ token: token, param: saveCliente.idcliente, json: saveCliente }).then((rsper) => {
                            //console.log(rsper);
                            if(rsper?.estado!=='error'){
                                navigate(`/cliente`);
                                message.success(rsper?.mensaje);
                            }else{
                                message.warning(rsper?.mensaje);
                            }
                        });
                    }
                })
            } else {
                await createCliente({ token: token, json: saveCliente }).then((rsper) => {
                    if(rsper?.estado!=='error'){
                        navigate(`/cliente`);
                        message.success(rsper?.mensaje);
                    }else{
                        message.warning(rsper?.mensaje);
                    }
                });
            }
        })
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/cliente');
    }

    const onChangeCliente = (value) => {
        clientes.map((element) => {
            if (element.idcliente === value) {
                setRazonSocial(element.razon_social);
                setRuc(element.ruc);
                setContRuc(true);
                setValueSexo(element.sexo);
                setDireccion(element.direccion);
                setTipoCli(element.tipo_cli);
                setCorreo(element.correo);
                setTelefono(element.telefono);
                setIdciudad(element.idciudad);
                setIdcliente(element.idcliente);

                form.setFieldValue('razon_social', element.razon_social);
                form.setFieldValue('ruc', element.ruc);
                form.setFieldValue('sexo', element.sexo);
                form.setFieldValue('direccion', element.direccion);
                form.setFieldValue('correo', element.correo);
                form.setFieldValue('telefono', element.telefono);
                form.setFieldValue('idciudad', element.idciudad);
                form.setFieldValue('idcliente', element.idcliente);
            }
            return true;
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };


    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`FORMULARIO DE CLIENTE`} level={3}></Titulos>
            </div>
            <Form
                name="basic"
                layout="vertical"
                style={{ textAlign: `center`, marginLeft: `10px` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                autoComplete="off"
                form={form} >
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Busqueda por ruc</Divider>
                <Row style={{ marginBottom: `20px` }}>
                    {btn === false ?
                        <Col style={{ width: `100%` }}>
                            <Row>
                                <Form.Item id='buscadoc' style={{ width: `100%` }}>
                                    <Input placeholder='Ruc de estudiante' value={sruc} onChange={(e) => setSRuc(e.target.value)} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" onClick={btnBuscador}  >
                                    Buscar
                                </Button>
                            </Row>
                        </Col>
                        : <Col style={{ width: `100%` }}>
                            <Row>
                                <Form.Item id='busdoc1' style={{ width: `100%` }}>
                                    <Input hidden disabled id='busdoc1' value={idcliente} />
                                    <Buscador id='busdoc1' label={'ruc'} title={'Ruc'} selected={idcliente} value={'idcliente'} data={clientes} onChange={onChangeCliente} onSearch={onSearch} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" onClick={btnClear} style={{ backgroundColor: `green` }} >
                                    Limpiar
                                </Button>
                            </Row>
                        </Col>
                    }
                </Row>
                {idcliente !== 0 && idcliente !== null ?
                    <Form.Item
                        label='Idcliente'
                        id='idcliente' >
                        <Input disabled value={idcliente} onChange={(e) => setIdcliente(e.target.value)} />
                    </Form.Item>
                    : null}
                <Form.Item label='Ruc de identidad' id='ruc' name="ruc" rules={[{ required: true, message: 'Cargue numero de ruc', },]}>
                    <Input placeholder='Ruc de identidad' disabled={contRuc} value={ruc} onChange={(e) => setRuc(e.target.value)} />
                </Form.Item>

                <Form.Item id='razon_social' label='RazonSocial' rules={[{ required: true, message: 'Cargue razon_social', },]}>
                    <Input name='razon_social' placeholder='razon_social' value={razon_social} onChange={(e) => setRazonSocial(e.target.value)} />
                </Form.Item>
                <Form.Item label='Correo' id='correo' type="mail" rules={[{ required: true, message: 'Cargue correo', },]}>
                    <Input placeholder='Correo' value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </Form.Item>
                <Form.Item label='Telefono' id='telefono' rules={[{ required: true, message: 'Cargue telefono', },]}>
                    <Input placeholder='Telefono' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </Form.Item>
                <Form.Item label='Dirección' id='direccion' rules={[{ required: true, message: 'Cargue direccion', },]}>
                    <Input placeholder='Direccion' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Item>

                <Form.Item label='Tipo de cliente' id='tipod' rules={[{ required: true, message: 'Seleccione tipo de cliente', },]}>
                    <Radio.Group
                        onChange={onChangeRadioTipoCli}
                        id='tipod'
                        name='tipod'
                        value={tipo_cli}>
                        <Radio value={'F'}>Físico</Radio>
                        <Radio value={'J'}>Jurídico</Radio>
                    </Radio.Group>
                </Form.Item>

                {tipo_cli === 'F' ?
                    <Form.Item label='Sexo' id='sexo' >
                        <Radio.Group
                            onChange={onChangeRadio}
                            id='sexo'
                            name='sexo'
                            value={valueSexo}>
                            <Radio value={'MA'}>Masculino</Radio>
                            <Radio value={'FE'}>Femenino</Radio>
                        </Radio.Group>
                    </Form.Item> : null}

                <Form.Item
                    label='Ciudad'
                    id='idciudad'
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

export default NuevoCliente;
