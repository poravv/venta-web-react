import { Buffer } from 'buffer';
import { Image } from 'antd';
import '../../../CSS/Table.css';

const CertificadoEstudioTemplate = ({ certEst, evaluacionesDet }) => {

    const styles = {
        page: {
            maxWidth: `580px`,
            paddingLeft: 20,
            paddingRight: 8,
            marginLeft: '1rem',
            //marginRight: '25rem',
            //'page-break-after': 'always',
            backgroundColor: `white`,
            minHeight: `850px`
        },
        header: {
            textAlign: `center`,
            fontSize: `11px`,
        },

        columnLayout: {
            display: 'flex',
            justifyContent: 'space-around',
            margin: '2rem 0 1rem 0',
            //Separa los textos
            //gap: '2rem',
            textAlign: `center`,
            fontSize: `9px`,
            //backgroundColor:`red`, 
            fontWeight: `bold`
        },
        footerPage: {
            position: `fixed`,
            //position: `relative`,
            bottom: 0,
            width: `100%`,
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
        footLine: {
            position: `fixed`,
            bottom: 0,
            width: `100%`,
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
                    <div style={{ marginTop: `30px` }}>
                        {traduccionImg(certEst?.img)}
                    </div>
                            <div style={{ fontWeight: `bold` }}>{`COMANDO DE INSTITUTOS NAVALES DE ENSEÑANZA`}</div>
                            <div style={{ fontSize: `9px` }}>{`Reconocido como “Instituto de Educación Superior” por Ley Nº 2990 de fecha 10 de Agosto del 2006.`}</div>
                </div>
                {/*<div style={styles.spacer2}></div>...Para generar un espaciado*/}
                {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                <hr style={{ marginTop: 8, marginBottom: 8 }} />
                <div style={styles.header}>
                    <div style={{ fontSize: `10px`, fontWeight: `bold`, backgroundColor: `#B1B1B1`, marginTop: 0, marginBottom: 5, }}>{`CERTIFICADO DE ESTUDIOS Nº ${certEst?.repo_numero ? (certEst?.repo_numero.toString().length === 1 ? '00' + certEst?.repo_numero : (certEst?.repo_numero.toString().length) === 2 ? '0' + certEst?.repo_numero : certEst?.repo_numero) : null}`}</div>
                </div>
                <div style={{ fontSize: `9px`, textAlign: `justify` }}>
                    <b>{`El Director General del Comando de Institutos Navales de Enseñanza, Certifica:`}</b>
                    {certEst?.sexo === 'MA' ? (`que el Licenciado `) : (`que la Licenciada`)}
                    <b>{`${certEst?.nombres}`}</b>
                    {`, con Cédula de Identidad Civil `}
                    <b>{`Nº ${agregarSeparadorMiles(parseInt(certEst?.documento))}`}</b>
                    {`, de nacionalidad `}
                    <b>{`${certEst?.gentilicio}`}</b>
                    {`, egresado del `}
                    <b>{`Programa de ${certEst?.curso}`}</b>
                    {`, correspondiente al periodo lectivo `}
                    <b>{`${certEst?.anho}`}</b>
                    {`, con una carga horaria de `}
                    <b>{`${certEst?.horas_catedras} horas Cátedras, en la modalidad ${certEst?.nombres}`}</b>
                    {`, aprobó satisfactoriamente las asignaturas del Plan de Estudios vigente, con las calificaciones que se expresan a continuación:`}
                </div>

                <div style={{ fontSize: `9px`, textAlign: `center` }}>
                    <table >
                        <thead >
                            <tr>
                                <th style={{ backgroundColor: `#B1B1B1` }} colSpan={2} rowSpan={2} >Asignaturas</th>
                                <th style={{ backgroundColor: `#B1B1B1` }} colSpan={3} >Calificación</th>
                                <th style={{ backgroundColor: `#B1B1B1` }} rowSpan={2} >Carga horaria</th>
                            </tr>
                            <tr style={{ textAlign: `center` }} >
                                <td style={{ backgroundColor: `#B1B1B1` }} >N°</td>
                                <td style={{ backgroundColor: `#B1B1B1` }} >Letra</td>
                                <td style={{ backgroundColor: `#B1B1B1` }} >Periodo</td>
                            </tr>
                        </thead>
                        <tbody>
                            {evaluacionesDet.map((d) => {
                                return (
                                    <tr key={d.rownum}>
                                        <td >{d.rownum}</td>
                                        <td >{d.descripcion}</td>
                                        <td >{d.calificacion}</td>
                                        <td >{d.letra}</td>
                                        <td >{d.tipo}</td>
                                        <td >{d.carga_horaria}</td>
                                    </tr>
                                )
                            })}


                        </tbody>
                        <tfoot style={{ textAlign: `center` }}>
                            <tr>
                                <td style={{ padding: `0px`, fontWeight: `bold`, textAlign: `start`, backgroundColor: `white` }} colSpan={2} rowSpan={2} >Elaboración y defensa de tesis</td>
                                <td style={{ backgroundColor: `white` }} rowSpan={2} >5</td>
                                <td style={{ backgroundColor: `white` }} rowSpan={2}>Cinco</td>
                                <td style={{ padding: `0px`, fontWeight: `bold`, backgroundColor: `white` }} >N° de Acta</td>
                                <td style={{ padding: `0px`, textAlign: `start`, backgroundColor: `white` }} >{certEst?.idtesis ? certEst?.idtesis.toString().length === 1 ? '00' + certEst?.idtesis : (certEst?.idtesis.toString().length) === 2 ? '0' + certEst?.idtesis : certEst?.idtesis : null}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: `0px`, fontWeight: `bold` }} >Fecha</td>
                                {/*<td style={{ padding: `0px`, textAlign: `start` }} >{hoy.toLocaleDateString()}</td>*/}
                                <td style={{ padding: `0px`, textAlign: `start` }} >{certEst?.fecha_defensa}</td>
                            </tr>

                            <tr>
                                <td style={{ padding: `0px`, textAlign: `start` }} colSpan={2} >Título</td>
                                <td style={{ padding: `0px`, textAlign: `start` }} colSpan={4} >{certEst?.titulo}</td>
                            </tr>

                            <tr>
                                <td style={{ padding: `0px`, textAlign: `start` }} colSpan={2} >Area</td>
                                <td style={{ padding: `0px`, textAlign: `start` }} colSpan={4} >{certEst?.area}</td>
                            </tr>

                            <tr>
                                <td style={{ padding: `0px`, textAlign: `start` }} colSpan={2} >Linea de investigacion</td>
                                <td style={{ padding: `0px`, textAlign: `start` }} colSpan={4} >{certEst?.linea_investigacion}</td>
                            </tr>

                            <tr>
                                <td style={{ padding: `0px`, textAlign: `start`, fontWeight: `bold` }} colSpan={2} >Título obtenido</td>
                                <td style={{ padding: `0px`, textAlign: `start` }} colSpan={4} >{certEst?.titulo_obtenido}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: `0px`, textAlign: `start`, fontWeight: `bold` }} colSpan={2} >Promedio general</td>
                                <td style={{ padding: `0px`, textAlign: `start` }}  >{certEst?.promedio}</td>
                                <td style={{ padding: `0px`, textAlign: `start` }} colSpan={3} >{certEst?.letra_promedio}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: `0px`, textAlign: `start`, fontWeight: `bold` }} colSpan={2} >Duración del programa</td>
                                <td style={{ padding: `0px`, fontWeight: `bold`, textAlign: `start` }} colSpan={4} >{certEst?.duracion}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: `0px`, textAlign: `start`, fontWeight: `bold` }} colSpan={2} >Carga horaria total</td>
                                <td style={{ padding: `0px`, fontWeight: `bold`, textAlign: `start` }} colSpan={4} >{certEst?.horas_catedras}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div style={{ fontSize: `9px`, textAlign: `center`, marginTop: `10px` }}>
                    <table >
                        <thead>
                            <tr style={{ backgroundColor: `#B1B1B1` }}>
                                <th colSpan={6}>ASIGNATURAS</th>
                            </tr>
                            <tr>
                                <td style={{ padding: `0px`, fontSize: `7px` }} colSpan={6}>{`Los promedios finales obtenidos en cada materia son expresados según rendimiento Académico del 70 %. Según se indica a continuación:`}</td>
                            </tr>
                            <tr style={{ textAlign: `center` }} >
                                <th >MENCION</th>
                                <th >INSUFICIENTE</th>
                                <th >ACEPTABLE</th>
                                <th >BUENO</th>
                                <th >MUY BUENO</th>
                                <th >EXCELENTE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ textAlign: `center` }} >
                                <td >ESCALA</td>
                                <td >{`69% ->`}</td>
                                <td >{`70% - 77%`}</td>
                                <td >{`78% - 85%`}</td>
                                <td >{`86% - 93%`}</td>
                                <td >{`94% - 100%`}</td>
                            </tr>
                            <tr style={{ textAlign: `center` }} >
                                <td >NOTA</td>
                                <td >{`(1) uno`}</td>
                                <td >{`(2) dos`}</td>
                                <td >{`(3) tres`}</td>
                                <td >{`(4) cuatro`}</td>
                                <td >{`(5) cinco`}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ fontSize: `9px`, textAlign: `justify` }}  >
                    <b>{`A pedido del interesado, se expide el presente Certificado de Estudios, en la ciudad de Asunción, República del Paraguay a los veinte cinco días del mes de abril del año dos mil veintitrés. `}</b>
                </div>


                <div style={styles.columnLayout}>
                    <div >
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        {`${certEst?.director_academico?.toUpperCase()}`}
                        <br />
                        {`${certEst?.grado_academico} - ${certEst?.cargo_academico}`}
                    </div>
                    <div>
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        {`${certEst?.director?.toUpperCase()}`}
                        <br />
                        {`${certEst?.director_grado} - ${certEst?.cargo}`}
                    </div>
                </div>
                
                <div style={{ 
                    position: `fixed`,
                    bottom: 0, 
                    }}>
                    <hr style={{ marginTop: 8, marginBottom: 8 }} />
                </div>
                <div style={styles.footerPage}>
                    <div >
                        <b>{`Departamento: `}</b>{`Central`}
                        <br/>
                        <b>{`Dirección: `}</b>{`Carlos Antonio López E/ Ñuflo de Chávez`}
                        <br />
                        <b>{`Teléfono/Fax: `}</b>{`(021) 423 046`}
                        <br />
                    </div>
                    <div>
                        <b>{`Localidad: `}</b>{`Asunción`}
                        <br />
                        <b>{`Mail: `}</b>{`cinae.departamentoacademico@gmail.com`}
                        <br />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CertificadoEstudioTemplate;