

import { useState, useEffect } from 'react'
import React from 'react';
import { Button, Form, Divider, Col, Row, message, Input } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getAnhoLectivo } from '../../../services/AnhoLectivo';
import { getInscripcionConv } from '../../../services/Inscripcion';
import jsPDF from 'jspdf';
import PBIPTemplate from './PBIPTemplate';
import { useRef } from 'react';
import { getCertCab, getEvaluacionesReporte, getConvocatoria } from '../../../services/Reportes';
import { createReportesEmitidos } from '../../../services/ReportesEmitidos';
import { Titulos } from '../../Utils/Titulos';

const dataEstado = [
    { estado: 'AC', descripcion: 'Activo' },
    { estado: 'IN', descripcion: 'Historico' },
]
let fechaActual = new Date();

function PBIP({ token }) {
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [inscripciones, setInscripciones] = useState([]);
    const [fecha1, setFecha1] = useState(null);
    const [fecha2, setFecha2] = useState(null);
    const [estado, setEstado] = useState(null);
    const [idinscripcion, setIdnscripcion] = useState(null);
    const [idconvocatoria, setIdconvocatoria] = useState(null);
    const [vencimiento, setVencimiento] = useState(null);
    const [cuerpo, setCuerpo] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [convocatorias, setConvocatorias] = useState([]);
    const [banderabtn, setBanderaBtn] = useState(false);
    const [certEst, setCertEst] = useState([]);
    const [evaluacionesDet, setEvaluacionesDet] = useState([]);
    const reportTemplateRef = useRef(null);

    const handleGeneratePdf = () => {
        const doc = new jsPDF({
            format: 'legal',
            unit: 'pt',
            precision: 1,
            compressPdf: true,
        });
        //doc.addImage(require('../../Utils/img/logoena.jpeg'),'PNG',0,0,doc.internal.pageSize.width,doc.internal.pageSize.height);
        
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

    const getUniqueCertCab = async (idinscripcion) => {
        const res = await getCertCab({ token: token, idinscripcion });
        setCertEst(res.body)
    }

    const getProceso = async (idconvocatoria, idinscripcion) => {
        const res = await getEvaluacionesReporte({ token: token, idconvocatoria, idinscripcion });
        setEvaluacionesDet(res.body)
    }

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

    const getLstInscripcion = async (idconvocatoria) => {
        let array = []
        const res = await getInscripcionConv({ token: token, param: idconvocatoria });
        res.body.map((inscripcion) => {
            inscripcion.datos = `${inscripcion.persona.nombre} ${inscripcion.persona.apellido} ${inscripcion.persona.documento}`;
            array.push(inscripcion);
            return true;
        })
        setInscripciones(array);
    }

    const onsearchbtn = async (e) => {
        //e.preventDefault();
        //console.log(certEst)
        if (certEst.length === 0) { message.warning('Verifique información seleccionada'); return; }
        if (idinscripcion) {
            setBanderaBtn(true);
            const datosJson = {
                tipo: 'CertEst',
                descripcion: 'Certificado de estudio',
                estado: 'AC',
                fecha: strFecha,
                idinscripcion: idinscripcion,
                idpersona: 0
            }
            guardaNumeracion(datosJson)
        } else {
            message.error('seleccione un estudiante');
            return false
        }
    }

    const guardaNumeracion = async (valores) => {
        return await createReportesEmitidos({ token: token, json: valores });
    }

    const onchangeanho1 = async (value) => {
        setBanderaBtn(false);
        setFecha2(null);
        setIdconvocatoria(null);
        setIdnscripcion(null);
        if (typeof value === 'undefined') {
            setFecha1(null);
        } else {
            setFecha1(value);
        }
        await getLstConvocatoria();
    };

    const onChangeInscripcion = async (idinscripcion) => {
        setBanderaBtn(false);
        await getUniqueCertCab(idinscripcion);
        await getProceso(idconvocatoria, idinscripcion);
        setIdnscripcion(idinscripcion);
    };

    const onchangeanho2 = async (value) => {
        setBanderaBtn(false);
        setIdconvocatoria(null);
        setIdnscripcion(null);
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
        setIdnscripcion(null);
        setConvocatorias([])
        setInscripciones([])
        if (typeof value === 'undefined') {
            setEstado(null);
        } else {
            setEstado(value);
        }
        //await getLstConvocatoria();
    };

    const onChangeConvocatoria = (value) => {
        setBanderaBtn(false);
        setIdnscripcion(null);
        setInscripciones([])
        setIdconvocatoria(value);
        getLstInscripcion(value)
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>

                <Titulos text={`CERTIFICADO`} level={3}></Titulos>
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
                            <Col style={{ minWidth: `25rem` }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Estado</Divider>
                                <Buscador label={'descripcion'} title={'Estado'} selected={estado} value={'estado'} data={dataEstado} onChange={onChangeEstado} onSearch={onSearch} />
                            </Col>

                            <Col style={{ minWidth: `25rem` }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Año lectivo desde</Divider>
                                <Buscador label={'anho'} title={'Año lectivo'} selected={fecha1} value={'idanho_lectivo'} data={data} onChange={onchangeanho1} onSearch={onSearch} />
                            </Col>
                            <Col style={{ minWidth: `25rem` }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Año lectivo hasta</Divider>
                                <Buscador label={'anho'} title={'Año lectivo'} selected={fecha2} value={'idanho_lectivo'} data={data} onChange={onchangeanho2} onSearch={onSearch} />
                            </Col>
                            <Col style={{ minWidth: `25rem` }}>
                                <>
                                    <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Convocatoria</Divider>
                                    <Buscador title={'convocatoria'} label={'descripcion'} selected={idconvocatoria} value={'idconvocatoria'} data={convocatorias} onChange={onChangeConvocatoria} onSearch={onSearch} />
                                </>
                            </Col>
                            <Col style={{ minWidth: `25rem` }}>
                                {/*Aqui los estudiantes*/}
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Estudiante</Divider>
                                <Buscador title={'estudiante'} label={'datos'} selected={idinscripcion} value={'idinscripcion'} data={inscripciones} onChange={onChangeInscripcion} onSearch={onSearch} />
                            </Col>
                            <Col style={{ minWidth: `25rem`, marginLeft: 2, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Vencimiento</Divider>
                                <Form.Item name="ven">
                                    <Input style={{ minWidth: `25rem` }} placeholder='Vencimiento' value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} />
                                </Form.Item>
                            </Col>

                            <Col style={{ minWidth: `25rem`, marginLeft: 2, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Cuerpo</Divider>
                                <Form.Item name="cuer" >
                                    <Input.TextArea style={{ minWidth: `25rem` }} placeholder='Cuerpo' value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </> : null

                }
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
            </Form>
            {banderabtn === true ?
                <div ref={reportTemplateRef} >
                    <PBIPTemplate cuerpo={cuerpo} vencimiento={vencimiento} certEst={certEst[0]} evaluacionesDet={evaluacionesDet} />
                </div>
                :
                null
            }
        </div>
    );
}



export default PBIP;