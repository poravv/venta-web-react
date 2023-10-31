import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ListaCiudad from '../components/Referenciales/Ciudad/ListaCiudad';
import NuevoCiudad from '../components/Referenciales/Ciudad/NuevoCiudad';
import ListaProveedor from '../components/Referenciales/Proveedor/ListaProveedor';
import NuevoProveedor from '../components/Referenciales/Proveedor/NuevoProveedor';
import NuevaSucursal from '../components/Referenciales/Sucursal/NuevaSucursal';
import ListaSucursal from '../components/Referenciales/Sucursal/ListaSucursal';
import Inicio from '../components/Inicio';
import AppBar from './AppBar';
import ListaPersona from '../components/Referenciales/Persona/ListaPersona';
import NuevoPersona from '../components/Referenciales/Persona/NuevaPersona';
import ListaUsuario from '../components/Referenciales/Usuario/ListaUsuario';
import NuevoUsuario from '../components/Referenciales/Usuario/NuevoUsuario';
import EditarUsuario from '../components/Referenciales/Usuario/EditarUsuario';
import ListaArticulo from '../components/Referenciales/Articulo/ListaArticulo';
import NuevoArticulo from '../components/Referenciales/Articulo/NuevoArticulo';
import ListaProductoFinal from '../components/Referenciales/Producto_final/ListaProductoFinal';
import NuevoProductoFinal from '../components/Referenciales/Producto_final/NuevoProductoFinal';
import ListaInventario from '../components/Referenciales/inventario/ListaInventario';
import NuevoInventario from '../components/Referenciales/inventario/NuevoInventario';
import ListaCliente from '../components/Referenciales/Cliente/ListaCliente';
import NuevoCliente from '../components/Referenciales/Cliente/NuevoCliente';
import ListaVenta from '../components/Referenciales/Venta/ListaVenta';
import NuevoVenta from '../components/Referenciales/Venta/NuevaVenta';
import ListaVentaTotal from '../components/Referenciales/Venta/ListaVentaTotal';
//import TableFormat from '../components/TableModel/Table';
//import ReporteCalificaciones from '../components/Reportes/Calificaciones/Calificaciones';
//import ReporteActa from '../components/Reportes/Acta/Acta';
//import CertificadoEstudio from '../components/Reportes/Certificado/CertificadoEstudio';
//import Certificado1ro from '../components/Reportes/Certificado1ro/Certificado1ro';
//import ResolucionENA from '../components/Reportes/ResolucionEna/ResolucionENA';
//import ResolucionENAModif from '../components/Reportes/ResolucionEnaModif/ResolucionENAModif';
//import PBIP from '../components/Reportes/PBIP/PBIP';

function NavRoute({ usuario, sucursal }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppBar usuario={usuario.body} sucursal={sucursal} nivel={usuario.body.nivel} />} >
            <Route index element={<Inicio idsucursal={usuario.body.idsucursal} token={usuario.token} usuario={usuario.body.usuario} />} />
            <Route path='/inicio' element={<Inicio idsucursal={usuario.body.idsucursal} token={usuario.token} usuario={usuario.body.usuario} />} />
            {
              (usuario.body.nivel === 1 || usuario.body.nivel === 0) ?
                <>
                  #Ciudad
                  <Route path='/ciudad' element={<ListaCiudad token={usuario.token} />} />
                  <Route path='/crearciudad' element={<NuevoCiudad token={usuario.token} />} />
                  #Proveedor
                  <Route path='/proveedor' element={<ListaProveedor token={usuario.token} />} />
                  <Route path='/crearproveedor' element={<NuevoProveedor token={usuario.token} />} />
                  #Sucursal
                  <Route path='/sucursal' element={<ListaSucursal idsucursal={usuario.body.idsucursal} token={usuario.token} />} />
                  <Route path='/crearsucursal' element={<NuevaSucursal idsucursal={usuario.body.idsucursal} idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  #Articulo
                  <Route path='/articulo' element={<ListaArticulo token={usuario.token} />} />
                  <Route path='/creararticulo' element={<NuevoArticulo token={usuario.token} />} />
                  #ProductoFinal
                  <Route path='/producto_final' element={<ListaProductoFinal token={usuario.token} />} />
                  <Route path='/crearproducto_final' element={<NuevoProductoFinal token={usuario.token} />} />
                  #Inventario
                  <Route path='/inventario' element={<ListaInventario token={usuario.token} />} />
                  <Route path='/crearinventario' element={<NuevoInventario token={usuario.token} />} />
                  #Persona
                  <Route path='/persona' element={<ListaPersona token={usuario.token} />} />
                  <Route path='/crearpersona' element={<NuevoPersona token={usuario.token} />} />
                  #Cliente
                  <Route path='/cliente' element={<ListaCliente token={usuario.token} />} />
                  <Route path='/crearcliente' element={<NuevoCliente token={usuario.token} />} />
                  #Usuario
                  <Route path='/usuario' element={<ListaUsuario token={usuario.token} />} />
                  <Route path='/crearusuario' element={<NuevoUsuario token={usuario.token} />} />
                  <Route path='/editarusuario' element={<EditarUsuario token={usuario.token} idusuario={usuario.body.idusuario} />} />
                  #Venta
                  <Route path='/venta' element={<ListaVenta token={usuario.token} />} />
                  <Route path='/ventatotal' element={<ListaVentaTotal token={usuario.token} />} />
                  <Route path='/crearventa' element={<NuevoVenta token={usuario.token} />} />

                </>
                : null
            }
          </Route>

        </Routes>
        <Routes path='*' element={<Navigate replace to='/' />} />
      </BrowserRouter>
    </>
  )
}
export default NavRoute;

/*
 {
              (usuario.body.nivel === 0 || usuario.body.nivel === 1 || usuario.body.nivel === 2 || usuario.body.nivel === 3) ?
                <>
                <Route path='/pbip' element={<PBIP token={usuario.token} />} />
                  #Table model
                  <Route path='/tablemodel' element={<TableFormat title={'Formato'} />} />
                  #Aptitud
                  <Route path='/aptitud' element={<ListaAptitud token={usuario.token} />} />
                  <Route path='/crearaptitud' element={<NuevaAptitud token={usuario.token} />} />
                  #Reportes
                  <Route path='/reportecalif' element={<ReporteCalificaciones token={usuario.token} />} />
                  <Route path='/acta' element={<ReporteActa token={usuario.token} />} />
                  <Route path='/cert_estudio' element={<CertificadoEstudio token={usuario.token} sucursal={sucursal} idusuario={usuario.body.idusuario} />} />
                  <Route path='/cert1ro' element={<Certificado1ro token={usuario.token} />} />
                  <Route path='/resena' element={<ResolucionENA token={usuario.token} />} />
                  <Route path='/resenamod' element={<ResolucionENAModif token={usuario.token} />} />

                </>
                : null
            }
*/