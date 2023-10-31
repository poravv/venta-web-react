// eslint-disable-next-line
import { Buffer } from 'buffer';
import { Image } from 'antd';
import '../../../CSS/Table.css';
// eslint-disable-next-line
import { Miles } from '../../Utils/NumerosALetras';

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ResolucionENATemplate = ({ numero, resolucion, list_estudiantes }) => {
    //console.log(resolucion)
    const fecha = new Date();
    const styles = {
        page: {
            width: `500px`,
            heigth: `2000px`,
            paddingLeft: 20,
            paddingRight: 8,
            marginLeft: '3rem',
            backgroundColor: `white`,
            height: `760px`
        },
        header: {
            textAlign: `center`,
            fontSize: `11px`,
        },
        columnLayout: {
            display: 'flex',
            justifyContent: 'space-around',
            margin: '2rem 2rem 0 0',
            //Separa los textos
            gap: '3rem',
            textAlign: `center`,
            fontSize: `9px`,
            //backgroundColor:`red`, 
            fontWeight: `bold`
        },
        footerPage: {
            position: `fixed`,
            bottom: 0,
            width: `40%`,
            //backgroundColor:`black`,
            display: 'flex',
            justifyContent: 'flex-start',
            //margin: '2rem 0 5rem 0',
            //Separa los textos
            gap: '5rem',
            color: '#B1B1B1',
            //textAlign:`start`,
            fontSize: `8px`,
            //backgroundColor:`red`, 
            //fontWeight: `bold`
        },
        marginb0: {
            marginBottom: 0,
        },
    };
    
    function agregarSeparadorMiles(num) {
        if (num !== 'undefine') {
            let partesNumero = num.toString().split('.');
            partesNumero[0] = partesNumero[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return partesNumero.join('.');
        }
        else {
            return null;
        }
    }

    const traduccionImg = (img) => {
        /* if (img && typeof img !== "string") {
             const asciiTraducido = Buffer.from(img.data).toString('ascii');
             if (asciiTraducido) {
                 return (
                     <Image
                         style={{ maxHeight: `45px`, maxWidth: `45px` }}
                         preview={false}
                         alt="imagen"
                         src={asciiTraducido}
                     />
                 );
             } else { return null }
         }*/
        return <Image
            style={{ maxHeight: `45px`, maxWidth: `45px` }}
            preview={false}
            alt="imagen"
            src={require('../../Utils/img/logoena.jpeg')}
        />
    }

    return (
        <>
            <div style={styles.page}>
                <div style={styles.header}>
                    <div style={{ fontWeight: `bold`, marginTop: `40px` }}>{`“SESQUICENTENARIO DE LA EPOPEYA NACIONAL”`}</div>
                    {traduccionImg(resolucion?.img)}
                    <div style={{ fontWeight: `bold` }}>{`COMANDO DE INSTITUTOS NAVALES DE ENSEÑANZA`}</div>
                    <div style={{ fontSize: `9px`, fontWeight: `bold` }}>{`ESCUELA NAUTICA DE LA ARMADA`}</div>
                    <div style={{ fontSize: `7px`, fontWeight: `bold`, fontStyle: `italic` }}>{`Dirección`}</div>
                    <div style={{ fontSize: `9px`, fontWeight: `bold`, textDecoration: `underline`, fontStyle: `italic`, marginTop: `10px` }}>{`RESOLUCION Nº ${numero}`}</div>
                    <div style={{ fontSize: `9px`, fontWeight: `bold`, textAlign: `end`, fontStyle: `italic` }}>{`Asunción, ${fecha?.getDate()} de ${monthNames[fecha?.getMonth()]} del ${fecha?.getFullYear()}`}</div>
                </div>
                <br />
                <div className='row'>
                    <div className='col-3' style={{ fontSize: `9px`, textAlign: `justify`, fontStyle: `italic` }}>
                        <b>VISTO:</b>
                    </div>
                    <div className='col' style={{ fontSize: `9px`, textAlign: `justify`, textIndent: `-30px` }}>
                        {`La Nota elevada por la Dirección Académica de la Escuela Náutica de la Armada (ENA), en la cual fue desarrollada el "${resolucion?.curso}" desarrollado del ${resolucion?.finicio} al ${resolucion?.ffin}, conforme a lo establecido en el calendario anual de la ENA; y `}
                    </div>
                </div>
                <br />
                <div className='row'>
                    <div className='col-3' style={{ fontSize: `9px`, textAlign: `justify`, fontStyle: `italic` }}>
                        <b>CONSIDERANDO:</b>
                    </div>
                    <div className='col' style={{ fontSize: `9px`, textAlign: `justify`, textIndent: `-30px` }}>
                        {`El Decreto N° 11075 del 19 de Octubre de 2007, por el cual se crea la Escuela Náutica de la Armada (ENA), dependiente del Comando de Institutos Navales de Enseñanza, quien se encargará de la formación y capacitación profesional del personal de de Empresas Navieras y Puertos Privados, para adecuarse a los requerimientos de las Leyes Nacionales vigentes y otras normas Internacionales, exigidas por la Organización Marítima Internacional (OMI). La Resolución N° 439/2021, del Ministerio de Educación y Ciencias (MEC), de fecha 28 de Diciembre de 2021, por la cual se habilitan cursos.`}
                    </div>
                </div>
                <div style={{ fontSize: `10px` }}><b>{`Por tanto, `}</b>{`en uso de sus atribuciones`}</div>
                <div style={{ fontSize: `11px`, textAlign: `center`, fontStyle: `italic`, fontWeight: `bold`, marginTop: `8px` }}>EL DIRECTOR DE LA ESCUELA NAUTICA DE LA ARMADA</div>
                <div style={{ fontSize: `11px`, textAlign: `center`, fontStyle: `italic`, fontWeight: `bold`, marginTop: `8px` }}>RESUELVE</div>
                <br />
                <div style={{ fontSize: `10px`, fontStyle: `italic` }}>
                    <b>{`1°. Reconócese el estudio correspondiente al "${resolucion?.curso}", `}</b>{`realizado por los siguientes personales de  Empresas Navieras y Puertos Privados:`}
                </div>
                <div style={{ fontSize: `9px`, textAlign: `center`, margin: `10px` }}>
                    <table style={{ fontStyle: `italic` }}>
                        <thead >
                            <tr style={{ border: `none`, textAlign: `start` }}>
                                <th style={{ backgroundColor: `white` }} rowSpan={2} >N°</th>
                                <th style={{ backgroundColor: `white` }} rowSpan={2}  >Grados</th>
                                <th style={{ backgroundColor: `white` }} rowSpan={2}  >Nombre y Apellido</th>
                                <th style={{ backgroundColor: `white` }} rowSpan={2}  >C.I.C. N°</th>
                                <th style={{ backgroundColor: `white` }} rowSpan={2}  >REGISTRO ENA N°</th>
                            </tr>
                        </thead>
                        <tbody >
                            {list_estudiantes?.map((d, index) => {
                                return (
                                    <tr key={index} style={{ border: `none`, textAlign: `start` }}>
                                        <td style={{ border: `none` }}>{index + 1}</td>
                                        <td style={{ border: `none` }}>{d.grado}</td>
                                        <td style={{ border: `none` }}>{d.nombres}</td>
                                        <td style={{ border: `none` }}>{agregarSeparadorMiles(d.documento)}</td>
                                        <td style={{ border: `none` }}>{d.registro}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ fontSize: `10px`, textAlign: `justify`, fontStyle: `italic` }}  >
                    <b>{`2°. Expídaseles`}</b>{`el certificado respectivo.`}
                    <br />
                    <b>{`3°. Archivar `}</b>{`en el “Libro de Registros de Certificados Concedidos”.`}
                    <br />
                    <b>{`4º. Comuníquese a `}</b>{`quienes corresponda para su cumplimiento.`}

                </div>
                <br />
                <br />
                <div style={styles.columnLayout}>
                    <div>
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        <b>{`${resolucion?.nombres?.toUpperCase()}`}</b>
                        <br />
                        <b>{`${resolucion?.grado} - ${resolucion?.cargo}`}</b>
                    </div>
                </div>
                <div style={styles.footerPage}>
                    <div>
                        <hr style={{ marginTop: 8, marginBottom: 8 }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResolucionENATemplate;