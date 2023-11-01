import React, { useState } from 'react';
import {
    HomeOutlined,
    TeamOutlined,
    ToolOutlined,
    LogoutOutlined,
    PieChartOutlined,
    FolderOpenOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Image,FloatButton } from 'antd';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Logout } from '../services/Login';
import { IoCartOutline,IoCheckboxOutline } from "react-icons/io5";

const { Header, Content, Footer, Sider } = Layout;

function getItem(onClick, label, key, icon, children) {
    return {
        onClick,
        key,
        icon,
        children,
        label
    };
}


const AppBar = ({ usuario, sucursal, nivel }) => {
    //console.log(sucursal)
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    function navegacion(direccion) {
        navigate(direccion);
    }

    const traduccionImg = () => {
        return <Image
            style={{ borderRadius: `4px`, maxHeight: `100px`, maxWidth: `100px` }}
            preview={false}
            alt="imagen"
            src={require('../components/Utils/img/vendelo.png')}
        />
    }

    const items = [
        getItem(() => navegacion('/'), 'Home', '1', <HomeOutlined />),
        nivel === 0 || nivel === 1 ?
            getItem(null, 'Mantenimiento', '2', <ToolOutlined />, [
                getItem(() => navegacion('/usuario'), 'Usuarios', '2.1'),
                getItem(() => navegacion('/ciudad'), 'Ciudad', '2.2'),
                getItem(() => navegacion('/sucursal'), 'Sucursal', '2.3'),
                getItem(() => navegacion('/proveedor'), 'Proveedor', '2.4'),
                getItem(() => navegacion('/persona'), 'Personas', '2.5'),

            ]) : null,
        nivel === 0 || nivel === 2 || nivel === 3 ?
            (
                getItem(null, 'Vendedor', '3', <TeamOutlined />, [
                    getItem(() => navegacion('/inventario'), 'Inventario', '3.1'),
                    getItem(() => navegacion('/cliente'), 'Clientes', '3.2'),
                    getItem(() => navegacion('/venta'), 'Ventas', '3.3'),
                ])
            ) : null,
        nivel === 0 || nivel === 3 ?
            (
                getItem(null, 'Administrador', '4', <FolderOpenOutlined />, [
                    getItem(() => navegacion('/articulo'), 'Articulos', '4.1'),
                    getItem(() => navegacion('/producto_final'), 'Producción', '4.2'),
                    getItem(() => navegacion('/ventatotal'), 'Total ventas', '4.3'),
                ])
            ) : null,
        nivel === 0 || nivel === 3 ?
            (
                getItem(null, 'Reportería', '5', <PieChartOutlined />, [
                    //getItem(() => navegacion('/reportecalif'), 'Reporte', '5.1'),
                ])
            ) : null,
        getItem(() => navegacion('/editarusuario'), 'Mi usuario', '6', <UserOutlined />),
        getItem(() => Logout(), 'Cerrar sesión', '7', <LogoutOutlined />)
    ];
    return (
        <Layout hasSider
            style={{
                minHeight: '100vh',
            }}
            theme="light"
        >
            <Sider
                theme='light'
                collapsible
                width={`12rem`}
                //style={{ background: `white`}}
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)} >

                <div className="logo"
                    style={{
                        margin: `10px`,
                        display: `flex`,
                        alignItems: `center`,
                        justifyContent: `center`,
                        textAlign: `center`
                    }} >
                    {traduccionImg()}
                </div>
                {
                    <Menu
                        //defaultOpenKeys={['1']}
                        style={{
                            //height: '90%',
                            borderRight: 0,
                        }}
                        //theme='light'
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        items={items} />
                }
            </Sider>
            <Layout className="site-layout"
            >
                <Header
                    className="site-layout-background"
                //style={{ padding: 0 }}
                >
                    <div style={{ width: `100%`, color: `white` }}>
                        Usuario {usuario.nick}
                    </div>
                </Header>
                <Content>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }} >
                    © Andrés Vera 2023
                </Footer>
            </Layout>
            <FloatButton
                icon={<IoCartOutline />}
                //type="default"
                onClick={()=>navigate('/crearventa')}
                shape="square"
                description="Venta"
                style={{
                    right: 80,
                    width:`60px`
                }}
            />

            <FloatButton
                icon={<IoCheckboxOutline />}
                //type="default"
                onClick={()=>navigate('/inventario')}
                shape="square"
                description="Inventario"
                style={{
                    right: 160,
                    width:`60px`
                }}
            />
        </Layout>
    );
};
export default AppBar;
