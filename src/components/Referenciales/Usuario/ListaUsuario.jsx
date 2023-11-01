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
import { getUsuario, resetUsuario, updateUsuarioName } from '../../../services/Usuario';
import {Titulos} from '../../Utils/Titulos';
import {BuscadorTabla}  from '../../Utils/Buscador/BuscadorTabla'

//let fechaActual = new Date();
const ListaUsuario = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    //const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const navigate = useNavigate();
    useEffect(() => {
        getLstUsuario();
        // eslint-disable-next-line
    }, []);

    const getLstUsuario = async () => {
        let array = [];
        const res = await getUsuario({ token: token });
        console.log(res.body)
        res?.body?.map((usuario) => {
            usuario.nombre = usuario?.persona?.nombre;
            usuario.passwordAnterior = usuario?.password;
            usuario.apellido = usuario?.persona?.apellido;
            usuario.documento = usuario?.persona?.documento;
            usuario.correo = usuario?.persona?.correo;
            usuario.telefono = usuario?.persona?.telefono;
            array.push(usuario);
            return true;
        });
        setData(array);
    }

    const handleDelete = async (id) => {
        await updateUsuarioName({ token: token, param: id, json: { estado: "IN" } })
        getLstUsuario();
    }

    const handleReset = async (id) => {
        /*Cambio de clave*/
        await resetUsuario({ token: token, param: id,json:{ password:'000000' }})
        getLstUsuario();
    }

    const handleUpdate = async (newData) => {
        await updateUsuarioName({ token: token, param: newData.idusuario, json: newData }).then((rs) =>{
            console.log(rs)
            if(rs?.estado!=='error'){
                message.success(rs.mensaje);
                getLstUsuario();
            }else{
                message.error(rs.mensaje);    
            }
        });
    }   

    const columns = [
        {
            title: 'Usuario',
            dataIndex: 'nick',
            //width: '10%',
            editable: true,
            ...BuscadorTabla('nick'),
        },
        {
            title: 'Nivel',
            dataIndex: 'nivel',
            //width: '10%',
            editable: false,
            ...BuscadorTabla('nivel'),
            render: (_, { nivel }) => {
                switch (nivel) {
                    case 0: return 'Root';
                    case 1: return 'Sys Admin'
                    case 2: return 'Vendedor'
                    case 3: return 'Administrador'
                    default: return 'No definido'
                }
            },
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            //width: '10%',
            editable: false,
            ...BuscadorTabla('nombre'),
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            //width: '10%',
            editable: false,
            ...BuscadorTabla('apellido'),
        },
        {
            title: 'Documento',
            dataIndex: 'documento',
            //width: '10%',
            editable: false,
            ...BuscadorTabla('documento'),
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            //width: '22%',
            editable: false,
            ...BuscadorTabla('correo'),
        },
        {
            title: 'Telefono',
            dataIndex: 'telefono',
            //width: '22%',
            editable: false,
            ...BuscadorTabla('telefono'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            editable: false,
            render: (_, { estado, idusuario }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idusuario} >
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
                            onClick={() => save(record.idusuario)}
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

                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Editar
                        </Typography.Link>
                        <Popconfirm
                            title="Desea eliminar este registro?"
                            onConfirm={() => confirmDel(record.idusuario)}
                            onCancel={cancel}
                            okText="Si"
                            cancelText="No" >
                            <Typography.Link  style={{ margin: `5px` }}>
                                Borrar
                            </Typography.Link>
                        </Popconfirm>
                    <br/>
                        <Popconfirm
                            title="Desea resetear este registro?"
                            onConfirm={() => resetPass(record.idusuario)}
                            onCancel={cancel}
                            okText="Si"
                            cancelText="No" >
                            <Typography.Link >
                                Reset pass
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
        setEditingKey(record.idusuario);
    };


    const isEditing = (record) => record.idusuario === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idusuario) => {
        
        handleDelete(idusuario).then(()=>{
            message.success('Procesando');
        });
    };

    const resetPass = (idusuario) => {
        handleReset(idusuario).then(()=>{
            message.success('Procesando');
        });
    };

    const save = async (idusuario) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idusuario === item.idusuario);

            if (index > -1) {

                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                //newData[index].fecha_upd = strFecha;
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
            <Titulos text={`LISTA DE USUARIOS`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearusuario')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={()=>handleExport({data:data,title:'Usuarios'})} size={20} /></Button>
            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idusuario'} varx={900} />
        </>
    )
}

export default ListaUsuario;
