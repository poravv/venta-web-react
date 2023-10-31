import '../../../CSS/Table.css';
import { Miles } from '../../Utils/NumerosALetras';

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const TemplateCertificado1ro = ({ certificado }) => {
    //console.log(certificado)
    const fecha = new Date();
    const styles = {
        page: {
            minHeight: `400px`,
            maxWidth: `950px`,
            paddingLeft: 40,
            paddingRight: 8,
            marginLeft: '1rem',
            backgroundColor: `white`,
        },
        header1: {
            marginTop: `30px`,
            textAlign: `center`,
            fontSize: `18px`,
        },
        header: {
            textAlign: `center`,
            fontSize: `18px`,
        },
        columnLayout: {
            display: 'flex',
            justifyContent: 'space-around',
            margin: '2rem 2rem 0 0',
            gap: '3rem',
            textAlign: `center`,
            fontSize: `9px`,
            //fontWeight: `bold`
        },
        footerPage: {
            position: `fixed`,
            bottom: 0,
            width: `40%`,
            display: 'flex',
            justifyContent: 'flex-start',
            //Separa los textos
            gap: '5rem',
            color: '#B1B1B1',
            //textAlign:`start`,
            fontSize: `8px`,
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

    return (
        <div>
            <div style={styles.page}>

                <div style={styles.header1}>
                    <img style={{ width: `300px` }} alt='...' src={`${require('../../Utils/img/PARAGUAY1.png')}`} />
                </div>

                <div style={styles.header}>
                    <div style={{ fontWeight: `bold` }}>{`COMANDO DE LA ARMADA`}</div>
                    <div style={{ fontWeight: `bold` }}>{`COMANDO DE INSTITUTOS NAVALES DE ENSEÑANZA`}</div>
                    <div style={{ fontWeight: `bold` }}>{certificado?.escuela}</div>
                    <div style={{ fontSize: `8px`, fontWeight: `bold`, fontStyle: `oblique` }}>{`Creado por Decreto Nº 11.075 del Poder Ejecutivo`}</div>
                </div>
                <hr style={{ marginTop: 8, marginBottom: 10 }} />
                <div style={{ fontSize: `14px`, textAlign: `justify`, lineHeight: `35px`, marginLeft: `40px`, marginRight: `40px` }}>
                    {certificado?.sexo === 'FE' ? `Habiendo la señora ` : `Habiendo el señor `}
                    <b style={{ fontSize: `20px` }}>{`${certificado?.nombres.toUpperCase()}, `}</b>
                    {`con Cédula de Identidad Número ${agregarSeparadorMiles(certificado?.documento)}, natural de la República del Paraguay, aprobado las materias conforme al Plan de Estudios vigente y cumpliendo los requisitos requeridos, se le confiere el certificado de:`}
                    <br />

                </div>

                <div style={{ textAlign: `center`, lineHeight: `50px`, marginLeft: `40px`, marginRight: `40px` }}>
                    <b style={{ fontSize: `25px` }}>
                        {certificado?.curso.toUpperCase()}
                    </b>
                </div>
                <div style={{ fontSize: `14px`, textAlign: `end`, lineHeight: `35px`, marginLeft: `40px`, marginRight: `40px` }}>
                    {`Dado en la ciudad de Asunción, a los ${Miles(fecha?.getDate())} días del mes de ${monthNames[fecha?.getMonth()].toUpperCase()} del año ${fecha?.getFullYear()}`}
                </div>
                <br />
                <br />
                <div style={styles.columnLayout}>
                    <div>
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        <b>{`${certificado?.subdirena_nombre?.toUpperCase()}`}</b>
                        <br />
                        <b>{`${certificado?.subdirena_grado} - ${certificado?.subdirena_cargo}`}</b>
                        <br />
                        {certificado?.subdirena_det1}
                        <br />
                        {certificado?.subdirena_det2}
                    </div>
                    <div>
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        <b>{`${certificado?.direna_nombre?.toUpperCase()}`}</b>
                        <br />
                        <b>{`${certificado?.direna_grado} - ${certificado?.direna_cargo}`}</b>
                        <br />
                        {certificado?.direna_det1}
                        <br />
                        {certificado?.direna_det2}
                    </div>
                </div>
                <div style={styles.columnLayout}>
                    <div>
                        <b>FIRMA DEL INTERESADO</b>
                        <br />
                        <b>VALIDO 5 AÑOS</b>
                    </div>
                </div>
                <div style={styles.footerPage}>
                    <div>
                        <hr style={{ marginTop: 8, marginBottom: 8 }} />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateCertificado1ro;