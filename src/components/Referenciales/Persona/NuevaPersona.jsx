

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, DatePicker, Radio, Row, Divider, Col, message } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getLikePersona, createPersona, updatePersona } from '../../../services/Persona';
import { getCiudad } from '../../../services/Ciudad';
import moment from 'moment';
import { NACIONALIDAD } from '../../Utils/Nacionalidades'
import { Titulos } from '../../Utils/Titulos';


function NuevoPersona({ token }) {
    const [form] = Form.useForm();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nacimiento, setFnacimiento] = useState('');
    const [documento, setDocumento] = useState(null);
    const [contDocumento, setContDocumento] = useState(false);
    const [direccion, setDireccion] = useState(null);
    const [sdocumento, setSDocumento] = useState(null);
    const [tipo_doc, setTipo_doc] = useState('');
    const [nacionalidad, setNacionalidad] = useState(null);
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [valueSexo, setValueSexo] = useState('');
    const [ciudades, setCiudades] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [idciudad, setIdciudad] = useState(null);
    const [idpersona, setIdpersona] = useState(null);
    const [btn, setBtn] = useState(false);

    useEffect(() => {
        getLstCiudad();
        // eslint-disable-next-line
    }, []);

    const btnClear = async (e) => {
        e.preventDefault();
        setBtn(false)
        setSDocumento(null)
        setPersonas([])
        //console.log('Elemento:', element);
        setNombre('');
        setApellido('');
        setDocumento(null);
        setContDocumento(false);
        setValueSexo('');
        setDireccion('');
        setTipo_doc('');
        setNacionalidad('');
        onChangeNacionalidad('');
        setCorreo('');
        setTelefono('');
        setIdciudad('');
        setIdpersona(0);
        setFnacimiento('');
        form.setFieldValue('buscadoc', '');
        form.setFieldValue('nombre', '');
        form.setFieldValue('apellido', '');
        form.setFieldValue('documento', '');
        form.setFieldValue('sexo', '');
        form.setFieldValue('direccion', '');
        form.setFieldValue('nacionalidad', '');
        form.setFieldValue('correo', '');
        form.setFieldValue('telefono', '');
        form.setFieldValue('idciudad', '');
        form.setFieldValue('idpersona', '');
        form.setFieldValue('nacimiento', '');
    }

    const onChangeRadio = (e) => {
        console.log('radio checked', e.target.value);
        setValueSexo(e.target.value);
    };

    const onChangeRadioTipoDoc = (e) => {
        console.log('radio checked', e.target.value);
        setTipo_doc(e.target.value);
    };


    const getLstCiudad = async () => {
        const res = await getCiudad({ token: token, param: 'get' });
        setCiudades(res.body);
    }

    const getLstPersonas = async (valor) => {
        const res = await getLikePersona({ token: token, param: valor });
        setPersonas(res.body);
    }

    const onChangeCiudad = (value) => {
        setIdciudad(value)
        form.setFieldValue('idciudad', value);
        console.log(`selected ${value}`);
    };

    const onChangeNacionalidad = (value) => {
        setNacionalidad(value)
        form.setFieldValue('nacionalidad', value);
        console.log(`selected ${value}`);
    };

    const navigate = useNavigate();

    const btnBuscador = async (e) => {
        e.preventDefault();
        if (sdocumento === null) return;
        setBtn(true)
        await getLstPersonas(sdocumento);
    }

    const create = async (e) => {
        if (nacimiento?.toString() === '0000-00-00') { message.error('Fecha de nacimiento invalida'); return; }
        let savePersona = {
            nombre: nombre,
            apellido: apellido,
            nacimiento: nacimiento,
            sexo: valueSexo,
            documento: documento,
            estado: 'AC',
            direccion: direccion,
            tipo_doc: tipo_doc,
            nacionalidad: nacionalidad,
            correo: correo,
            telefono: telefono,
            est_civil: '',
            idciudad: idciudad,
        };

        await getLikePersona({ token: token, param: documento }).then(async (rsper) => {
            if (rsper.body.length !== 0) {
                rsper.body.map(async (per) => {
                    if (per.documento === documento) {
                        savePersona.idpersona = per.idpersona;
                        await updatePersona({ token: token, param: savePersona.idpersona, json: savePersona }).then((rsper) => {
                            console.log(rsper);
                        }).then(async (_) => {
                            navigate(`/persona`);
                            message.success('Registro almacenado');
                        });
                    }
                })
            } else {
                await createPersona({ token: token, json: savePersona }).then(async (persona) => {
                    if (persona.error === 'error catch') {
                        message.error('Error de registro de persona');
                        return;
                    }
                    navigate(`/persona`);
                    message.success('Registro almacenado');
                });
            }
        })
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/persona');
    }

    const changeDate = (fnac) => {
        if (typeof fnac == 'object') {
            setFnacimiento(moment(fnac.$d).format('YYYY-MM-DD'));
            form.setFieldValue('nacimiento', moment(fnac.$d).format('YYYY-MM-DD'));
        } else {
            setFnacimiento(moment(fnac).format('YYYY-MM-DD'));
            form.setFieldValue('nacimiento', moment(fnac).format('YYYY-MM-DD'));
        }
    }

    const onChangePersona = (value) => {
        personas.map((element) => {
            if (element.idpersona === value) {
                setNombre(element.nombre);
                setApellido(element.apellido);
                setDocumento(element.documento);
                setContDocumento(true);
                setValueSexo(element.sexo);
                setDireccion(element.direccion);
                setTipo_doc(element.tipo_doc);
                setNacionalidad(element.nacionalidad);
                onChangeNacionalidad(element.nacionalidad);
                setCorreo(element.correo);
                setTelefono(element.telefono);
                setIdciudad(element.idciudad);
                setFnacimiento(element.nacimiento);
                setIdpersona(element.idpersona);

                form.setFieldValue('nombre', element.nombre);
                form.setFieldValue('apellido', element.apellido);
                form.setFieldValue('documento', element.documento);
                form.setFieldValue('sexo', element.sexo);
                form.setFieldValue('direccion', element.direccion);
                form.setFieldValue('nacionalidad', element.nacionalidad);
                form.setFieldValue('correo', element.correo);
                form.setFieldValue('telefono', element.telefono);
                form.setFieldValue('idciudad', element.idciudad);
                form.setFieldValue('idpersona', element.idpersona);
                form.setFieldValue('nacimiento', element.nacimiento);   
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
                <Titulos text={`FORMULARIO DE PERSONA`} level={3}></Titulos>
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
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Busqueda por documento</Divider>
                <Row style={{ marginBottom: `20px` }}>
                    {btn === false ?
                        <Col style={{ width: `100%` }}>
                            <Row>
                                <Form.Item id='buscadoc' style={{ width: `100%` }}>
                                    <Input placeholder='Documento de estudiante' value={sdocumento} onChange={(e) => setSDocumento(e.target.value)} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" onClick={btnBuscador}  >
                                    Buscar
                                </Button>
                            </Row>
                        </Col>
                        : <Col style={{ width: `100%` }}>
                            <Row>
                                <Form.Item id='busdoc1' n style={{ width: `100%` }}>
                                    <Input hidden disabled id='busdoc1' value={idpersona} />
                                    <Buscador id='busdoc1' label={'documento'} title={'Documento'} selected={idpersona} value={'idpersona'} data={personas} onChange={onChangePersona} onSearch={onSearch} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" onClick={btnClear} style={{ backgroundColor: `green` }} >
                                    Limpiar
                                </Button>
                            </Row>
                        </Col>
                    }
                </Row>
                {idpersona !== 0 && idpersona!==null ?
                    <Form.Item
                        label='Idpersona'
                        id='idpersona' >
                        <Input disabled value={idpersona} onChange={(e) => setIdpersona(e.target.value)} />
                    </Form.Item>
                    : null}
                <Form.Item label='Documento de identidad' id='documento' name="documento" rules={[{ required: true, message: 'Cargue numero de documento', },]}>
                    <Input placeholder='Documento de identidad' disabled={contDocumento} value={documento} onChange={(e) => setDocumento(e.target.value)} />
                </Form.Item>

                <Form.Item id='nombre'label='Nombre' rules={[{ required: true, message: 'Cargue nombre', },]}>
                    <Input name='nombre' placeholder='nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Form.Item>

                <Form.Item label='Apellido'rules={[{ required: true, message: 'Cargue apellido', },]}>
                    <Input placeholder='Apellido' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                </Form.Item>
                <Form.Item label='Correo' id='correo' type="mail" rules={[{ required: true, message: 'Cargue correo', },]}>
                    <Input placeholder='Correo' value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </Form.Item>
                <Form.Item label='Telefono' id='telefono' rules={[{ required: true, message: 'Cargue telefono', },]}>
                    <Input placeholder='Telefono' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </Form.Item>
                <Form.Item label='Dirección' id='direccion'  rules={[{ required: true, message: 'Cargue direccion', },]}>
                    <Input placeholder='Direccion' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Item>
                <Form.Item label='Fecha de nacimiento' id='nacimiento'rules={[{ required: true, message: 'Cargue fecha de nacimiento', },]} >
                    {nacimiento ?
                        <Input id='nacimiento' name="nacimiento" disabled value={nacimiento} />
                        : null}
                    <DatePicker
                        format="YYYY-MM-DD"
                        onChange={date => changeDate(date)}
                        style={{ width: '100%' }} placeholder={'Fecha de nacimiento'} />
                </Form.Item>

                <Form.Item label='Sexo' id='sexo' rules={[{ required: true, message: 'Seleccione sexo', },]}>
                    <Radio.Group
                        onChange={onChangeRadio}
                        id='sexo'
                        name='sexo'
                        value={valueSexo}>
                        <Radio value={'MA'}>Masculino</Radio>
                        <Radio value={'FE'}>Femenino</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='Tipo documento' id='tipod'  rules={[{ required: true, message: 'Seleccione tipo documento', },]}>
                    <Radio.Group
                        onChange={onChangeRadioTipoDoc}
                        id='tipod'
                        name='tipod'
                        value={tipo_doc}>
                        <Radio value={'CI'}>Cedula de identidad</Radio>
                        <Radio value={'DE'}>Documento Extranjero</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label='Nacionalidad'
                    id='nacionalidad'
                    rules={[{ required: true, message: 'Seleccione nacionalidad', },]}>
                    {nacionalidad ?
                        <Input id='nacionalidad' name='nacionalidad' disabled value={nacionalidad} />
                        : null}
                    <Buscador title={'Nacionalidad'} selected={nacionalidad} label={'label'} value={'value'} data={NACIONALIDAD} onChange={onChangeNacionalidad} onSearch={onSearch} />
                </Form.Item>
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

export default NuevoPersona;
