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
import { getCargos, updateCargos } from '../../../services/Cargos';
import { Titulos } from '../../Utils/Titulos';
import { BuscadorTabla } from '../../Utils/Buscador/BuscadorTabla'
import { handleExport } from '../../Utils/ExportXLS'

const ListaCargos = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    let fechaActual = new Date();
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        getLstCargos();
        // eslint-disable-next-line
    }, []);


    const getLstCargos = async () => {
        try {
            const res = await getCargos({ token: token, param: 'get' });
            setData(res.body);
        } catch (e) {
            console.log(e);
        }
    }

    const handleDelete = async (id) => {
        await updateCargos({ token: token, param: id, json: { estado: "IN" } })
        getLstCargos();
    }

    const handleUpdate = async (newData) => {
        await updateCargos({ token: token, param: newData.idcargos, json: newData })
        getLstCargos();
    }

    const columns = [
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            //width: '22%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
            ...BuscadorTabla('descripcion'),
        },
        {
            title: 'Label 1',
            dataIndex: 'det1',
            //width: '22%',
            editable: true,
            require:false,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.det1.localeCompare(b.det1),
            ...BuscadorTabla('det1'),
        },
        {
            title: 'Label 2',
            dataIndex: 'det2',
            //width: '22%',
            editable: true,
            require:false,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.det2.localeCompare(b.det2),
            ...BuscadorTabla('det2'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '15%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.estado.localeCompare(b.estado),
            render: (_, { estado, idcargos }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idcargos} >
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
                            onClick={() => save(record.idcargos)}
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
                            title="Desea eliminar este registro?"
                            onConfirm={() => confirmDel(record.idcargos)}
                            onCancel={cancel}
                            okText="Si"
                            cancelText="No" >
                            <Typography.Link >
                                Borrar
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
        setEditingKey(record.idcargos);
    };


    const isEditing = (record) => record.idcargos === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idcargos) => {
        message.success('Procesando');
        handleDelete(idcargos);
    };

    const save = async (idcargos) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idcargos === item.idcargos);

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

                message.success('Registro actualizado');
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
                require:col.require,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <Titulos text={`CARGOS`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearcargos')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={() => handleExport({ data: data, title: 'Cargos' })} size={20} /></Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idcargos'} />
        </>
    )
}
export default ListaCargos