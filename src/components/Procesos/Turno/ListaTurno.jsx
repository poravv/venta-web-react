import { useState, useEffect } from 'react'
import { handleExport } from '../../Utils/ExportXLS'
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import {  PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getTurno, updateTurno } from '../../../services/Turno';
import {Titulos} from '../../Utils/Titulos';
import {BuscadorTabla}  from '../../Utils/Buscador/BuscadorTabla'

const ListaTurno = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    let fechaActual = new Date();
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();
    
    
    useEffect(() => {
        getLstTurno();
        // eslint-disable-next-line
    }, []);

    
    const getLstTurno = async () => {
        const res = await getTurno({token:token,param:'get'});
        setData(res.body);
    }



    const handleDelete = async (id) => {
        //await deleteTurno({token:token,param:id})
        await updateTurno({ token: token, param: id, json: { estado: "IN" } })
        getLstTurno();
    }
// eslint-disable-next-line
    const handleUpdate = async (newData) => {
        //console.log(newData)
        await updateTurno({token:token,param:newData.idturno,json:newData}) 
        getLstTurno();
    }

    const columns = [
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            //width: '22%',
            editable: true,
            ...BuscadorTabla('descripcion'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            editable: true,
            render: (_, { estado, idturno }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idturno} >
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
                            onClick={() => save(record.idturno)}
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
                            onConfirm={() => confirmDel(record.idturno)}
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
        setEditingKey(record.idturno);
    };


    const isEditing = (record) => record.idturno === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idturno) => {
        message.success('Procesando');
        handleDelete(idturno);
    };

    const save = async (idturno) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idturno === item.idturno);

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
            <Titulos text={`TURNOS`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearturno')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={()=>handleExport({data:data,title:'Turnos'})} size={20} /></Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idturno'} />
        </>
    )
}
export default ListaTurno