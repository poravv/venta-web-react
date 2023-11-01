import { useState, useEffect } from 'react';
import { handleExport } from '../../Utils/ExportXLS';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getSucursal, updateSucursal } from '../../../services/Sucursal';
import { Titulos } from '../../Utils/Titulos';
import { BuscadorTabla } from '../../Utils/Buscador/BuscadorTabla';
import { getCiudad } from '../../../services/Ciudad';

let fechaActual = new Date();
const ListaSucursal = ({ token, idsucursal }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const navigate = useNavigate();
    const [ciudades, setCiudades] = useState([]);

    useEffect(() => {
        getLstSucursal();
        getLstCiudad();
        // eslint-disable-next-line
    }, []);

    const getLstSucursal = async () => {
        const res = await getSucursal({ token: token, param: 'get' });
        //console.log(res);
        setData(res.body);
    }

    const getLstCiudad = async () => {
        const res = await getCiudad({ token: token, param: 'get' });
        //console.log(res)
        setCiudades(res.body);
      }

    const handleDelete = async (id) => {
        await updateSucursal({ token: token, param: id, json: { estado: "IN" } }).then((res) => {
            if (res?.estado !== 'error') {
                message.warning('Registro anulado correctamente');
                getLstSucursal();
            } else {
                message.error(res.mensaje);
            }
        })
    }

    const handleUpdate = async (newData) => {
        await updateSucursal({ token: token, param: newData.idsucursal, json: newData }).then((res) => {
            if (res?.estado !== 'error') {
                message.success(res.mensaje);
                getLstSucursal();
            } else {
                message.error(res.mensaje);
            }
        })
    }


    const columns = [
        {
            title: 'Sucursal',
            dataIndex: 'descripcion',
            //width: '12%',
            editable: true,
            ...BuscadorTabla('descripcion'),
        },
        {
            title: 'Ruc',
            dataIndex: 'ruc',
            //width: '12%',
            editable: true,
            ...BuscadorTabla('ruc'),
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            //width: '12%',
            editable: true,
            ...BuscadorTabla('ruc'),
        },
        {
            title: 'Ciudad',
            dataIndex: 'idciudad',
            //width: '12%',
            editable: true,
            render: (_, res) => {
                return res.ciudad.descripcion
            }
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            width: '10%',
            editable: true,
            render: (_, { estado, idsucursal }) => {
                let color = 'black';
                if (estado?.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idsucursal} >
                        {estado?.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
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
                            onClick={() => save(record.idsucursal, record)}
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
                            onConfirm={() => confirmDel(record.idsucursal)}
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
        setEditingKey(record.idsucursal);
    };


    const isEditing = (record) => record.idsucursal === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idsucursal) => {
        handleDelete(idsucursal);
    };

    const save = async (idsucursal, record) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idsucursal === item.idsucursal);

            if (index > -1) {
                const item = newData[index];
                //console.log(newData);

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                if (record.idsucursal === item.idsucursal) {
                    //console.log('Entra en asignacion',record.img);
                    newData[index].img = record.img;
                }

                newData[index].fecha_upd = strFecha;

                console.log(newData);

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
            <Titulos text={`SUCURSALES`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearsucursal')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={() => handleExport({ data: data, title: 'Escuelas' })} size={20} /></Button>
            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idsucursal'} ciudades={ciudades} varx={400} />
        </>
    )
}
export default ListaSucursal