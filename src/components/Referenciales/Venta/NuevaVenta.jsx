import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Divider, Popconfirm, Checkbox } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { Row, Col, message, Modal } from 'antd';
import { IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';
import { getProductoVenta } from '../../../services/ProductoFinal';
import { getCliente } from '../../../services/Cliente';
import { createVenta, createVentaDet, operacionVenta } from '../../../services/Venta';
import { Titulos } from '../../Utils/Titulos';
import { agregarSeparadorMiles } from '../../Utils/separadorMiles';
import { generaTicket } from '../../Reportes/Ticket/ExportTicketPdf';
let fechaActual = new Date();

function NuevoVenta({ token }) {
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [form] = Form.useForm();
    const [idproducto_final, setIdproducto_final] = useState();
    const [producto_finalSelected, setProductoFinalSelected] = useState(null);
    const [clienteSelected, setClienteSelected] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const [tblventatmp, setTblVentaTmp] = useState([]);
    const [lstProductoFinal, setLstProductoFinal] = useState([]);
    const [lstCliente, setLstCliente] = useState([]);
    const [total, setTotal] = useState(0);
    const [idcliente, setIdcliente] = useState(null);
    const [totalIva, setTotalIva] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [vuelto, setVuelto] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkTicket, setCheckTicket] = useState(false);


    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCheckTicket = (e) => {
        //console.log(`checked = ${e.target.checked}`);
        setCheckTicket(e.target.checked)
    };

    const navigate = useNavigate();

    useEffect(() => {
        getLstProductoFinal();
        getLstClientes()
        // eslint-disable-next-line
    }, []);

    const onchangeCobro = (e) => {
        //.target.value
        setVuelto(parseInt(e.target.value) - parseInt(total))
    }


    const ventanaCobro = () => {
        return (
            <Modal
                title="Cobro"
                open={isModalOpen}
                onOk={gestionGuardado}
                onCancel={handleCancel}>
                <Form layout="vertical">
                    <Row>
                        <Checkbox onChange={handleCheckTicket}>Imprimir ticket</Checkbox>
                    </Row>
                    <Row style={{ textAlign: `center`, justifyContent: `center` }}>
                        <Col>
                            <Form.Item label='Monto a cobrar'>
                                <Input disabled value={agregarSeparadorMiles(parseInt(total))} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `2rem` }}>
                            <Form.Item
                                label='Monto dinero'>
                                <Input type='number' onChange={(e) => onchangeCobro(e)} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ textAlign: `center`, justifyContent: `center` }}>
                        <Col style={{ marginLeft: `2rem` }}>
                            <p style={{ color: `red`, fontSize: `30px` }}>Vuelto= {agregarSeparadorMiles(parseInt(vuelto))}</p>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }

    const getLstProductoFinal = async () => {
        const array = [];
        const res = await getProductoVenta({ token: token, param: 'get' });
        res?.body?.map((prod) => {
            prod.monto_iva = ((parseInt(prod.tipo_iva) * parseInt(prod.costo)) / 100);
            array.push(prod)
            return true;
        })
        setLstProductoFinal(array);
    }

    const getLstClientes = async () => {
        const array = [];
        const res = await getCliente({ token: token, param: 'get' });
        res?.body?.map((cli) => {
            cli.descripcion = (cli.razon_social + ' / ' + cli.ruc);
            array.push(cli)
            return true;
        });
        setLstCliente(array);
    }


    const guardaVentaCab = async (valores) => {
        return await createVenta({ token: token, json: valores });
        //navigate('/venta');
    }

    const guardaVentaDet = async (valores) => {
        return await createVentaDet({ token: token, json: valores });
    }

    //procedimiento para guardar
    const gestionGuardado = async () => {
        //e.preventDefault();
        //Validaciones
        if (tblventatmp.length <= 0) { message.error('No ha cargado ningun producto'); return; }
        const json = {
            idcliente: idcliente,
            nro_comprobante: 0,
            iva_total: totalIva,
            total: total,
            estado: 'AC',
            costo_envio: 0,
            fecha: strFecha
        };
        guardaVentaCab(json).then((cabecera) => {
            //console.log(cabecera)
            cabecera.body.razon_social = clienteSelected.razon_social;
            cabecera.body.ruc = clienteSelected.ruc;
            
            if (cabecera.estado !== 'error') {
                tblventatmp.map((detventa) => {
                    guardaVentaDet({
                        cantidad: detventa.cantidad,
                        idproducto_final: detventa.producto_final.idproducto_final,
                        estado: detventa.producto_final.estado,
                        descuento: detventa.descuento,
                        idventa: cabecera.body.idventa,
                        subtotal: detventa.producto_final.costo * detventa.cantidad,
                    }).then((det) => {
                        if (det.estado !== 'error') {
                            message.success(det?.mensaje);
                            //Aqui confirma la venta y libera la base temporal de reserva de producto
                            operacionVenta({ token, idproducto_final: det?.body?.idproducto_final, operacion: 'procesado', cantidad: 0 })
                        } else {
                            message.success('Cabecera almacenada');
                            message.error(det?.mensaje);
                        }
                    });
                    setTimeout(() => { }, 4000);
                    return true;
                });
                /*******
                 * Aqui cierra la ventana de cobro
                 * ******/

                handleOk()
                if (checkTicket) { generaTicket({ cabecera: cabecera.body, detalle: tblventatmp }) }
                navigate('/venta');

            } else {
                message.error(cabecera?.mensaje);
            }
        });
    }


    const agregarLista = async (e) => {
        e.preventDefault();
        //Validacion de existencia del producto dentro de la lista 
        const validExist = tblventatmp.filter((inv) => inv.idproducto_final === producto_finalSelected.idproducto_final);

        if (producto_finalSelected === null) {
            message.warning('Selecciona un producto');
            return;
        }
        if (parseInt(descuento) !== 0) {
            if (descuento < 0 || descuento < 1000) { message.warning('Verifique descuento'); return; }
        }

        if (parseInt(cantidad) === 0 || cantidad === null || cantidad === '') {
            message.warning('Cargue la cantidad de producto');
            return;
        }

        if (validExist.length !== 0) {
            message.warning('El producto ya existe en la lista')
            return;
        }

        //La idea es hacer que en el server se haga el calculo de si existe o no el stock por el producto
        if (producto_finalSelected.obs !== 'STOCK') {
            message.warning('No hay stock para este producto')
            return;
        }

        if (parseInt(cantidad) >= parseInt(producto_finalSelected.cant_prod_posible)) {
            message.warning('No hay stock para la cantidad requerida')
            return;
        }

        await operacionVenta({
            token: token,
            idproducto_final: producto_finalSelected.idproducto_final,
            operacion: 'venta',
            cantidad: cantidad,
        }).then((res) => {
            //console.log(res)
            if (res?.estado !== 'error') {
                tblventatmp.push({
                    idproducto_final: producto_finalSelected.idproducto_final,
                    producto_final: producto_finalSelected,
                    cantidad: cantidad,
                    descuento: descuento
                });
                setTotal((total + (cantidad * producto_finalSelected.costo)) - descuento);
                setTotalIva(totalIva + (cantidad * producto_finalSelected.monto_iva));
                setProductoFinalSelected(null);
                form.setFieldValue('idproducto_final', '');
                form.setFieldValue('cantidad', '');
                form.setFieldValue('descuento', '');
                setIdproducto_final(null)
                setCantidad(null);
                setDescuento(null)
            } else {
                message.warning('Error en verificacion de cantidades de stock base de datos')
            }
        });
        //console.log(tblventatmp)
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/venta');
    }

    const onChangeProductoFinal = (value) => {
        form.setFieldValue('idproducto_final', value);
        setIdproducto_final(value)
        setIdproducto_final(value)
        lstProductoFinal.map((element) => {
            if (element.idproducto_final === value) {
                setProductoFinalSelected(element)
            }
            return true;
        });
    };

    const onChangeCliente = (value) => {
        form.setFieldValue('idcliente', value);
        setIdcliente(value)
        lstCliente.map((element) => {
            if (element.idcliente === value) {
                setClienteSelected(element)
            }
            return true;
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const extraerRegistro = async (e, id, costo, monto_iva) => {
        e.preventDefault();
        //console.log('Datos: ',costo,monto_iva)
        const updtblVenta = tblventatmp.filter(inv => inv?.producto?.idproducto_final !== id);
        setTblVentaTmp(updtblVenta);

        await operacionVenta({
            token: token,
            cantidad: 0,
            idproducto_final: id,
            operacion: 'retorno',
        }).then((res) => {

            const updtblVenta = tblventatmp.filter(inv => inv.idproducto_final !== id);
            setTblVentaTmp(updtblVenta);

            if (res?.estado !== 'error') {
                setTotal(total - costo);
                setTotalIva(totalIva - monto_iva);
                message.warning('Registro extraido')
            } else {
                message.error('Error al extraer el registro')
            }
        });
    };

    return (
        <div>
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`NUEVA VENTA`} level={3}></Titulos>
            </div>

            {
                //Ventana de vuelteo
                ventanaCobro()
            }
            <Form
                initialValues={{ remember: true, }}
                //onFinish={gestionGuardado}
                autoComplete="off"
                name="basic"
                layout="vertical"
                style={{ textAlign: `center`, margin: `15px` }}
                form={form} >
                <Divider orientation="center" type="horizontal" style={{ color: `#747E87` }}>Cabecera</Divider>
                <Row >
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item
                            label='Cliente'
                            rules={[{ required: true, message: 'Seleccione cliente', },]}>
                            <Input id='idcliente' hidden name='idcliente' disabled value={idcliente} />
                            <Buscador label={'descripcion'} title={'Cliente'} selected={idcliente} value={'idcliente'} data={lstCliente} onChange={onChangeCliente} onSearch={onSearch} />
                        </Form.Item>
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item
                            label='Cliente'
                            rules={[{ required: true, message: 'Seleccione cliente', },]}>
                            <Input id='cliente' name='cliente' disabled value={(clienteSelected?.descripcion)} />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider orientation="center" type="horizontal" style={{ color: `#747E87`, marginLeft: `0px`, marginTop: `0px` }}>Detalle</Divider>
                <Row>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item
                            label='Producto'
                            rules={[{ required: true, message: 'Seleccione producto', },]}>
                            {idproducto_final ?
                                <Input id='idproducto' name='idproducto' disabled value={idproducto_final} />
                                : null}
                            <Buscador label={'nombre'} title={'Producto'} selected={idproducto_final} value={'idproducto_final'} data={lstProductoFinal} onChange={onChangeProductoFinal} onSearch={onSearch} />
                        </Form.Item>
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item label="Cantidad de productos" name="cantidad" id="cantidad">
                            <Input type='number' placeholder='Cantidad de productos' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col style={{ minWidth: `25rem` }}>
                        <Form.Item label="Descuento" name="descuento" id="descuento">
                            <Input type='number' placeholder='Descuento' value={descuento} onChange={(e) => setDescuento(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ justifyContent: `center` }}>
                    <Col style={{ marginBottom: `10px` }}>
                        <Button type="primary" htmlType="submit" ghost onClick={(e) => agregarLista(e)} >
                            Agregar
                        </Button>
                    </Col>
                </Row>
                <Row style={{ alignItems: `center`, justifyContent: `center`, margin: `0px`, display: `flex` }}>
                    <Table style={{ backgroundColor: `white` }}>
                        <thead style={{ backgroundColor: `#03457F`, color: `white` }}>
                            <tr>
                                <th>Producto</th>
                                <th>Costo</th>
                                <th>Cantidad</th>
                                <th>Descuento</th>
                                <th>Iva</th>
                                <th>Monto Iva</th>
                                <th>Subtotal iva</th>
                                <th>Subtotal</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tblventatmp.length !== 0 ? tblventatmp.map((inv) => (
                                <tr key={inv.idproducto_final}>
                                    <td> {inv.producto_final.nombre} </td>
                                    <td> {inv.producto_final.costo} </td>
                                    <td> {inv.cantidad} </td>
                                    <td> {inv.descuento} </td>
                                    <td> {inv.producto_final.tipo_iva + '%'} </td>
                                    <td> {inv.producto_final.monto_iva} </td>
                                    <td> {inv.producto_final.monto_iva * inv.cantidad} </td>
                                    <td> {inv.producto_final.costo * inv.cantidad} </td>
                                    <td>
                                        <button onClick={(e) => extraerRegistro(e, inv.idproducto_final, (inv.producto_final.costo - inv.descuento), inv.producto_final.monto_iva)} className='btn btn-danger'><IoTrashOutline /></button>
                                    </td>
                                </tr>
                            )) : null
                            }
                        </tbody>
                        <tfoot >
                            <tr>
                                <th>Total</th>
                                <th style={{ textAlign: `start` }} colSpan={7}>
                                    <b>{total}</b>
                                </th>
                            </tr>
                            <tr>
                                <th>Total iva</th>
                                <th style={{ textAlign: `start` }} colSpan={7}>
                                    <b>{totalIva}</b>
                                </th>
                            </tr>
                        </tfoot>
                    </Table>
                    <Col>
                        <Button type="primary" htmlType="submit" style={{ margin: `10px` }} onClick={() => showModal()} >
                            Procesar
                        </Button>
                        <Popconfirm
                            title="Esta seguro que desea cancelar?"
                            onConfirm={btnCancelar}
                            //onCancel={cancel}
                            okText="Si"
                            cancelText="No" >
                            <Button type="primary" danger ghost htmlType="submit"  >
                                Cancelar
                            </Button>
                        </Popconfirm>

                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default NuevoVenta;