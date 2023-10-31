//import axios from 'axios'
import { useState, useEffect } from 'react'
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { getCargo, updateCargo } from '../../../services/Cargo';
import { Titulos } from '../../Utils/Titulos';
import { BuscadorTabla } from '../../Utils/Buscador/BuscadorTabla'
import { handleExport } from '../../Utils/ExportXLS'

const ListaCargoPersona = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getLstCargo();
        // eslint-disable-next-line
    }, []);


    const getLstCargo = async () => {
        try {
            const res = await getCargo({ token: token, param: 'get' });
            setData(res.body);
        } catch (e) {
            console.log(e);
        }
    }

    const handleDelete = async (idpersona, idcargos, idanho_lectivo) => {
        await updateCargo({ token: token, json: { estado: "IN", idpersona: idpersona, idcargos: idcargos, idanho_lectivo: idanho_lectivo } })
        getLstCargo();
    }

    const columns = [
        {
            title: 'Nombre y Apellido',
            dataIndex: 'nombres',
            //width: '22%',
            editable: false,
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.nombres.localeCompare(b.nombres),
            ...BuscadorTabla('nombres'),
        },
        {
            title: 'Documento',
            dataIndex: 'documento',
            //width: '15%',
            editable: false,
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            //width: '15%',
            editable: false,
        },
        {
            title: 'Acción',
            dataIndex: 'operacion',
            render: (_, record) => {
                return <>
                    <Popconfirm
                        title="Desea eliminar este registro?"
                        onConfirm={() => confirmDel(record.idpersona, record.idcargos, record.idanho_lectivo)}
                        onCancel={cancel}
                        okText="Si"
                        cancelText="No" >
                        <Typography.Link >
                            Borrar
                        </Typography.Link>
                    </Popconfirm>
                </>;
            },
        }
    ]

    const isEditing = (record) => record.idcargo === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idpersona, idcargos, idanho_lectivo) => {
        message.success('Procesando');
        handleDelete(idpersona, idcargos, idanho_lectivo);
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
            <Titulos text={`CARGO PERSONA`} level={3}></Titulos>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearcargo')} >{<PlusOutlined />} Nuevo</Button>
                <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={() => handleExport({ data: data, title: 'Cargo' })} size={20} /></Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idcargos'} />
        </>
    )
}
export default ListaCargoPersona