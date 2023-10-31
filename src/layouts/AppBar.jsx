import React, { useState } from 'react';
import {
    HomeOutlined,
    TeamOutlined,
    ToolOutlined,
    LogoutOutlined,
    PieChartOutlined,
    FolderOpenOutlined,
    CheckSquareOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Image } from 'antd';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Logout } from '../services/Login';

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
        //getItem(() => navegacion('/tablemodel'), 'Option 2', '2', <DesktopOutlined />),
        nivel === 0 || nivel === 1 ?
            getItem(null, 'Mantenimiento', '2', <ToolOutlined />, [
                getItem(() => navegacion('/usuario'), 'Usuarios', '2.0'),
                getItem(() => navegacion('/ciudad'), 'Ciudad', '2.1'),
                getItem(() => navegacion('/sucursal'), 'Sucursal', '2.2'),
                getItem(() => navegacion('/proveedor'), 'Proveedor', '2.3'),
                getItem(() => navegacion('/articulo'), 'Articulos', '2.4'),
                getItem(() => navegacion('/producto_final'), 'Producto', '2.5'),
                getItem(() => navegacion('/inventario'), 'Inventario', '2.6'),
                getItem(() => navegacion('/persona'), 'Personas', '2.7'),
                getItem(() => navegacion('/cliente'), 'Clientes', '2.8'),
                getItem(() => navegacion('/venta'), 'Ventas', '2.9'),
                getItem(() => navegacion('/ventatotal'), 'Total ventas', '2.10'),
            ]) : null,
        nivel === 0 || nivel === 2 ?
            (
                getItem(null, 'Administrativo', '3', <TeamOutlined />, [
                    getItem(() => navegacion('/instructor'), 'Instructores', '3.1'),
                ])
            ) : null,
        nivel === 0 || nivel === 2 ?
            (
                getItem(null, 'Académico', '4', <FolderOpenOutlined />, [
                    getItem(() => navegacion('/plan'), 'Planificación', '4.1'),
                    getItem(() => navegacion('/convocatoria'), 'Convocatoria', '4.2'),
                    getItem(() => navegacion('/faltas'), 'Aptitud Militar', '4.3'),
                ])
            ) : null,
        nivel === 3 ?
            (
                getItem(null, 'Gestión', '5', <CheckSquareOutlined />, [
                    getItem(() => navegacion('/gestion'), 'Gestión cursos', '5.1'),
                ])
            ) : null,
        nivel === 0 || nivel === 2 ?
            (getItem(null, 'Reportes', '6', <PieChartOutlined />, [
                //getItem(() => navegacion('/'), 'Estadisticas', '18'),
                getItem(() => navegacion('/reportecalif'), 'Calificaciones', '6.1'),
                getItem(() => navegacion('/acta'), 'Acta C.F.', '6.3'),
                getItem(() => navegacion('/cert_estudio'), 'Certif. de Estudio', '6.2'),
                (sucursal?.body?.idsucursal === 10 || sucursal?.body?.nivel === 0) ? (getItem(() => navegacion('/resenamod'), 'Res. ENA M.', '6.6')) : null,
                (sucursal?.body?.idsucursal === 10 || sucursal?.body?.nivel === 0) ? (getItem(() => navegacion('/cert1ro'), 'Certif. ENA', '6.4')) : null,
                //getItem(() => navegacion('/resena'), 'Res. ENA', '6.5'),
                getItem(() => navegacion('/pbip'), 'Certif. PBIP', '6.7'),
            ]))
            : null,
        nivel === 4 ?
            (getItem(() => navegacion('/miscursos'), 'Mis cursos', '7', <FolderOpenOutlined />))
            : null,
        getItem(() => navegacion('/editarusuario'), 'Mi usuario', '8', <UserOutlined />),
        getItem(() => Logout(), 'Cerrar sesión', '9', <LogoutOutlined />)
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
        </Layout>
    );
};
export default AppBar;
