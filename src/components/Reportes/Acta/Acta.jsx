

import { useState, useEffect } from 'react'
import React from 'react';
import { Button, Form, Divider, Col, Row, message } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getAnhoLectivo } from '../../../services/AnhoLectivo';
import { getMatCnv } from '../../../services/Materia';
import jsPDF from 'jspdf';
import ActaTemplate from './ActaTemplate';
import { useRef } from 'react';
import { getConvocatoria, getevalmat, getactacab } from '../../../services/Reportes';
import { Titulos } from '../../Utils/Titulos';

const dataEstado = [
    { estado: 'AC', descripcion: 'Activo' },
    { estado: 'IN', descripcion: 'Historico' },
]

const dataTipo = [
    { tipo: 'Ordinario', descripcion: 'Ordinario' },
    { tipo: 'Complementario', descripcion: 'Complementario' },
]

function Acta({ token }) {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [fecha1, setFecha1] = useState(null);
    const [fecha2, setFecha2] = useState(null);
    const [estado, setEstado] = useState(null);
    const [tipo, setTipo] = useState(null);
    const [materias, setMaterias] = useState([]);
    const [idmateria, setIdmateria] = useState(null);
    const [idconvocatoria, setIdconvocatoria] = useState(null);
    const [convocatorias, setConvocatorias] = useState([]);
    const [banderabtn, setBanderaBtn] = useState(false);
    const [acta, setActa] = useState([]);
    const [evaluacionesDet, setEvaluacionesDet] = useState([]);
    const reportTemplateRef = useRef(null);

    const handleGeneratePdf = () => {
        const doc = new jsPDF({
            format: 'letter',
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

    const getLstMateria = async (idconvocatoria) => {
        const res = await getMatCnv({ token: token, idconvocatoria: idconvocatoria });
        //console.log(res.body)
        setMaterias(res.body);
    }

    const getLstAnhoLectivo = async () => {
        const res = await getAnhoLectivo({ token: token, param: 'get' });
        //console.log(res.body);
        setData(res.body);
    }

    const onsearchbtn = async (e) => {
        //e.preventDefault();
        if(!evaluacionesDet.length===0){message.warning('Verifique información seleccionada'); return}
        if (!idconvocatoria) { message.warning('Seleccione una convocatoria'); return }
        if (!idmateria) { message.warning('Seleccione un materia'); return }
        setBanderaBtn(true);
        buscaReporteMateria();
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
        setIdmateria(null);
        setMaterias([])
        setConvocatorias([])
        setTipo(null)
        if (typeof value === 'undefined') {
            setEstado(null);
        } else {
            setEstado(value);
        }
        //await getLstConvocatoria();
    };

    const onChangeTipo = async (value) => {
        setBanderaBtn(false);
        setFecha1(null);
        setFecha2(null);
        setIdmateria(null);
        setIdconvocatoria(null);
        setMaterias([])
        //setConvocatorias([])
        if (typeof value === 'undefined') {
            setTipo(null);
        } else {
            setTipo(value);
        }
        //await getLstConvocatoria();
    };

    const onChangeConvocatoria = (value) => {
        setBanderaBtn(false);
        setIdconvocatoria(value);
        getLstMateria(value)
    };

    const buscaReporteMateria = async () => {
        //Para reporte por materia
        try {
            let array = [];
            console.log(idconvocatoria, idmateria, tipo);
            await getevalmat({ token: token, idconvocatoria: idconvocatoria, idmateria: idmateria, tipo: tipo }).then((res) => {
                res.body.map((rep) => {
                    //delete rep.idinstructor;
                    if (rep.tipo === tipo) {
                        array.push(rep);
                    }
                    return true;
                });
                console.log(array)
                setEvaluacionesDet(array);
            });

            await getactacab({ token: token, idconvocatoria: idconvocatoria, idmateria: idmateria }).then((resultado) => {
                console.log(resultado.body);
                setActa(resultado.body)
            });
        } catch (error) {
            console.log(error)
        }
    }

    const onChangeMaterias = (value) => {
        setIdmateria(value)
        setBanderaBtn(false);
        setEvaluacionesDet([])
        setActa([])
        //console.log(Miles(1))
        //buscaReporteMateria();
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>

                <Titulos text={`ACTA`} level={3}></Titulos>
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
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Tipo</Divider>
                                <Buscador label={'descripcion'} title={'Tipo'} selected={tipo} value={'tipo'} data={dataTipo} onChange={onChangeTipo} onSearch={onSearch} />
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
                            {/*Aqui las materias*/}
                            <Col style={{ minWidth: `25rem`, margin: 0, }}>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Materia</Divider>
                                <Buscador title={'Seleccione materia'} label={'materia'} selected={idmateria} value={'idmateria'} data={materias} onChange={onChangeMaterias} onSearch={onSearch} />
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
                    <ActaTemplate acta={acta[0]} evaluacionesDet={evaluacionesDet} />
                </div>
                :
                null
            }
        </div>
    );
}



export default Acta;