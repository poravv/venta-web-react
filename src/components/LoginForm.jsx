
import { useState } from 'react';
import '../CSS/LoginForm.css'
import { Login } from '../services/Login'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, message } from 'antd';

function LoginForm() {
    const [form] = Form.useForm();
    const [nick, setNick] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginSubmit = async () => {
        await Login({ nick: nick, password: password }).then((nickRes) => {
            console.log(nickRes.body.nick)
            message.success(`Bienvenido nick ${nickRes.body.nick}`);
            // eslint-disable-next-line
            window.location.href = window.location.href;
        }).catch((error) => {
            setNick('');
            setPassword('');
            message.warning('Error de nick o contraseña');
        });
    };

    return (
        <div style={{
            //backgroundImage: `url(${require('../components/Utils/img/fondo.jpeg')})`,
            display: `flex`,
        }}>
            <div style={{
                height: `48rem`,
                width: `100%`,
                backdropFilter: `blur(10px)`,
            }}>
                <div style={{
                    display: `flex`,
                    height: `45rem`,
                    marginLeft: `10px`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    justifyItems: `center`,
                    textAlign: `center`,
                }}>
                    <div style={{ background:`white`,borderRadius:`10px` }}> 
                    <Form
                        name="basic"
                        layout="vertical"
                        style={{ width: `500px`, margin: `30px`}}
                        //labelCol={{ span: 8, }}
                        //wrapperCol={{ span: 16, }}
                        initialValues={{ remember: true, }}
                        onFinish={handleLoginSubmit}
                        autoComplete="off"
                        form={form} >
                        <Typography.Title level={2}
                            style={{
                                //color: `#4F89D3`
                                color: `#0B1C7D`
                            }}
                        >
                            Acceso
                        </Typography.Title>
                        <Typography.Title
                            style={{
                                marginTop: `-10px`,
                                color: `black`
                            }}
                        >
                            Sistema de Ventas
                            <br/>
                            Vendelo
                        </Typography.Title>

                        <Form.Item label="Usuario" name="nick" rules={[{ required: true, message: 'Ingrese Usuario!', },]}><Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Usuario" onChange={({ target }) => setNick(target.value)} /></Form.Item>
                        <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Ingrese Contraseña!', },]} >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </Form.Item>
                        <Form.Item><Button type="primary" htmlType="submit" className="login-form-button">LogIn</Button>
                        </Form.Item>
                    </Form>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default LoginForm;