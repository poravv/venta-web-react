import { useState, useEffect } from 'react'
import { handleExport } from '../../Utils/ExportXLS'
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getGradosArma, updateGradosArma } from '../../../services/GradosArma';
import {Titulos} from '../../Utils/Titulos';
import {BuscadorTabla}  from '../../Utils/Buscador/BuscadorTabla'


const ListaGradosArma = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    let fechaActual = new Date();
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();
    
    
    useEffect(() => {
        getLstGradosArma();
        // eslint-disable-next-line
    }, []);

    
    const getLstGradosArma = async () => {
        const res = await getGradosArma({token:token,param:'get'});
        setData(res.body);
    }


    const handleDelete = async (id) => {
        await updateGradosArma({ token: token, param: id, json: { estado: "IN" } })
        getLstGradosArma();
    }

    const handleUpdate = async (newData) => {
        await updateGradosArma({token:token,param:newData.idgrados_arma,json:newData}) 
        getLstGradosArma();
    }

    const columns = [
        {
            title: 'Grado',
            dataIndex: 'grado',
            //width: '22%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.grado.localeCompare(b.grado),
            ...BuscadorTabla('grado'),
        },
        {
            title: 'Armas',
            dataIndex: 'armas',
            //width: '22%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.armas.localeCompare(b.armas),
            ...BuscadorTabla('armas'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.estado.localeCompare(b.estado),
            editable: true,
            render: (_, { estado, idgrados_arma }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idgrados_arma} >
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
                            onClick={() => save(record.idgrados_arma)}
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
                            onConfirm={() => confirmDel(record.idgrados_arma)}
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
        setEditingKey(record.idgrados_arma);
    };


    const isEditing = (record) => record.idgrados_arma === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idgrados_arma) => {
        message.success('Procesando');
        handleDelete(idgrados_arma);
    };

    const save = async (idgrados_arma) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idgrados_arma === item.idgrados_arma);

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
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <Titulos text={`RANGOS`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/creargradosArma')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={()=>handleExport({data:data,title:'Rangos'})} size={20} /></Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idgrados_arma'} />
        </>
    )
}
export default ListaGradosArma