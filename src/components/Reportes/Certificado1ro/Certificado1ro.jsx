

import { useState, useEffect } from 'react'
import React from 'react';
import { Button, Form, Divider, Col, Row, message } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getAnhoLectivo } from '../../../services/AnhoLectivo';
import jsPDF from 'jspdf';
import TemplateCertificado1ro from './TemplateCertificado1ro';
import { useRef } from 'react';
import { getConvocatoria, getCert1ro } from '../../../services/Reportes';
import { getInscripcionConv } from '../../../services/Inscripcion';
import { Titulos } from '../../Utils/Titulos';

const dataEstado = [
    { estado: 'AC', descripcion: 'Activo' },
    { estado: 'IN', descripcion: 'Historico' },
]

function Acta({ token }) {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [fecha1, setFecha1] = useState(null);
    const [fecha2, setFecha2] = useState(null);
    const [estado, setEstado] = useState(null);
    const [idconvocatoria, setIdconvocatoria] = useState(null);
    const [convocatorias, setConvocatorias] = useState([]);
    const [banderabtn, setBanderaBtn] = useState(false);
    const reportTemplateRef = useRef(null);
    const [inscripciones, setInscripciones] = useState([]);
    const [idinscripcion, setIdnscripcion] = useState(null);
    const [estudiante, setEstudiante] = useState(null);

    const handleGeneratePdf = () => {
        const doc = new jsPDF({
            format: 'legal',
            unit: 'pt',
            precision:1,
            compressPdf: true,
            orientation:'l'
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

    const getLstInscripcion = async (idconvocatoria) => {
        let array = []
        const res = await getInscripcionConv({ token: token, param: idconvocatoria });
        res?.body?.map((inscripcion) => {
            inscripcion.datos = `${inscripcion.persona.nombre} ${inscripcion.persona.apellido} ${inscripcion.persona.documento}`;
            array.push(inscripcion);
            return true;
        })
        setInscripciones(array);
    }

    const onChangeInscripcion = async (idinscripcion) => {
        setBanderaBtn(false);
        setIdnscripcion(idinscripcion);
        await getUniqueCertCab(idinscripcion);
    };



    const getUniqueCertCab = async (idinscripcion) => {
        const res = await getCert1ro({ token: token, idinscripcion });
        //console.log(res?.body[0])
        setEstudiante(res?.body[0])
    }

    const getLstConvocatoria = async () => {
        let array = [];
        const res = await getConvocatoria({ token: token, anho1: fecha1 ?? 0, anho2: fecha2 ?? 0, estado: estado ?? 0 });
        res?.body?.map((conv) => {
            //conv.descripcion=conv.planificacion.curso.descripcion+' - '+conv.turno.descripcion;
            array.push(conv);
            return true;
        });
        //console.log(array)
        setConvocatorias(array);
    }


    const getLstAnhoLectivo = async () => {
        const res = await getAnhoLectivo({ token: token, param: 'get' });
        setData(res.body);
    }

    const onsearchbtn = async () => {
        if (!idconvocatoria) { message.warning('Seleccione una convocatoria'); return }
        if (!estudiante) { message.warning('Seleccione un estudiante'); return }
        setBanderaBtn(true);
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
        getLstInscripcion(value)
    };


    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`CERTIFICADO ENA`} level={3}></Titulos>
            </div>
            <Form
                name="basic"
                layout="vertical"
                style={{ textAlign: `center`, marginLeft: `15px` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
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
                            <Col style={{ minWidth: `25rem` }}>
                                {/*Aqui los estudiantes*/}
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Estudiante</Divider>
                                <Buscador title={'estudiante'} label={'datos'} selected={idinscripcion} value={'idinscripcion'} data={inscripciones} onChange={onChangeInscripcion} onSearch={onSearch} />
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
                    <TemplateCertificado1ro certificado={estudiante ?? null} />
                </div>
                :
                null
            }
        </div>
    );
}

export default Acta;