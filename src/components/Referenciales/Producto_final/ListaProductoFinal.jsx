import { useState,useEffect } from 'react'
import { handleExport } from '../../Utils/ExportXLS'
import { Popconfirm, Typography,Image } from 'antd';
import { Form } from 'antd';
import TableModelExpand from '../../TableModel/TableModelExpand';
import { Tag } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getProductoFinal,inactivaProductoFinal } from '../../../services/ProductoFinal';
import {Titulos} from '../../Utils/Titulos';
import {BuscadorTabla}  from '../../Utils/Buscador/BuscadorTabla';
import { Buffer } from 'buffer';
import { agregarSeparadorMiles } from '../../Utils/separadorMiles';

const ListaProductoFinal = ({ token }) => {
    const [form] = Form.useForm();
    const [productoFinal, setProductoFinal] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getLstProductoFinal();
        // eslint-disable-next-line
    }, []);

    const getLstProductoFinal = async () => {        
        const res = await getProductoFinal({token:token,param:'get'});
        //console.log(res.body);
        setProductoFinal(res.body);
    }

    const deleteProductoFinal = async (id) => {
        await inactivaProductoFinal({ token: token, param: id, json: { estado: "IN" } })
        getProductoFinal();
        message.success('Procesando');
    }
    
    const columns = [
        {
            title: 'Producto',
            dataIndex: 'nombre',
            width: '20%',
            editable: false,
            ...BuscadorTabla('nombre'),
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            //width: '20%',
            editable: true,
            ...BuscadorTabla('descripcion'),
        },
        {
            title: 'Escuela',
            dataIndex: 'sucursal',
            //width: '20%',
            editable: true,
            ...BuscadorTabla('sucursal'),
        },
        {
            title: 'Costo',
            dataIndex: 'costo',
            //width: '20%',
            editable: true,
            ...BuscadorTabla('costo'),
            render: (_, { costo }) => {
                return agregarSeparadorMiles(parseInt(costo))
            }
        },
        {
            title: 'Iva',
            dataIndex: 'tipo_iva',
            //width: '20%',
            editable: true,
            ...BuscadorTabla('tipo_iva'),
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
             title: 'Estado',
             dataIndex: 'estado',
             //width: '7%',
             editable: true,
             render: (_, { estado, idproducto_final }) => {
                 let color = 'black';
                 if (estado.toUpperCase() === 'AC') { color = 'green' }
                 else { color = 'volcano'; }
                 return (
                     <Tag color={color} key={idproducto_final} >
                         {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                     </Tag>
                 );
             },
         },
        {
            title: 'Acción',
            dataIndex: 'operacion',
            render: (_, record) => {
                return <>
                <Popconfirm
                    title="Desea eliminar este registro?"
                    onConfirm={() => confirmDel(record.idproducto_final)}
                    onCancel={cancel}
                    okText="Si"
                    cancelText="No" >
                    <Typography.Link >
                        Anular
                    </Typography.Link>
                </Popconfirm>
            </>;
            },
        }
    ];

    const columnDet = [
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            width: '2%',
            render: (_, record) => {
                return (record?.producto.descripcion);
            },
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            width: '2%',
            render: (_, record) => {
                return (agregarSeparadorMiles(parseInt(record?.producto.precio)));
            },
        },
        {
            title: 'Peso',
            dataIndex: 'peso',
            width: '2%',
            render: (_, record) => {
                return (record?.producto.peso);
            },
        },
    ];

    const isEditing = (record) => record.idproducto_final === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idproducto_final) => {
        deleteProductoFinal(idproducto_final);
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
            <Titulos text={`PRODUCCIONES`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearproducto_final')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={()=>handleExport({data:productoFinal,title:'Producto final'})} size={20} /></Button>
            </div>
            <TableModelExpand columnDet={columnDet} keyDet={'idproducto'} token={token} mergedColumns={mergedColumns} data={productoFinal} form={form} keyExtraido={'idproducto_final'} />
        </>
    )
}
export default ListaProductoFinal;