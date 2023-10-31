

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { updateUsuario, getUsuarioId } from '../../../services/Usuario';
import { Titulos } from '../../Utils/Titulos';

function EditarUsuario({ token, idusuario }) {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [passwordNuevo1, setPasswordNuevo1] = useState('');
    const [passwordNuevo2, setPasswordNuevo2] = useState('');
    const [apellido, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [sucursal, setSucursal] = useState([]);
    const [idpersona, setIdpersona] = useState(0);
    const [idsucursal, setIdsucursal] = useState(0);
    const [nick, setNick] = useState(0);
    const [nivel, setNivel] = useState(0);

    useEffect(() => {
        getUsuarioPk();
        // eslint-disable-next-line
    }, []);

    const getUsuarioPk = async () => {
        const res = await getUsuarioId({ token: token, idusuario: idusuario });
        setData(res.body);
        //console.log(res.body)
        console.log(data);
        setNombre(res.body.persona.nombre);
        setApellido(res.body.persona.apellido);
        setDocumento(res.body.persona.documento);
        setIdpersona(res.body.persona.idpersona);
        setSucursal(res.body.sucursal.descripcion);
        setIdsucursal(res.body.sucursal.idsucursal);
        setNivel(res.body.nivel);
        setNick(res.body.nick);
        form.setFieldValue('nombre', res.body.persona.nombre);
        form.setFieldValue('apellido', res.body.persona.apellido);
        form.setFieldValue('documento', res.body.persona.documento);
        form.setFieldValue('idpersona', res.body.persona.idpersona);
        form.setFieldValue('sucursal', res.body.sucursal.descripcion);
        form.setFieldValue('usuario', res.body.nick);
    }

    const navigate = useNavigate();

    //procedimiento para crear registro
    const update = async (e) => {
        //e.preventDefault();

        if (passwordNuevo1 !== passwordNuevo2) { message.warning('Contraseñas nuevas no coinciden'); return; }
        
        let saveusuario = {
            idusuario: idusuario,
            nick: nick,
            nivel: nivel,
            passwordAnterior: password,
            password: passwordNuevo1,
            estado: 'AC',
            idpersona: idpersona,
            idsucursal: idsucursal
        }
        await updateUsuario({ token: token, param: idusuario, json: saveusuario }).then((rs) => {
            console.log(rs)
            if (rs.error) {
                message.warning(rs.error);
                return;
            } else {
                message.success(rs.mensaje);
                navigate(-1);
            }
        });


    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate(-1);
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <Titulos text={`EDITAR USUARIO`} level={3}></Titulos>
            </div>
            <Form
                name="basic"
                layout="vertical"
                style={{ textAlign: `center`, marginLeft:`10px` }}
                labelCol={{ span: 10, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={update}
                autoComplete="off"
                form={form} >
                <Form.Item
                    rules={[{ required: true, message: 'Cargue idpersona', },]}
                    label='Idpersona'
                    id='idpersona' name="idpersona" >
                    <Input disabled value={idpersona} onChange={(e) => setIdpersona(e.target.value)} />
                </Form.Item>
                <Form.Item label={'Documento de identidad'} id='documento' name="documento" rules={[{ required: true, message: 'Cargue documento', },]}>
                    <Input placeholder='Documento de identidad' disabled value={documento} onChange={(e) => setDocumento(e.target.value)} />
                </Form.Item>
                <Form.Item label={'Nombre'} id='nombre' name="nombre" rules={[{ required: true, message: 'Cargue nombre', },]}>
                    <Input placeholder='nombre' disabled value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Form.Item>
                <Form.Item label={'Apellido'} name="apellido" rules={[{ required: true, message: 'Cargue apellido', },]}>
                    <Input placeholder='Apellido' disabled value={apellido} onChange={(e) => setApellido(e.target.value)} />
                </Form.Item>
                <Form.Item label={'Sucursal'} id='sucursal' name="sucursal" rules={[{ required: true, message: 'Cargue sucursal', },]}>
                    <Input placeholder='Sucursal' disabled value={sucursal} onChange={(e) => setSucursal(e.target.value)} />
                </Form.Item>
                <Form.Item label={'Usuario'} id='usuario' name="usuario" rules={[{ required: true, message: 'Cargue usuario', },]}>
                    <Input placeholder='Usuario' value={nick} onChange={(e) => setNick(e.target.value)} />
                </Form.Item>
                <Form.Item label={'Contraseña nueva'} id='passwordNuevo1' name="passwordNuevo1" >
                    <Input type='password' placeholder='Contraseña nueva' value={passwordNuevo1} onChange={(e) => setPasswordNuevo1(e.target.value)} />
                </Form.Item>
                <Form.Item label={'Repita contraseña nueva'} id='passwordNuevo2' name="passwordNuevo2" >
                    <Input type='password' placeholder='Repita contraseña nueva' value={passwordNuevo2} onChange={(e) => setPasswordNuevo2(e.target.value)} />
                </Form.Item>
                <Form.Item label={'Contraseña actual'} id='password' name="password" rules={[{ required: true, message: 'Para guardar cambios complete el password anterior', },]}>
                    <Input type='password' placeholder='Contraseña actual' value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item
                    style={{ margin: `20px` }}>
                    <Button type="primary" htmlType="submit" style={{ margin: `20px` }} >
                        Guardar
                    </Button>
                    <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default EditarUsuario;

