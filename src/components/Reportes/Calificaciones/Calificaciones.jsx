

import { useState, useEffect } from 'react'
import React from 'react';
import { Button, Form, Divider, Col, Row, message } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getConvocatoria, getReporteGral, getReporteMat } from '../../../services/Reportes';
import { getAnhoLectivo } from '../../../services/AnhoLectivo';
import { getMatCnv } from '../../../services/Materia';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Titulos } from '../../Utils/Titulos';

const dataTipo = [
    { id: 1, descripcion: 'Reporte General' },
    { id: 2, descripcion: 'Reporte por materia' },
]

const dataEstado = [
    { estado: 'AC', descripcion: 'Activo' },
    { estado: 'AN', descripcion: 'Inactivo' },
]

function ReporteCalificaciones({ token }) {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [idmateria, setIdmateria] = useState(null);
    const [fecha1, setFecha1] = useState(null);
    const [fecha2, setFecha2] = useState(null);
    const [estado, setEstado] = useState(null);
    const [idtipo, setIdtipo] = useState(null);
    const [idconvocatoria, setIdConvocatoria] = useState(null);
    const [descripcionMateria, setDescripcionMateria] = useState('');
    const [descripcionConvocatoria, setDescripcionConvocatoria] = useState('');
    const [convocatorias, setConvocatorias] = useState([]);
    const [banderabtn, setBanderaBtn] = useState(false);

    let array = [];

    useEffect(() => {
        getLstAnhoLectivo();
        // eslint-disable-next-line
    }, []);

    const getLstConvocatoria = async () => {
        let arreglo = [];
        console.log(fecha1 ?? 0, fecha2 ?? 0, estado ?? 0)
        const res = await getConvocatoria({ token: token, anho1: fecha1 ?? 0, anho2: fecha2 ?? 0, estado: estado ?? 0 });
        res?.body?.map((conv) => {
            arreglo.push(conv);
            return true;
        });
        setConvocatorias(arreglo);
    }

    const getLstAnhoLectivo = async () => {
        const res = await getAnhoLectivo({ token: token, param: 'get' });
        setData(res.body);
    }

    const getLstMateria = async (idconvocatoria) => {
        const res = await getMatCnv({ token: token, idconvocatoria: idconvocatoria });
        //console.log(res.body)
        setMaterias(res.body);
    }

    const create = async (e) => {
        array = [];
        if (idtipo === 1) {
            try {
                const res = await getReporteGral({ token: token, idconvocatoria: idconvocatoria });
                console.log(res.body)
                res?.body?.map((rep) => {
                    delete rep.idconvocatoria;
                    delete rep.idinscripcion;
                    delete rep.idpersona;
                    delete rep.anho;
                    //delete rep.tipo;
                    if (rep.columna1 === null) { delete rep.columna1 }
                    if (rep.columna2 === null) { delete rep.columna2 }
                    if (rep.columna3 === null) { delete rep.columna3 }
                    if (rep.columna4 === null) { delete rep.columna4 }
                    if (rep.columna5 === null) { delete rep.columna5 }
                    if (rep.columna6 === null) { delete rep.columna6 }
                    if (rep.columna7 === null) { delete rep.columna7 }
                    if (rep.columna8 === null) { delete rep.columna8 }
                    if (rep.columna9 === null) { delete rep.columna9 }
                    if (rep.columna10 === null) { delete rep.columna10 }
                    if (rep.columna11 === null) { delete rep.columna11 }
                    if (rep.columna12 === null) { delete rep.columna12 }
                    if (rep.columna13 === null) { delete rep.columna13 }
                    if (rep.columna14 === null) { delete rep.columna14 }
                    if (rep.columna15 === null) { delete rep.columna15 }
                    if (rep.columna16 === null) { delete rep.columna16 }
                    if (rep.columna17 === null) { delete rep.columna17 }
                    if (rep.columna18 === null) { delete rep.columna18 }
                    if (rep.columna19 === null) { delete rep.columna19 }
                    array.push(rep);
                    return true;
                });

                const merge = [
                    {
                        s: {
                            r: 0, c: 0,
                        }, e: { r: 0, c: 10 },
                    },/*{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }*/
                ];
                const headerTitle = `${descripcionConvocatoria}`;
                var wb = XLSX.utils.book_new();
                var ws = XLSX.utils.json_to_sheet([{}], {
                    header: [headerTitle],//origin:'A1:P1'
                });
                ws["!merges"] = merge;
                /*XLSX.utils.sheet_add_aoa(ws, [
                    ["NUMERO", "NOMBRE", "APELLIDO", "DOCUMENTO", "CONTENIDO O PRUEBAS PARCIALES TAREA 20%", "TRABAJO PRÁCTICO 20%", "EXPOSICION 20%", "CALIFICACIÓN TOTAL 60%", "CALIFICACIÓN FINAL EXÁMEN ORDINARIO 40%", "CALIFICACIÓN FINAL 100%", "CALIFICACIÓN FINAL EXÁMEN COMPLEMETARIO 70%", "CALIFICACIÓN FINAL EXÁMEN EXTRAORDINARIO 70%", "CALIFICACIÓN FINAL", "MENCION"]
                    ], { origin: "A2" });*/
                XLSX.utils.sheet_add_json(ws, array, {
                    origin: 'A2', skipHeader: true
                });
                XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
                XLSX.utils.sheet_add_aoa(ws, [["Created " + new Date().toISOString()]], { origin: -1 });
                XLSX.writeFile(wb, 'Reporte General.xlsx')
            } catch (error) {
                console.log(error)
            }
        } else if (idtipo === 2) {
            //Para reporte por materia
            if (!idconvocatoria) { message.error('seleccione una convocatoria'); return }
            if (!idmateria) { message.error('seleccione un materia'); return }

            try {
                let descCurso = '', descTurno = '';
                const res = await getReporteMat({ token: token, idconvocatoria: idconvocatoria, idmateria: idmateria });
                //console.log(res.body);
                res?.body?.map((rep) => {
                    descCurso = rep.curso;
                    descTurno = rep.turno;
                    delete rep.idinstructor;
                    delete rep.descripcion;
                    delete rep.idusuario;
                    delete rep.idturno;
                    delete rep.idmateria;
                    delete rep.idinscripcion;
                    delete rep.idpersona;
                    delete rep.idconvocatoria;
                    delete rep.anho;
                    delete rep.curso;
                    delete rep.turno;
                    array.push(rep);
                    return true;
                });

                const headerTitle = `${descripcionMateria} / ${descCurso} / ${descTurno}`;

                const sheet = XLSX.utils.json_to_sheet([{}], {
                    header: [headerTitle],//origin:'A1:P1'
                });


                sheet['A1'].s = {
                    font: {
                        name: 'arial',
                        sz: 24,
                        bold: true,
                        color: "FFFFAA00"
                    },
                }
                //s = Inicio, e = Fin, r = Fila & c = Columna
                const merge = [
                    {
                        s: {
                            r: 0, c: 0,
                        }, e: { r: 0, c: 13 },
                    },/*{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }*/
                ];
                sheet["!merges"] = merge;
                var wbrm = XLSX.utils.book_new();
                XLSX.utils.sheet_add_aoa(sheet, [
                    ["NUMERO", "GRADOS", "ARMAS", "NOMBRE", "APELLIDO", "DOCUMENTO", "CONTENIDO O PRUEBAS PARCIALES TAREA 20%", "TRABAJO PRÁCTICO 20%", "EXPOSICION 20%", "CALIFICACIÓN TOTAL 60%", "CALIFICACIÓN FINAL EXÁMEN ORDINARIO 40%", "CALIFICACIÓN FINAL 100%", "CALIFICACIÓN FINAL EXÁMEN COMPLEMETARIO 70%", "CALIFICACIÓN FINAL EXÁMEN EXTRAORDINARIO 70%", "CALIFICACIÓN FINAL", "MENCION"]
                ], { origin: "A2" });
                XLSX.utils.sheet_add_json(sheet, res.body, {
                    origin: 'A3', skipHeader: true
                });
                XLSX.utils.book_append_sheet(wbrm, sheet);
                XLSX.utils.sheet_add_aoa(wbrm, [["Created " + new Date().toISOString()]], { origin: -1 });
                XLSX.writeFile(wbrm, 'ReporteMateria.xlsx');
            } catch (error) {
                console.log(error)
            }
        }
    }

    const onsearchbtn = async (e) => {
        if (!idconvocatoria) { message.warning('Verifique información seleccionada'); return }
        if (!idmateria&&idtipo===2) { message.warning('Seleccione un materia'); return }
        setBanderaBtn(true);
    }

    const onChangeTipoReporte = async (value) => {
        setBanderaBtn(false);
        setIdtipo(value);
        setEstado(null);
        setFecha1(null);
        setFecha2(null);
        setIdConvocatoria(null)
        await getLstConvocatoria();
    };

    const onchangeanho1 = async (value) => {
        setBanderaBtn(false);
        setFecha2(null)
        if (typeof value === 'undefined') {
            setFecha1(null);
        } else {
            setFecha1(value);
        }
        await getLstConvocatoria();
    };

    const onchangeanho2 = async (value) => {
        console.log(value)
        setBanderaBtn(false);

        if (typeof value === 'undefined') {
            setFecha2(null);
        } else {
            setFecha2(value);
        }
        await getLstConvocatoria();
    };



    const onChangeEstado = async (value) => {
        //console.log(value)
        setBanderaBtn(false);
        setFecha1(null);
        setFecha2(null);
        if (typeof value === 'undefined') {
            setEstado(null);

        } else {
            setEstado(value);
        }
        await getLstConvocatoria();
    };

    const onChangeConvocatoria = (value) => {
        setIdConvocatoria(value)
        setBanderaBtn(false);
        form.setFieldValue('idconvocatoria', value);
        //console.log(`selected ${value}`);
        //El tipo de reporte
        convocatorias.map((cnv) => {
            if (cnv.idconvocatoria === value) {
                setDescripcionConvocatoria(cnv.descripcion)
            }
            return true;
        })

        if (idtipo === 2) {
            getLstMateria(value);
        }
    };

    const onChangeMaterias = (value) => {
        setIdmateria(value)
        setBanderaBtn(false);
        materias.map((materia) => {
            if (materia.idmateria === value) {
                setDescripcionMateria(materia.materia)
            }
            return true;
        })
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div>
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`REPORTE CALIFICACIONES`} level={3}></Titulos>
            </div>
            <Form
                name="basic"
                id="bacic"
                layout="vertical"
                style={{ textAlign: `center`, marginLeft: `15px` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                //initialValues={{ remember: false, }}
                //onFinish={create}
                //autoComplete="off"
                form={form} >
                
                <Row>
                    <Col style={{ minWidth: `25rem`, }}>
                    <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Tipo</Divider>
                        <Buscador label={'descripcion'} title={'Tipo de reporte'} value={'id'} selected={idtipo} data={dataTipo} onChange={onChangeTipoReporte} onSearch={onSearch} />
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                    <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Estado</Divider>
                        <Buscador id='estado' label={'descripcion'} title={'Estado'} value={'estado'} selected={estado} data={dataEstado} onChange={onChangeEstado} onSearch={onSearch} />
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Año lectivo desde</Divider>
                        {/*Año lectivo*/}
                        <Buscador id='anho1' label={'anho'} title={'Año lectivo'} selected={fecha1} value={'idanho_lectivo'} data={data} onChange={onchangeanho1} onSearch={onSearch} />
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                    <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Año lectivo hasta</Divider>
                        <Buscador id='anho2' label={'anho'} title={'Año lectivo'} selected={fecha2} value={'idanho_lectivo'} data={data} onChange={onchangeanho2} onSearch={onSearch} />
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Convocatoria</Divider>
                        <Buscador title={'convocatoria'} label={'descripcion'} selected={idconvocatoria} value={'idconvocatoria'} data={convocatorias} onChange={onChangeConvocatoria} onSearch={onSearch} />
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        {/*Aqui las materias*/}
                        {idtipo === 2 ?
                            <>
                                <Divider orientation="center" type="horizontal" style={{ color: `#7CC1FE` }}>Materia</Divider>
                                <Buscador title={'Seleccione materia'} label={'materia'} selected={idmateria} value={'idmateria'} data={materias} onChange={onChangeMaterias} onSearch={onSearch} />
                            </> : null}
                    </Col>
                </Row>

                {(banderabtn === false) ?
                    <Form.Item
                        style={{ margin: `10px` }}>
                        <Button onClick={onsearchbtn} type="primary" htmlType="submit" style={{ margin: `10px` }} >
                            Generar reporte
                        </Button>
                    </Form.Item> :
                    <Form.Item
                        style={{ margin: `10px` }}>
                        <Button onClick={create} type="primary" htmlType="submit" style={{ margin: `10px`, backgroundColor: `#02A52F` }} >
                            -- Descargar --
                        </Button>
                    </Form.Item>
                }
            </Form>
        </div>
    );
}
export default ReporteCalificaciones;