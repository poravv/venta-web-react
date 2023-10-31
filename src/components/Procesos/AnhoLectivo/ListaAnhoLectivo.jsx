//import axios from 'axios'
import { useState, useEffect } from 'react'
import { handleExport } from '../../Utils/ExportXLS'
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button} from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getAnhoLectivo,updateAnhoLectivo } from '../../../services/AnhoLectivo';
import {Titulos} from '../../Utils/Titulos';
import {BuscadorTabla}  from '../../Utils/Buscador/BuscadorTabla'


const ListaAnhoLectivo = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    let fechaActual = new Date();
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();
    
    
    useEffect(() => {
        getLstAnhoLectivo();
        // eslint-disable-next-line
    }, []);

    
    const getLstAnhoLectivo = async () => {
        const res = await getAnhoLectivo({token:token,param:'get'});
        //console.log(res.body)
        /*En caso de que de error en el server direcciona a login*/
        setData(res.body);
    }

    const handleDelete = async (id) => {
        //await deleteAnhoLectivo({token:token,param:id})
        await updateAnhoLectivo({ token: token, param: id, json: { estado: "IN" } })
        getLstAnhoLectivo();
    }
// eslint-disable-next-line
    const handleUpdate = async (newData) => {
        //console.log(newData)
        await updateAnhoLectivo({token:token,param:newData.idanho_lectivo,json:newData}) 
        getLstAnhoLectivo();
    }

    const columns = [
        {
            title: 'Año',
            dataIndex: 'anho',
            //width: '22%',
            editable: true,
            sortDirections: ['descend', 'ascend'],
            //sorter: (a, b) => a.anho.localeCompare(b.anho),
            sorter: (a, b) => a.anho - b.anho,
            ...BuscadorTabla('anho'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.estado.localeCompare(b.estado),
            editable: true,
            render: (_, { estado, idanho_lectivo }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idanho_lectivo} >
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
                            onClick={() => save(record.idanho_lectivo)}
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
                            onConfirm={() => confirmDel(record.idanho_lectivo)}
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
        setEditingKey(record.idanho_lectivo);
    };


    const isEditing = (record) => record.idanho_lectivo === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idanho_lectivo) => {
        message.success('Procesando');
        handleDelete(idanho_lectivo);
    };

    const save = async (idanho_lectivo) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idanho_lectivo === item.idanho_lectivo);

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
            <Titulos text={`AÑO LECTIVO`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearanhoLectivo')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={()=>handleExport({data:data,title:'Año lectivo'})} size={20} /></Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idanho_lectivo'} />
        </>
    )
}
export default ListaAnhoLectivo