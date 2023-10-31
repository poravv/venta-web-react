

import { useState,useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, Row, Col, Divider, message } from 'antd';
import { createCargo, getCargos } from '../../../services/Cargo';
import { Titulos } from '../../Utils/Titulos';
import Buscador from '../../Utils/Buscador/Buscador';
import { getUniqiueAnhoLectivo } from '../../../services/AnhoLectivo';
import { getLikePersona } from '../../../services/Persona';

function NuevoCargoPersona({ token }) {
    const [form] = Form.useForm();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [documento, setDocumento] = useState(null);
    const [sdocumento, setSDocumento] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [idanho_lectivo, setIdAnhoLectivo] = useState();
    const [idpersona, setIdpersona] = useState(null);
    const [idcargos, setIdCargo] = useState(null);
    const [cargos, setCargos] = useState([]);
    const [btn, setBtn] = useState(false);

    useEffect(() => {
        getLstCargos();
        getAnhoLectivo();
        // eslint-disable-next-line
    }, []);

    const getAnhoLectivo = async () => {
        const res = await getUniqiueAnhoLectivo({ token: token });
        setIdAnhoLectivo(res.body[0].idanho_lectivo);
    }

    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        if (idpersona ===null || idpersona === 0) {
            message.warning('Seleccione una persona')
            return;
        };
        await createCargo({
            token: token, json:
            {
                estado: "AC",
                idpersona: idpersona,
                idanho_lectivo: idanho_lectivo,
                idcargos:idcargos,
            }
        }).then((resultado) => {
            if(resultado?.error){
                message.error('Error de guardado, verifique la existencia del cargo en estado activo')
            }
            navigate('/cargo');
        });
        
    }

    const getLstCargos = async () => {
        const res = await getCargos({ token: token, param: 'get' });
        setCargos(res.body);
    }

    const onChangeCargo = (value) => {
        setIdCargo(value)
        form.setFieldValue('idcargos', value);
        console.log(`selected ${value}`);
    };

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/cargo');
    }

    const onSearch = async (value) => {
        console.log('search:', value);
        //setSDocumento(value);
    };


    const btnClear = async (e) => {
        e.preventDefault();
        setBtn(false)
        setSDocumento(null)
        setPersonas([])
        //console.log('Elemento:', element);
        setNombre('');
        setApellido('');
        setDocumento(null);
        setIdpersona(null);
        form.setFieldValue('buscadoc', '');
        form.setFieldValue('nombre', '');
        form.setFieldValue('apellido', '');
        form.setFieldValue('documento', '');
        form.setFieldValue('idgrados_arma', '');
        form.setFieldValue('idpersona', '');
    }

    const getLstPersonas = async (valor) => {
        const res = await getLikePersona({ token: token, param: valor });
        setPersonas(res.body);
    }

    const btnBuscador = async (e) => {
        e.preventDefault();
        console.log(sdocumento)
        if (sdocumento === null) return;
        setBtn(true)
        await getLstPersonas(sdocumento);
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
                //changeDate(JSON.stringify(element.fnacimiento));
                form.setFieldValue('nombre', element.nombre);
                form.setFieldValue('apellido', element.apellido);
                form.setFieldValue('documento', element.documento);
                form.setFieldValue('idgrados_arma', element.idgrados_arma);
                form.setFieldValue('idpersona', element.idpersona);
                return true;
            } else {
                return false;
            }
        });
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVO CARGO PERSONA`} level={3}></Titulos>
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
                                <Form.Item id='buscadoc' name="buscadoc" style={{ width: `100%` }}>
                                    <Input placeholder='Documento' value={sdocumento} onChange={(e) => setSDocumento(e.target.value)} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" onClick={btnBuscador}  >
                                    Buscar
                                </Button>
                            </Row>
                        </Col>
                        : <Col style={{ width: `100%` }}>
                            <Row>
                                <Form.Item id='busdoc1' name="busdoc1" style={{ width: `100%` }}>
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
                {idpersona !== 0 && idpersona !== null ?
                    <>
                        <Form.Item
                            label='Idpersona'
                            id='idpersona' name="idpersona" >
                            <Input disabled value={idpersona} onChange={(e) => setIdpersona(e.target.value)} />
                        </Form.Item>
                        <Form.Item label='Documento de identidad' id='documento' name="documento" rules={[{ required: true, message: 'Cargue numero de documento', },]}>
                            <Input disabled placeholder='Documento de identidad' value={documento} onChange={(e) => setDocumento(e.target.value)} />
                        </Form.Item>

                        <Form.Item id='nombre' name="nombre" label='Nombre' rules={[{ required: true, message: 'Cargue nombre', },]}>
                            <Input disabled placeholder='nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </Form.Item>

                        <Form.Item label='Apellido' name="apellido" rules={[{ required: true, message: 'Cargue apellido', },]}>
                            <Input disabled placeholder='Apellido' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                        </Form.Item>
                    </>
                    : null}

                <Form.Item
                    label='Cargo'
                    id='idcargos'
                    name="idcargos"
                    rules={[{ required: true, message: 'Seleccione cargo', },]}>
                    {idcargos ?
                        <Input id='idcargos' name='idcargos' disabled value={idcargos} />
                        : null}
                    <Buscador title={'Cargo'} selected={idcargos} label={'descripcion'} value={'idcargos'} data={cargos} onChange={onChangeCargo} onSearch={onSearch} />
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

export default NuevoCargoPersona;

/*

                

*/