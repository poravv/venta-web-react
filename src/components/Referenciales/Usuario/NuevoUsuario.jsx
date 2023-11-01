

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, Radio, Divider, message, Row, Col } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getLikePersona } from '../../../services/Persona';
import { getSucursal } from '../../../services/Sucursal';
import { createUsuario, getUsuario } from '../../../services/Usuario';
import { Titulos } from '../../Utils/Titulos';


function NuevoUsuario({ token }) {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [idsucursal, setIdSucursal] = useState(null);
    const [documento, setDocumento] = useState(null);
    const [sucursalSelect, setSucursalSelect] = useState();
    const [personas, setPersonas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [idpersona, setIdpersona] = useState(null);
    const [nick, setNick] = useState(0);
    const [nivel, setNivel] = useState(0);
    const [btn, setBtn] = useState(false);
    const [sdocumento, setSDocumento] = useState('');


    useEffect(() => {
        getLstPersonas();
        getLstUsuario();
        getLstSucursales();
        // eslint-disable-next-line
    }, []);

    const getLstUsuario = async () => {
        const res = await getUsuario({ token: token });
        //console.log(res.body)
        setData(res.body);
    }

    const getLstPersonas = async (valor) => {
        const res = await getLikePersona({ token: token, param: valor });
        setPersonas(res.body);
    }

    const getLstSucursales = async () => {
        const res = await getSucursal({ token: token, param: 'get' });
        setSucursales(res.body);
    }

    const navigate = useNavigate();

    const btnBuscador = async (e) => {
        e.preventDefault();
        if(sdocumento<=0){ message.warning('intruduzca documento valido'); return;}
        setBtn(true)
        await getLstPersonas(sdocumento);
    }

    const btnClear = async (e) => {
        e.preventDefault();
        setBtn(false)
        setSDocumento('')
        setPersonas([])
        //console.log('Elemento:', element);
        setNombre('');
        setApellido('');
        setDocumento('');
        setIdpersona(0);
        setSucursalSelect()

        form.setFieldValue('buscadoc', '');
        form.setFieldValue('nombre', '');
        form.setFieldValue('apellido', '');
        form.setFieldValue('documento', '');
        form.setFieldValue('idpersona', '');
        form.setFieldValue('escuela', '');
    }



    //procedimiento para crear registro
    const create = async (e) => {
        //e.preventDefault();
        let saveusuario;
        let valid = true;
        console.log(idsucursal,'',idpersona)

        data.map((usu) => {
            if (usu.idpersona === idpersona && usu.nivel === nivel && usu.idsucursal === sucursalSelect.idsucursal) {
                valid = false;
            }
            return true;
        });

        if (valid) {
            saveusuario = {
                nick: nick,
                nivel: nivel,
                password: `${documento}`,
                estado: 'AC',
                idpersona: idpersona,
                idsucursal: idsucursal
            }
            await createUsuario({ token: token, json: saveusuario });
            navigate(`/usuario`);
            message.success('Registro almacenado');
        } else {
            message.error('Ya posee usuario con este nivel en esta sucursal');
        }
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate(`/usuario`);
    }

    const onChangePersona = (value) => {
        //console.log(value)
        personas.map((element) => {
            if (element.idpersona === value) {
                //console.log('Elemento:', element);
                setNombre(element.nombre);
                setApellido(element.apellido);
                setDocumento(element.documento);
                setIdpersona(element.idpersona);
                form.setFieldValue('nombre', element.nombre);
                form.setFieldValue('apellido', element.apellido);
                form.setFieldValue('documento', element.documento);
                form.setFieldValue('idpersona', element.idpersona);
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const onchangenivel = (e) => {
        //console.log('radio checked', e.target.value);
        setNivel(e.target.value);
    };

    const onchangeSucursal = (value) => {
        //console.log(value)
        form.setFieldValue('escuela', value);
        setIdSucursal(value)

        sucursales.map((element) => {
            
            if (element.idsucursal === value) {
                setSucursalSelect(element)
            }
            return true;
        });
    };
    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVO USUARIO`} level={3}></Titulos>
            </div>
            <Form
                name="basic"
                layout="vertical"
                style={{ textAlign: `center`, marginLeft: `10px` }}
                labelCol={{ span: 10, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                //onFinishFailed={create}
                autoComplete="off"
                form={form} >
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Busqueda de documento</Divider>
                <Row style={{ marginBottom: `20px` }}>
                    {btn === false ?
                        <Col style={{ width: `500px` }}>
                            <Form.Item id='buscadoc' name="buscadoc">
                                <Input id='buscadoc' name='buscadoc' placeholder='Documento persona' value={sdocumento} onChange={(e) => setSDocumento(e.target.value)} />
                            </Form.Item>
                        </Col>
                        : <Col style={{ width: `500px` }}>
                            <Buscador label={'documento'} title={'Documento'} selected={idpersona} value={'idpersona'} data={personas} onChange={onChangePersona} onSearch={onSearch} />
                        </Col>
                    }
                    <Col>
                        <Button type="primary" htmlType="submit" onClick={btnBuscador}  >
                            Buscar
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit" onClick={btnClear} style={{ marginLeft: `10px` }} >
                            Limpiar
                        </Button>
                    </Col>
                </Row>
                {idpersona !== 0 && idpersona!==null?
                    <Form.Item
                        label='idpersona'
                        id='idpersona' 
                        name="idpersona" >
                        <Input name='idpersona' id='idpersona' disabled value={idpersona} onChange={(e) => setIdpersona(e.target.value)} />
                    </Form.Item>
                    : null}
                {(documento !== '' && documento!==null) ?
                    <Form.Item label='Documento de identidad' id='documento' name="documento" rules={[{ required: true, message: 'Cargue documento', },]}>
                        <Input id='documento' name='documento' placeholder='Documento de identidad' disabled value={documento} onChange={(e) => setDocumento(e.target.value)} />
                    </Form.Item>
                    : null}
                {nombre !== '' ?
                    <Form.Item
                        id='nombre'
                        name="nombre"
                        label='Nombre'
                        rules={[{ required: true, message: 'Cargue nombre', },]}>
                        <Input id='nombre' name='nombre' placeholder='nombre' disabled value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </Form.Item>
                    : null}
                {apellido !== '' ?
                    <Form.Item label='Apellido' name="apellido" id='apellido' rules={[{ required: true, message: 'Cargue apellido', },]}>
                        <Input id='apellido' name='apellido' placeholder='Apellido' disabled value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    </Form.Item> : null}
                <Form.Item label='Usuario' id='usuario' name="usuario" rules={[{ required: true, message: 'Cargue nombre de usuario', },]}>
                    <Input id='usuario' name='usuario' placeholder='Usuario' value={nick} onChange={(e) => setNick(e.target.value)} />
                </Form.Item>

                <Form.Item label='Sucursal' id='escuela' name="escuela" rules={[{ required: true, message: 'Cargue escuela', },]}>
                    {idsucursal ? 
                    <Input id='escuela' name='escuela' disabled value={idsucursal} />
                    :null}
                    <Buscador label={'descripcion'} title={'Sucursal'} selected={idsucursal} value={'idsucursal'} data={sucursales} onChange={onchangeSucursal} onSearch={onSearch} />
                </Form.Item>


                <Form.Item label='Nivel' id='nivel' name="nivel" rules={[{ required: true, message: 'Seleccione nivel', },]}>
                <Radio.Group onChange={onchangenivel} value={nivel} id='nivel' name='nivel'>
                        <Radio value={0}>Root</Radio>
                        <Radio value={1}>Sys Admin</Radio>
                        <Radio value={2}>Vendedor</Radio>
                        <Radio value={3}>Administrador</Radio>
                        {/*<Radio value={4}>Estudiante</Radio>*/}
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    id='btn'
                    name='btn'
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

export default NuevoUsuario;

