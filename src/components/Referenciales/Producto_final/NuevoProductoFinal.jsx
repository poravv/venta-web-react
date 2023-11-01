import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Divider } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { Row, Col, message, Radio } from 'antd';
import { IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';
import { getArticulo } from '../../../services/Articulo';
import { createProductoFinal } from '../../../services/ProductoFinal';
import { createReceta } from '../../../services/Receta';
import { Titulos } from '../../Utils/Titulos';
import UploadFile from '../../Utils/Upload';
import { agregarSeparadorMiles } from '../../Utils/separadorMiles';

function NuevoProductoFinal({ token }) {
    const [form] = Form.useForm();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [idproducto, setIdproducto] = useState('');
    const [articuloSelected, setArticuloSelected] = useState('');
    const [costo, setCosto] = useState(0);
    const [cantidad, setCantidad] = useState(0);
    const [tbl_articulos_tmp, setTblProductoFinalTmp] = useState([]);
    const [lstArticulo, setLstArticulo] = useState([]);
    const [valueTipoIva, setValueTipoIva] = useState(0);
    const [previewImage1, setPreviewImage1] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        getLstArticulo();
        // eslint-disable-next-line
    }, []);


    const getLstArticulo = async () => {
        const res = await getArticulo({ token: token, param: 'get' });
        setLstArticulo(res.body);
    }



    const guardaProducto = async (valores) => {
        //console.log(valores)
        return await createProductoFinal({ token: token, json: valores });
        //navigate('/producto_final');
    }

    const guardaReceta = async (valores) => {
        return await createReceta({ token: token, json: valores });
    }

    //procedimiento para guardar
    const gestionGuardado = async () => {
        //e.preventDefault();
        //Validaciones
        if (!previewImage1) { message.error('Debe cargar una imagen'); return; }
        if (tbl_articulos_tmp.length <= 0) { message.error('Cargue detalles'); return; }

        const json = {
            estado: 'AC',
            nombre: nombre,
            descripcion,
            costo,
            tipo_iva: valueTipoIva,
            img: previewImage1
        };

        guardaProducto(json).then((cabecera) => {
            //Guardado de receta
            //console.log('cabecera', cabecera)
            if (cabecera.estado !== 'error') {
                tbl_articulos_tmp.map((detproducto_final) => {
                    guardaReceta({
                        idproducto: detproducto_final.producto.idproducto,
                        receta_estado: 'AC',
                        idproducto_final: cabecera?.body?.idproducto_final,
                        estado: 'AC',
                        cantidad: detproducto_final.cantidad,
                    });
                    return true;
                });
                message.success(cabecera?.mensaje);
                navigate('/producto_final');
            } else {
                message.error(cabecera?.mensaje);
            }
        });

    }

    const agregarLista = async (e) => {
        e.preventDefault();
        //Validaciones
        //console.log(cantidad)
        let validExist = false;
        if (idproducto === 0 || idproducto === null || idproducto === '0' || idproducto === '') { message.error('Seleccione un articulo'); return; }
        if (cantidad === 0 || cantidad === null || cantidad === '0') { message.error('Cargue cantidad'); return; }

        tbl_articulos_tmp.map((inv) => {
            // eslint-disable-next-line
            if (inv?.producto?.idproducto == articuloSelected?.idproducto) { validExist = true; }
            return true;
        });


        if (validExist === false) {
            /*Tabla temporal*/
            const updtblProductoFinal = { cantidad: cantidad, producto: articuloSelected };
            /*Se va sumando los valores que se van cargando*/
            setTblProductoFinalTmp([...tbl_articulos_tmp, updtblProductoFinal])
            message.success('Agregado');
        } else {
            message.warning('Articulo ya existe');
        }
        validExist = false;
        form.setFieldValue('idproducto', 0);
        form.setFieldValue('cantidad', 0);
        setCantidad(0)
        setIdproducto(null)
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/producto_final');
    }


    const onChangeArticulo = (value) => {
        form.setFieldValue('idproducto', value);
        setIdproducto(value)
        setIdproducto(value)
        lstArticulo.map((element) => {
            if (element.idproducto === value) {
                setArticuloSelected(element)
            }
            return true;
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const extraerRegistro = async (e, id) => {
        e.preventDefault();
        //console.log('Datos: ',costo,monto_iva)
        const updtblProductoFinal = tbl_articulos_tmp.filter(inv => inv?.producto?.idproducto !== id);
        setTblProductoFinalTmp(updtblProductoFinal);
    };

    const onChangeRadio = (e) => {
        console.log('radio checked', e.target.value);
        setValueTipoIva(e.target.value);
    };

    return (
        <div>
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVA PRODUCCION`} level={3}></Titulos>
            </div>
            <Form
                initialValues={{ remember: true, }}
                onFinish={gestionGuardado}
                autoComplete="off"
                name="basic"
                layout="vertical"
                style={{ textAlign: `center`, margin: `15px` }}
                form={form} >
                <Divider orientation="center" type="horizontal" style={{ color: `#747E87` }}>Descripción</Divider>
                <Row >
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item label="Nombre" rules={[{ required: true, message: 'Cargue nombre', },]}>
                            <Input placeholder='Nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item label="Descripción" rules={[{ required: true, message: 'Cargue descripción', },]}>
                            <Input placeholder='Descripción' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item label="Costo" rules={[{ required: true, message: 'Cargue costo', },]}>
                            <Input type='number' placeholder='Costo' value={costo} onChange={(e) => setCosto(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item label='Tipo impuesto' id='tipoIva' name="tipoIva" rules={[{ required: true, message: 'Seleccione tipo de impuesto', },]}>
                            <Radio.Group
                                onChange={onChangeRadio}
                                id='tipoIva'
                                name='tipoIva'
                                value={valueTipoIva}>
                                <Radio value={0}>Excenta</Radio>
                                <Radio value={5}>5</Radio>
                                <Radio value={10}>10</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item label="Imagen" name="imagen" id='imagen' style={{ margin: `10px` }}  >
                            <UploadFile previewImage={previewImage1} setPreviewImage={setPreviewImage1} />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider orientation="center" type="horizontal" style={{ color: `#747E87`, marginLeft: `0px`, marginTop: `0px` }}>Artículos</Divider>
                <Row>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item
                            label='Articulo'
                            rules={[{ required: true, message: 'Seleccione articulo', },]}>
                            {idproducto ?
                                <Input id='idproducto' name='idproducto' disabled value={idproducto} />
                                : null}
                            <Buscador label={'descripcion'} title={'Articulo'} selected={idproducto} value={'idproducto'} data={lstArticulo} onChange={onChangeArticulo} onSearch={onSearch} />
                        </Form.Item>
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item label="Cantidad" name="cantidad" id="cantidad">
                            <Input type='number' placeholder='cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ justifyContent: `center` }}>
                    <Col style={{ marginBottom: `10px` }}>
                        <Button type="primary" htmlType="submit" onClick={(e) => agregarLista(e)} >
                            Agregar
                        </Button>
                    </Col>
                </Row>
                <Row style={{ alignItems: `center`, justifyContent: `center`, margin: `0px`, display: `flex` }}>
                    <Table style={{ backgroundColor: `white` }}>
                        <thead style={{ backgroundColor: `#03457F`, color: `white` }}>
                            <tr >
                                <th>Articulo</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbl_articulos_tmp.length !== 0 ? tbl_articulos_tmp.map(inv => (
                                <tr key={inv?.producto?.idproducto}>
                                    <td> {inv?.producto?.descripcion} </td>
                                    <td> {agregarSeparadorMiles(parseInt(inv?.producto?.precio))} </td>
                                    <td> {inv?.cantidad} </td>
                                    <td>
                                        <button onClick={(e) => extraerRegistro(e, inv?.producto?.idproducto)} className='btn btn-danger'><IoTrashOutline /></button>
                                    </td>
                                </tr>
                            )) : null
                            }
                        </tbody>
                    </Table>
                    <Col >
                        <Button type="primary" htmlType="submit" style={{ margin: `10px` }} >
                            Guardar
                        </Button>
                        <Button type="primary" htmlType="submit" onClick={btnCancelar}  >
                            Cancelar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default NuevoProductoFinal;