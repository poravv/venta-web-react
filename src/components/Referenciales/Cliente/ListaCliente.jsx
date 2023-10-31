import React, { useState, useEffect } from 'react'
import { Popconfirm, Typography, Form, Tag, Button, message } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getVwCliente, updateCliente } from '../../../services/Cliente';
import { Titulos } from '../../Utils/Titulos';
import { BuscadorTabla } from '../../Utils/Buscador/BuscadorTabla'
import { handleExport } from '../../Utils/ExportXLS';
import { getCiudad } from '../../../services/Ciudad';

function ListaCliente({ token }) {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();
    const [ciudades, setCiudades] = useState([]);

    useEffect(() => {
        getLstCliente();
        getLstCiudad();
        // eslint-disable-next-line
    }, []);

    const getLstCliente = async () => {
        if (data.length <= 0) {
            const res = await getVwCliente({ token: token });
            //console.log(res.body)
            setData(res.body);
        }
    }

    const getLstCiudad = async () => {
        const res = await getCiudad({ token: token, param: 'get' });
        //console.log(res)
        setCiudades(res.body);
      }

    const handleDelete = async (id) => {
        //await deleteCliente({token:token,param:id})
        await updateCliente({ token: token, param: id, json: { estado: "IN" } }).then((res) => {
            if (res?.estado !== 'error') {
                getLstCliente();
                message.warning('Registro anulado');
            } else {
                message.error(res?.mensaje);
            }
        });
    }

    const handleUpdate = async (newData) => {
        await updateCliente({ token: token, param: newData.idcliente, json: newData }).then((res) => {
            if (res?.estado !== 'error') {
                getLstCliente();
                message.success(res?.mensaje);
            } else {
                message.error(res?.mensaje);
            }
        });
        
    }
    const columns = [
        {
            title: 'Razon social',
            dataIndex: 'razon_social',
            //width: '10%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.razon_social.localeCompare(b.razon_social),
            //fixed: 'left',
            ...BuscadorTabla('razon_social'),
        },
        
        {
            title: 'Ruc',
            dataIndex: 'ruc',
            //fixed: 'left',
            //width: '10%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.ruc.localeCompare(b.ruc),
            ...BuscadorTabla('ruc'),
        },
        {
            title: 'Sexo',
            dataIndex: 'sexo',
            //width: '8%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.sexo.localeCompare(b.sexo),
            render: (_, { sexo, idcliente }) => {
                if (sexo) {
                    let color = 'black';
                    if (sexo.toUpperCase() === 'MA') { color = 'blue' }
                    else { color = 'volcano'; }
                    return (
                        <Tag color={color} key={idcliente} >
                            {sexo.toUpperCase() === 'MA' ? 'Masculino' : 'Femenino'}
                        </Tag>
                    );
                } else {
                    return null;
                }
            },
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            //width: '15%',
            editable: true,
            ...BuscadorTabla('direccion'),
        },
        {
            title: 'Tipo cliente',
            dataIndex: 'tipo_cli',
            //width: '22%',
            editable: false,
            ...BuscadorTabla('tipo_cli'),
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            //width: '22%',
            editable: true,
            ...BuscadorTabla('correo'),
        },
        {
            title: 'Telefono',
            dataIndex: 'telefono',
            //width: '22%',
            editable: true,
            ...BuscadorTabla('telefono'),
        },
        {
            title: 'Ciudad',
            dataIndex: 'idciudad',
            //width: '22%',
            editable: true,
            ...BuscadorTabla('ciudad'),
            render: (_, { ciudad }) => {
                return ciudad??null
            },
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            editable: true,
            render: (_, { estado, idcliente }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idcliente} >
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
                            onClick={() => save(record.idcliente)}
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
                            onConfirm={() => confirmDel(record.idcliente)}
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
        setEditingKey(record.idcliente);
    };


    const isEditing = (record) => record.idcliente === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idcliente) => {
        handleDelete(idcliente);
    };

    const save = async (idcliente) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idcliente === item.idcliente);

            if (index > -1) {

                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
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
            <Titulos text={`LISTA DE CLIENTES`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearcliente')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={() => handleExport({ data: data, title: 'Clientes' })} size={20} /></Button>
            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idcliente'} varx={2500} ciudades={ciudades} />
        </>
    )
}

export default React.memo(ListaCliente);
