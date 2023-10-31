import { Buffer } from 'buffer';
import { Image } from 'antd';
import '../../../CSS/Table.css';
import {Miles} from '../../Utils/NumerosALetras';

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ActaTemplate = ({ acta, evaluacionesDet }) => {
    const fecha = new Date();
    const styles = {
        page: {
            width: `580px`,
            heigth: `2000px`,
            paddingLeft: 20,
            paddingRight: 8,
            marginLeft: '1rem',
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
    // eslint-disable-next-line
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
        if (img && typeof img !== "string") {
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
        }
    }

    return (
        <>
            <div style={styles.page}>
                <div style={styles.header}>
                    <div style={{ fontWeight: `bold`,marginTop:`10px` }}>{`“SESQUICENTENARIO DE LA EPOPEYA NACIONAL 1864 - 1870”`}</div>
                    {traduccionImg(acta?.img)}
                    <div style={{ fontWeight: `bold` }}>{`COMANDO DE INSTITUTOS NAVALES DE ENSEÑANZA`}</div>
                    <div style={{ fontSize: `9px`, fontWeight: `bold` }}>{`ESCUELA DE COMANDO Y ESTADO MAYOR DE LA ARMADA`}</div>
                    <div style={{ fontSize: `8px`, fontWeight: `bold` }}>{`Oficina de Evaluación y Control`}</div>
                    <div style={{ fontSize: `8px`, fontWeight: `bold` }}>{`***`}</div>
                    <div style={{ fontSize: `9px`, fontWeight: `bold` }}>{`ACTA DE CALIFICACIONES FINALES N° 7/23`}</div>
                </div>

                <hr style={{ marginTop: 8, marginBottom: 8 }} />

                <div style={{ fontSize: `9px`, textAlign: `justify` }}>
                    {`En la Ciudad de Asunción, Capital de la República del Paraguay, a los ${Miles(fecha?.getDate())} días del mes de ${monthNames[fecha?.getMonth()].toUpperCase()} del año ${Miles(fecha?.getFullYear())}, siendo las ${fecha.getHours()}${fecha.getMinutes()} horas, en la Jefatura de Estudios de la Escuela de Comando y Estado Mayor (ECEMA), se reúnen el Profesor Titular de la materia`} 
                    <b>{` ${acta?.descripcion.toUpperCase()}, `}</b>
                    <b>{`${acta?.grado_profesor} ${acta?.profesor?.toUpperCase()}`}</b>
                    {` y el Jefe de Estudios de la ECEMA, `}
                    <b>{`${acta?.grado_je}  ${acta?.jefe_estudio.toUpperCase()}, `}</b>
                    {`a los efectos de dejar constancia bajo acta las Calificaciones Finales de la mencionada materia correspondientes al Periodo `}
                    <b>{`${evaluacionesDet[0]?.tipo} `}</b>
                    {`del presente año lectivo, de los Alumnos de la Escuela de ${acta?.escuela}, conforme se mencionan a continuación:----------------------------------------------------------`}
                    <br/>
                </div>

                <div style={{ fontSize: `9px`, textAlign: `center` }}>
                    <table >
                        <thead >
                        <tr>
                                <th style={{ border:`1px solid #d9d9d9`,backgroundColor:`white` }} rowSpan={2} >N°</th>
                                <th style={{ border:`1px solid #d9d9d9`,backgroundColor:`white`  }} rowSpan={2}  >Grados</th>
                                <th style={{ border:`1px solid #d9d9d9`,backgroundColor:`white`  }} rowSpan={2}  >Nombre y Apellido</th>
                                <th style={{ border:`1px solid #d9d9d9`,backgroundColor:`white`  }} rowSpan={2}  >C.I.C. N°</th>
                                <th style={{ border:`1px solid #d9d9d9`,backgroundColor:`white`  }} colSpan={2} >Calificación</th>
                            </tr>
                            <tr style={{ textAlign: `center` }} >
                                <td style={{ border:`1px solid #d9d9d9`,backgroundColor:`white`  }} >N°</td>
                                <td style={{ border:`1px solid #d9d9d9`,backgroundColor:`white`  }} >Letras</td>
                            </tr>
                        </thead>
                        <tbody>
                            {evaluacionesDet?.map((d,index) => {
                                return (
                                    <tr key={index}>
                                        <td >{index+1}</td>
                                        <td >{d.grado}</td>
                                        <td >{d.nombres}</td>
                                        <td >{d.documento}</td>
                                        <td >{d.calificacion}</td>
                                        <td >{d.letra}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ fontSize: `9px`, textAlign: `justify` }}  >
                    {`Se deja constancia que forma parte integrante de la presente acta, la Planilla de Calificaciones Finales suscripta por el Titular de la mencionada materia. ------------------------------------------------------------------------- `}
                    <br/>
                    {`En prueba de conformidad se labra la presente Acta, en dos copias de un solo tenor y un mismo efecto, firmando al pie de la misma el Docente Titular de la Materia y el Jefe de Estudios de la ECEMA, con el Visto Bueno del Señor Comandante de la Escuela de Comando y Estado Mayor de la Armada, ${acta?.grado_comandante} ${acta?.comandante?.toUpperCase()}. ----------------------`}
                </div>
                <div style={styles.columnLayout}>
                    <div>
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        {`${acta?.jefe_estudio?.toUpperCase()}`}
                        <br />
                        {`${acta?.grado_je} - ${acta?.cargo_je}`}
                    </div>
                    <div>
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        {`${acta?.profesor?.toUpperCase()}`}
                        <br />
                        {`${acta?.grado_profesor} - Docente Titular`}
                    </div>
                </div>
                <div style={styles.columnLayout}>
                    <div>
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        {`${acta?.comandante?.toUpperCase()}`}
                        <br />
                        {`${acta?.grado_comandante} - ${acta?.cargo_comandante}`}
                    </div>
                </div>
                <div style={styles.footerPage}>
                    <div>
                        <hr style={{ marginTop: 8, marginBottom: 8 }} />
                        <b>{`Los periodos de evaluación a ser implementados serán los siguientes: Periodo ${evaluacionesDet[0]?.tipo}, Periodo Complementario y Período Extraordinario, Art. 6° del Reglamento de Evaluación del CINAE (R-201).-`}</b>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ActaTemplate;