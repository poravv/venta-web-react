

import { useState, useEffect } from 'react'
import React from 'react';
import { Button, Form, Divider, Col, Row, message, Input } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getAnhoLectivo } from '../../../services/AnhoLectivo';
import jsPDF from 'jspdf';
import ResolucionENAModifTemplate from './ResolucionENAModifTemplate';
import { useRef } from 'react';
import { getConvocatoria, getestudiantes, getarescabena } from '../../../services/Reportes';
import { Titulos } from '../../Utils/Titulos';

const dataEstado = [{ estado: 'AC', descripcion: 'Activo' }, { estado: 'IN', descripcion: 'Historico' }]

function ResolucionENAModif({ token }) {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [fecha1, setFecha1] = useState(null);
    const [fecha2, setFecha2] = useState(null);
    const [estado, setEstado] = useState(null);
    const [idconvocatoria, setIdconvocatoria] = useState(null);
    const [convocatorias, setConvocatorias] = useState([]);
    const [banderabtn, setBanderaBtn] = useState(false);
    const [resolucion, setResolucionENAModif] = useState([]);
    const [list_estudiantes, setEvaluacionesDet] = useState([]);
    const [numero, setNumero] = useState(null);
    const [visto, setVisto] = useState(null);
    const [considerando, setConsiderando] = useState(null);
    const reportTemplateRef = useRef(null);

    const handleGeneratePdf = () => {
        const doc = new jsPDF({
            format: 'legal',
            unit: 'pt',
            //precision:1,
            compressPdf: true
        });

        doc.html(reportTemplateRef.current, {
            async callback(doc) {
                await doc.save('document');
            },
        });
    };

    useEffect(() => {
        getLstAnhoLectivo();
        // eslint-disable-next-line
    }, []);

    const getLstConvocatoria = async () => {
        let array = [];
        const res = await getConvocatoria({ token: token, anho1: fecha1 ?? 0, anho2: fecha2 ?? 0, estado: estado ?? 0 });
        res.body.map((conv) => {
            //conv.descripcion=conv.planificacion.curso.descripcion+' - '+conv.turno.descripcion;
            array.push(conv);
            return true;
        });
        setConvocatorias(array);
    }

    const getLstAnhoLectivo = async () => {
        const res = await getAnhoLectivo({ token: token, param: 'get' });
        //console.log(res.body);
        setData(res.body);
    }

    const onsearchbtn = async (e) => {
        //e.preventDefault();
        if (!list_estudiantes.length === 0) { message.warning('Verifique información seleccionada'); return }
        if (!idconvocatoria) { message.warning('Seleccione una convocatoria'); return }
        setBanderaBtn(true);
        BuscaEstudiantes();
    }

    const onchangeanho1 = async (value) => {
        setBanderaBtn(false);
        setFecha2(null);
        setIdconvocatoria(null);
        if (typeof value === 'undefined') {
            setFecha1(null);
        } else {
            setFecha1(value);
        }
        await getLstConvocatoria();
    };


    const onchangeanho2 = async (value) => {
        setBanderaBtn(false);
        setIdconvocatoria(null);
        if (typeof value === 'undefined') {
            setFecha2(null);
        } else {
            setFecha2(value);
        }
        await getLstConvocatoria();
    };

    const onChangeEstado = async (value) => {
        setBanderaBtn(false);
        setFecha1(null);
        setFecha2(null);
        setIdconvocatoria(null);
        setConvocatorias([])
        if (typeof value === 'undefined') {
            setEstado(null);
        } else {
            setEstado(value);
        }
        //await getLstConvocatoria();
    };


    const onChangeConvocatoria = (value) => {
        setBanderaBtn(false);
        setIdconvocatoria(value);
    };

    const BuscaEstudiantes = async () => {
        try {
            let array = [];
            await getestudiantes({ token: token, idconvocatoria: idconvocatoria }).then((res) => {
                res.body.map((rep) => {
                    array.push(rep);
                    return true;
                });
                console.log(array)
                setEvaluacionesDet(array);
            });

            await getarescabena({ token: token, idconvocatoria: idconvocatoria }).then((resultado) => {
                console.log(resultado.body);
                setResolucionENAModif(resultado.body)
            });
        } catch (error) {
            console.log(error)
        }
    }

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>

                <Titulos text={`Resolución ENA`} level={3}></Titulos>
            </div>
            <Form
                name="basic"
                layout="vertical"
                style={{ textAlign: `center`, marginLeft: `15px` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                //onFinish={create}
                //onFinishFailed={create}
                autoComplete="off"
                form={form} >
                {banderabtn === false ?
                    <>
                        <Row >
                            <Col style={{ minWidth: `25rem`, margin: 0, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Estado</Divider>
                                <Buscador label={'descripcion'} title={'Estado'} selected={estado} value={'estado'} data={dataEstado} onChange={onChangeEstado} onSearch={onSearch} />
                            </Col>
                            <Col style={{ minWidth: `25rem`, margin: 0, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Año lectivo desde</Divider>
                                <Buscador label={'anho'} title={'Año lectivo'} selected={fecha1} value={'idanho_lectivo'} data={data} onChange={onchangeanho1} onSearch={onSearch} />
                            </Col>
                            <Col style={{ minWidth: `25rem`, margin: 0, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Año lectivo hasta</Divider>
                                <Buscador label={'anho'} title={'Año lectivo'} selected={fecha2} value={'idanho_lectivo'} data={data} onChange={onchangeanho2} onSearch={onSearch} />
                            </Col>
                            <Col style={{ minWidth: `25rem`, margin: 0, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Convocatoria</Divider>
                                <Buscador title={'convocatoria'} label={'descripcion'} selected={idconvocatoria} value={'idconvocatoria'} data={convocatorias} onChange={onChangeConvocatoria} onSearch={onSearch} />
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ minWidth: `25rem`, marginLeft: 2, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>N° resolución</Divider>
                                <Form.Item name="res" rules={[{ required: true, message: 'Cargue numero de resolución', },]}>
                                    <Input style={{ minWidth: `25rem` }} placeholder='N° resolución' value={numero} onChange={(e) => setNumero(e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col style={{ minWidth: `25rem`, marginLeft: 2, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Visto</Divider>
                                <Form.Item name="vis" >
                                    <Input.TextArea style={{ minWidth: `25rem` }} placeholder='Visto' value={visto} onChange={(e) => setVisto(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ minWidth: `25rem` }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Considerando</Divider>
                                <Form.Item name="con" >
                                    <Input.TextArea style={{ minWidth: `25rem` }} placeholder='Considerando' value={considerando} onChange={(e) => setConsiderando(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </> : null
                }
                <Row style={{ justifyContent: `center` }}>
                    {(banderabtn === false) ?
                        <Form.Item
                            style={{ margin: `10px` }}>
                            <Button onClick={onsearchbtn} type="primary" htmlType="submit" style={{ margin: `10px` }} >
                                Generar reporte
                            </Button>
                        </Form.Item> :
                        <>
                            <div style={{ display: `flex`, justifyContent: `center` }}>
                                <Button onClick={handleGeneratePdf} type="primary" htmlType="submit" style={{ margin: `10px`, backgroundColor: `#02A52F` }} >
                                    Descargar
                                </Button>
                                <Button onClick={(e) => setBanderaBtn(false)} type="primary" htmlType="submit" style={{ margin: `10px` }} >
                                    Limpiar
                                </Button>
                            </div>
                        </>
                    }
                </Row>

            </Form>
            {banderabtn === true ?
                <div ref={reportTemplateRef} >
                    <ResolucionENAModifTemplate visto={visto} considerando={considerando} numero={numero} resolucion={resolucion[0]} list_estudiantes={list_estudiantes} />
                </div>
                :
                null
            }
        </div>
    );
}


export default ResolucionENAModif;