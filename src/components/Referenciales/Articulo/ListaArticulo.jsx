import { useState, useEffect } from 'react'
import { handleExport } from '../../Utils/ExportXLS'
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import {  PlusOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getArticulo, updateArticulo } from '../../../services/Articulo';
import {Titulos} from '../../Utils/Titulos';
import {BuscadorTabla}  from '../../Utils/Buscador/BuscadorTabla'
import { Buffer } from 'buffer'
import { agregarSeparadorMiles } from '../../Utils/separadorMiles';

let fechaActual = new Date();
const ListaArticulo = ({ token,idproducto }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const navigate = useNavigate();

    useEffect(() => {
        getLstArticulo();
        // eslint-disable-next-line
    }, []);

    const getLstArticulo = async () => {
        const res = await getArticulo({token:token,param:'get'});
        //console.log(res.body)
        setData(res.body);

    }

    const handleDelete = async (id) => {
        await updateArticulo({ token: token, param: id, json: { estado: "IN" } }).then((res) => {
            if (res?.estado !== 'error') {
                getLstArticulo();
                message.warning('Registro anulado');
            } else {
                message.error(res?.mensaje);
            }
        });
    }

    const handleUpdate = async (newData) => {
        await updateArticulo({token:token,param:newData.idproducto,json:newData}).then((res) => {
            if (res?.estado !== 'error') {
                getLstArticulo();
                message.success(res?.mensaje);
            } else {
                message.error(res?.mensaje);
            }
        });
        
    }

    const columns = [
        {
            title: 'Articulo',
            dataIndex: 'descripcion',
            //width: '12%',
            editable: true,
            ...BuscadorTabla('descripcion'),
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            //width: '12%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.precio.localeCompare(b.precio),
            ...BuscadorTabla('precio'),
            render: (_, res ) => {
                    return agregarSeparadorMiles(parseInt(res?.precio))
                //return res?.precio
            }
        },
        {
            title: 'Peso',
            dataIndex: 'peso',
            //width: '12%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.peso.localeCompare(b.peso),
            ...BuscadorTabla('peso'),
        },
        {
            title: 'Proveedor',
            dataIndex: 'idproveedor',
            //width: '12%',
            editable: false,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.proveedor.razon_social.localeCompare(b.proveedor.razon_social),
            render: (_, res ) => {
                return res?.proveedor.razon_social
            }
        },
        {
            title: 'Imagen',
            dataIndex: 'img',
            width: '15%',
            editable: true,
            render: (_, { img }) => {
                if (img && typeof img !== "string") {
                    //console.log(img.data);
                    const asciiTraducido = Buffer.from(img?.data).toString('ascii');
                    //console.log(asciiTraducido);
                    if (asciiTraducido) {
                        return (
                            <Image
                                style={{  borderRadius: `4px`,width:`60px` }}
                                alt="imagen"
                                //preview={false}
                                //style={{ width: '50%',margin:`0px`,textAlign:`center` }}
                                src={asciiTraducido}
                            />
                        );
                    } 
                } 
            },
        },
        {
            title: 'Creación',
            dataIndex: 'fecha_insert',
            //width: '12%',
            editable: false,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.fecha_insert.localeCompare(b.fecha_insert),
            
        },
        {
            title: 'Actualización',
            dataIndex: 'fecha_upd',
            //width: '12%',
            editable: false,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.fecha_upd.localeCompare(b.fecha_upd),
            
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            width: '10%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.estado.localeCompare(b.estado),
            render: (_, { estado, idproducto }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idproducto} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
            },
        },
        {
            title: 'Acción',
            dataIndex: 'operacion',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.idproducto, record)}
                            style={{
                                marginRight: 8,
                            }} >
                            Guardar
                        </Typography.Link>
                        <br />
                        <Popconfirm title="Desea cancelar?" onConfirm={cancel}>
                            <a href='/'>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link style={{ margin: `5px` }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Editar
                        </Typography.Link>
                        <Popconfirm
                            title="Desea anular este registro?"
                            onConfirm={() => confirmDel(record.idproducto)}
                            onCancel={cancel}
                            okText="Si"
                            cancelText="No" >
                            <Typography.Link >
                                Anular
                            </Typography.Link>
                        </Popconfirm>
                    </>
                );
            },
        }
    ]

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.idproducto);
    };


    const isEditing = (record) => record.idproducto === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idproducto) => {
        handleDelete(idproducto);
    };

    const save = async (idproducto, record) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idproducto === item.idproducto);

            if (index > -1) {
                const item = newData[index];
                //console.log(newData);

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                if (record.idproducto === item.idproducto) {
                    //console.log('Entra en asignacion------',record.img);
                    newData[index].img = record.img;
                }

                newData[index].fecha_upd = strFecha;
                //console.log(newData);
                handleUpdate(newData[index]);
                setData(newData);
                setEditingKey('');                
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
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
            <Titulos text={`ARTICULO`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/creararticulo')} >{<PlusOutlined />} Nuevo</Button>
                <Button type="primary" style={{ background:`orange`, margin: `2px` }} onClick={() => navigate('/creararticuloproducto')} >{<PlusOutlined />} Producción</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17` }}  ><RiFileExcel2Line onClick={()=>handleExport({data:data,title:'Producto'})} size={20} /></Button>
            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idproducto'} />
        </>
    )
}
export default ListaArticulo