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
import { getDocumentos, updateDocumentos } from '../../../services/Documentos';
import {Titulos} from '../../Utils/Titulos';
import {BuscadorTabla}  from '../../Utils/Buscador/BuscadorTabla'


const ListaDocumentos = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    let fechaActual = new Date();
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();
    
    
    useEffect(() => {
        getLstDocumentos();
        // eslint-disable-next-line
    }, []);

    
    const getLstDocumentos = async () => {
        const res = await getDocumentos({token:token,param:'get'});
        setData(res.body);
    }

    const handleDelete = async (id) => {
        await updateDocumentos({ token: token, param: id, json: { estado: "IN" } })
        getLstDocumentos();
    }

    const handleUpdate = async (newData) => {
        await updateDocumentos({token:token,param:newData.iddocumentos,json:newData}) 
        getLstDocumentos();
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
            render: (_, { estado, iddocumentos }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={iddocumentos} >
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
                            onClick={() => save(record.iddocumentos)}
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
                            onConfirm={() => confirmDel(record.iddocumentos)}
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
        setEditingKey(record.iddocumentos);
    };


    const isEditing = (record) => record.iddocumentos === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (iddocumentos) => {
        message.success('Procesando');
        handleDelete(iddocumentos);
    };

    const save = async (iddocumentos) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => iddocumentos === item.iddocumentos);

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
            <Titulos text={`DOCUMENTOS`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/creardocumentos')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={()=>handleExport({data:data,title:'Documentos'})} size={20} /></Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'iddocumentos'} />
        </>
    )
}
export default ListaDocumentos