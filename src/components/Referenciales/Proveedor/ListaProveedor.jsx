//import axios from 'axios'
import { useState, useEffect } from 'react'
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getProveedor, updateProveedor } from '../../../services/Proveedor';
import { Titulos } from '../../Utils/Titulos';
import { BuscadorTabla } from '../../Utils/Buscador/BuscadorTabla'
import { handleExport } from '../../Utils/ExportXLS'

const ListaProveedor = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    let fechaActual = new Date();
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getLstProveedor();
        // eslint-disable-next-line
    }, []);

    const getLstProveedor = async () => {
        try {
            const res = await getProveedor({ token: token, param: 'get' });
            setData(res.body);
        } catch (e) {
            console.log(e);
        }
    }

    const handleDelete = async (id) => {
        await updateProveedor({ token: token, param: id, json: { estado: "IN" } }).then((res) => {
            if (res?.estado !== 'error') {
                //message.success(res?.mensaje);
                message.warning('Registro anulado');
                getLstProveedor();
            } else {
                message.error(res?.mensaje);
            }
        })
    }

    const handleUpdate = async (newData) => {
        await updateProveedor({ token: token, param: newData.idproveedor, json: newData }).then((res) => {
            if (res?.estado !== 'error') {
                message.success(res?.mensaje);
                getLstProveedor();
            } else {
                message.error(res?.mensaje);
            }
        });
    }

    const columns = [
        {
            title: 'Razon social',
            dataIndex: 'razon_social',
            //width: '22%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.razon_social.localeCompare(b.razon_social),
            ...BuscadorTabla('razon_social'),
        },
        {
            title: 'Ruc',
            dataIndex: 'ruc',
            //width: '22%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.ruc.localeCompare(b.ruc),
            ...BuscadorTabla('ruc'),
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            //width: '22%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.direccion.localeCompare(b.direccion),
            ...BuscadorTabla('direccion'),
        },
        {
            title: 'Teléfono',
            dataIndex: 'telefono',
            //width: '22%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.telefono.localeCompare(b.telefono),
            ...BuscadorTabla('telefono'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '15%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.estado.localeCompare(b.estado),
            render: (_, { estado, idproveedor }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idproveedor} >
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
                            onClick={() => save(record.idproveedor)}
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
                            onConfirm={() => confirmDel(record.idproveedor)}
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
        setEditingKey(record.idproveedor);
    };


    const isEditing = (record) => record.idproveedor === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idproveedor) => {
        handleDelete(idproveedor);
    };

    const save = async (idproveedor) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idproveedor === item.idproveedor);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
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
            <Titulos text={`PROVEEDORES`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearproveedor')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={() => handleExport({ data: data, title: 'Proveedor' })} size={20} /></Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idproveedor'} />
        </>
    )
}
export default ListaProveedor