import { useState, useEffect, useRef } from 'react'
import { handleExport } from '../../Utils/ExportXLS'
import { Popconfirm, Row, Typography } from 'antd';
import { Form } from 'antd';
import TableModelExpand from '../../TableModel/TableModelExpand';
import { Tag } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getVenta, updateVenta } from '../../../services/Venta';
import { Titulos } from '../../Utils/Titulos';
import { BuscadorTabla } from '../../Utils/Buscador/BuscadorTabla';
import { agregarSeparadorMiles } from '../../Utils/separadorMiles';
import { generaTicket } from '../../Reportes/Ticket/ExportTicketPdf';
import FacturaTemplate from '../../Reportes/Factura/FacturaTemplate';
import jsPDF from 'jspdf';

const ListaVentaTotal = ({ token }) => {
    const [form] = Form.useForm();
    const [venta, setVenta] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();
    const [checkFactura, setCheckFactura] = useState(false);
    const [tmp_cabecera, setCabecera] = useState();
    const [tmp_detalle, setDetalle] = useState();
    const reportTemplateRef = useRef(null);

    useEffect(() => {
        getLstVenta();
        // eslint-disable-next-line
    }, []);

    const handleGeneratePdf = () => {
        const doc = new jsPDF({
            format: 'legal',
            unit: 'pt',
            precision: 1,
            compressPdf: true,
            //orientation: 'l'
        });

        doc.html(reportTemplateRef.current, {
            async callback(doc) {
                await doc.save('document');
            },
        });
    };

    const getLstVenta = async () => {
        const array = [];
        const res = await getVenta({ token: token, param: 'get' });
        //console.log(res.body);
        res?.body?.map((rs) => {
            rs.razon_social = rs?.cliente.razon_social;
            rs.ruc = rs?.cliente.ruc;
            rs.telefono = rs?.cliente.telefono;
            rs.tipo_cli = rs?.cliente.tipo_cli;
            rs.vendedor = rs?.usuario?.nick;
            array.push(rs)
            return true;
        });

        setVenta(array);
    }

    const deleteVenta = async (id) => {
        await updateVenta({ token: token, param: id, json: { estado: "IN" } })
        getVenta();
        message.success('Procesando');
    }

    const generadorFactura = (venta_cab, venta_det) => {
        setCabecera(venta_cab);
        setDetalle(venta_det);
        setCheckFactura(true)
    }
    const limpiarTodo = () => {
        // eslint-disable-next-line
        window.location.href = window.location.href;
    }


    const columns = [
        {
            title: 'Cliente',
            dataIndex: 'razon_social',
            width: '20%',
            editable: false,
            ...BuscadorTabla('razon_social'),
        },
        {
            title: 'Ruc',
            dataIndex: 'ruc',
            //width: '20%',
            editable: false,
            ...BuscadorTabla('ruc'),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            //width: '20%',
            editable: false,
            render: (_, { total }) => {
                return agregarSeparadorMiles(parseInt(total))
            }
        },
        {
            title: 'Iva',
            dataIndex: 'iva_total',
            //width: '20%',
            editable: false,
            render: (_, { iva_total }) => {
                return agregarSeparadorMiles(parseInt(iva_total))
            },
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            //width: '20%',
            editable: false,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.fecha.localeCompare(b.fecha),
        },
        {
            title: 'Vendedor',
            dataIndex: 'vendedor',
            //width: '20%',
            editable: false,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.vendedor.localeCompare(b.vendedor),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            editable: false,
            render: (_, { estado, idventa }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idventa} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
            },
        },
        {
            title: 'Acción',
            dataIndex: 'operacion',
            render: (_, record) => {
                return <>
                    <Popconfirm
                        title="Desea eliminar este registro?"
                        onConfirm={() => confirmDel(record.idventa)}
                        onCancel={cancel}
                        okText="Si"
                        cancelText="No" >
                        <Typography.Link >
                            Anular
                        </Typography.Link>
                    </Popconfirm>
                    <br />
                    <Typography.Link onClick={() => generaTicket({ cabecera: record, detalle: record?.det_venta })}>
                        Ticket
                    </Typography.Link>
                    <br />
                    <Typography.Link onClick={(e) => generadorFactura(record, record?.det_venta)}>
                        Factura
                    </Typography.Link>
                </>;
            },
        }
    ];

    const columnDet = [
        {
            title: 'Producto',
            dataIndex: 'nombre',
            width: '2%',
            render: (_, record) => {
                //console.log(record)
                return record?.producto_final?.nombre;
            },
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            width: '2%',
            render: (_, record) => {
                return record?.cantidad;
            },
        },
        {
            title: 'Costo',
            dataIndex: 'costo',
            width: '2%',
            render: (_, record) => {
                return (agregarSeparadorMiles(parseInt(record?.producto_final?.costo)));
            },
        },
        {
            title: 'Descuento',
            dataIndex: 'descuento',
            width: '2%',
            render: (_, record) => {
                return (agregarSeparadorMiles(parseInt(record?.descuento)));
            },
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            width: '2%',
            render: (_, record) => {
                return (agregarSeparadorMiles(parseInt(record?.subtotal)));
            },
        },
    ];

    const isEditing = (record) => record.idventa === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idventa) => {
        deleteVenta(idventa);
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
        <Titulos text={`VENTAS`} level={3}></Titulos>
        {checkFactura === false ?
            <>
                <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                    <Button type="primary" onClick={() => navigate('/crearventa')} >{<PlusOutlined />} Nuevo</Button>
                    <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={() => handleExport({ data: venta, title: 'Producto final' })} size={20} /></Button>
                </div>
                <TableModelExpand columnDet={columnDet} keyDet={'idproducto_final'} token={token} mergedColumns={mergedColumns} data={venta} form={form} keyExtraido={'idventa'} />
            </>
            : <>
                <div>
                    <Row>
                        <Button onClick={handleGeneratePdf} type="primary" htmlType="submit" style={{ margin: `10px`, backgroundColor: `#02A52F` }} >
                            Descargar
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ margin: `10px`, backgroundColor: `tomato` }} onClick={() => limpiarTodo()} >
                            Limpiar
                        </Button>
                    </Row>
                    <div ref={reportTemplateRef} >
                        <FacturaTemplate tmp_cabecera={tmp_cabecera} tmp_detalle={tmp_detalle} />
                    </div>
                </div>
            </>
        }
    </>
    )
}
export default ListaVentaTotal;