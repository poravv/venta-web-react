// eslint-disable-next-line
import { Buffer } from 'buffer';
import { Image, Col, Row } from 'antd';
import '../../../CSS/Table.css';
import { } from '../../Utils/NumerosALetras';
const fecha = new Date();

const PBIPTemplate = ({ cuerpo, vencimiento, certEst, evaluacionesDet }) => {
    //console.log(certEst)
    const styles = {
        page: {
            maxWidth: `580px`,
            paddingLeft: 20,
            paddingRight: 8,
            marginLeft: '1rem',
            backgroundColor: `white`,
            minHeight: `850px`,
            //backgroundImage: `url(${require('../../Utils/img/logoena.jpeg')})`,
            //opacity: 0.10,
            //backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1)),url(${require('../../Utils/img/logoena.jpeg')})`,
            //backgroundPosition: 'center',
            //backgroundSize: 'cover',
            //backgroundRepeat: 'no-repeat',
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
            bottom: 0,
            width: `100%`,
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '5rem',
            color: '#B1B1B1',
            fontSize: `8px`,
        },
        footLine: {
            position: `fixed`,
            bottom: 0,
            width: `100%`,
            display: 'flex',
            justifyContent: 'flex-start',
            //margin: '2rem 0 5rem 0',
            //Separa los textos
            gap: '5rem',
            color: '#B1B1B1',
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

    const traduccionImg = (img) => {
        /*
        if (img && typeof img !== "string") {
            const asciiTraducido = Buffer.from(img.data).toString('ascii');
            if (asciiTraducido) {
                return (
                    <Image
                        style={{ maxHeight: `50px`, maxWidth: `50px` }}
                        preview={false}
                        alt="imagen"
                        src={asciiTraducido}
                    />
                );
            } else { return null }
        }*/
        return (
            <Image
                style={{ maxHeight: `50px`, maxWidth: `50px` }}
                preview={false}
                alt="imagen"
                src={require('../../Utils/img/logoena.jpeg')}
            />
        );
    }

    return (
        <>
            <div style={styles.page}>
                <div style={styles.header}>
                    <div style={{ marginTop: `15px`, marginBottom: `5px` }}>
                        <Image
                            style={{ maxHeight: `50px`, maxWidth: `50px` }}
                            preview={false}
                            alt="imagen"
                            src={require('../../Utils/img/escudo_py.png')}
                        />
                    </div>
                    <Col style={{ width: `100%` }}>
                        <div style={{ fontWeight: `bold`, fontSize: `25px` }}>{`REPUBLICA DEL PARAGUAY`}</div>
                        <div style={{ fontWeight: `bold`, fontSize: `20px`, margin: `-5px` }}>{`COMANDO DE INSTITUTOS NAVALES DE ENSEÑANZA`}</div>
                        <div style={{ fontWeight: `bold`, fontSize: `15px`, margin: `-5px` }}>{`ESCUELA NAUTICA DE LA ARMADA`}</div>
                        <div style={{ fontWeight: `bold`, fontSize: `10px`, margin: `-5px` }}>{`Decreto Nº 11.075 del Poder Ejecutivo`}</div>
                    </Col>
                    <div style={{ marginTop: `15px`, marginBottom: `10px` }}>
                        {traduccionImg(certEst?.img)}
                    </div>
                </div>
                <div style={{ fontSize: `10px`, textAlign: `center`, marginLeft: `30px`, marginRight: `30px`, fontStyle: `italic` }}>
                    <b>{(cuerpo === null || cuerpo === '') ? `Certificado emitido conforme a lo dispuesto en el CONVENIO INTERNACIONAL PARA LA SEGURIDAD DE LA VIDA HUMANA EN MAR (SOLAS), 1974, EQUIVALENTE AL CONVENIO INTERNACIONAL SOBRE NORMAS DE FORMACION, TITULACION Y GUARDIA PARA LA GENTE DE MAR, 1978, ENMENDADO EN EL 2010 CERTIFICATE ISSUED UNDER THE PROVISIONS OF THE INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA (SOLAS), 1974, EQUIVALENT TO STANDARDS OF TRAINING AND WATCHKEEPING INTERNACIONAL CONVENTION (STCW 60.3), 1978, AS AMENDED IN 2010` : cuerpo}</b>
                    <br />
                    <br />

                </div>
                <div style={{ fontSize: `10px`, textAlign: `left`, marginLeft: `30px`, marginRight: `30px`, fontWeight: `normal` }}>
                    <b style={{ fontSize: `12px` }}>{`LA ESCUELA NAUTICA DE LA ARMADA CERTIFICA QUE:`}</b><br />
                    {`THE NAUTICAL SCHOOL OF THE NAVY CERTIFY THAT:`}<br />
                    <Row style={{ flexWrap: `nowrap` }}>
                        <Col sm={10}>
                            <b>{`Nombre: `}</b>
                            <p style={{ fontSize: `8px` }}>{`Name `}</p>
                        </Col>
                        <Col >{certEst?.nombres}</Col>
                    </Row>
                    <Row style={{ marginTop: `-10px`, flexWrap: `nowrap` }}>
                        <Col sm={10}>
                            <b>{`Nacionalidad`}</b>
                            <p style={{ fontSize: `8px` }}>{`Nacionality`}</p>
                        </Col>
                        <Col>{certEst?.gentilicio}</Col>
                    </Row>
                    <Row style={{ marginTop: `-10px`, flexWrap: `nowrap` }}>
                        <Col sm={10}>
                            <b>{`Fecha de nacimiento :`}</b>
                            <p style={{ fontSize: `8px` }}>{`Date of birth`}</p>
                        </Col>
                        <Col>{certEst?.fnacimiento}</Col>
                    </Row>
                    <Row style={{ marginTop: `-10px`, flexWrap: `nowrap` }}>
                        <Col sm={10}>
                            <b>{`Documento de Identidad :`}</b>
                            <p style={{ fontSize: `8px` }}>{`IdentityDocument `}</p>
                        </Col>
                        <Col>{agregarSeparadorMiles(certEst?.documento)}</Col>
                    </Row>
                    <Row style={{ marginTop: `-10px`, flexWrap: `nowrap` }}>
                        <Col >
                            <b>{`HA APROBADO LOS SIGUIENTES CURSOS:`}</b>
                            <p style={{ fontSize: `8px` }}>{`Has approved the following courses:`}</p>
                        </Col>
                    </Row>
                    {evaluacionesDet.map((row, index) => (
                        <Row key={index + 1} style={{ fontSize: `10px` }}>* {row?.descripcion}</Row>
                    ))}
                    <Row style={{ flexWrap: `nowrap`, marginTop: `8px` }}>
                        <Col sm={10}>
                            <b>{`Lugar /Fecha de expedición:`}</b>
                            <p style={{ fontSize: `8px` }}>{`(Place/Date of issue)`}</p>
                        </Col>
                        <Col>ASUNCIÓN {fecha?.getDate() + '/' + (fecha?.getMonth() + 1) + '/' + fecha?.getFullYear()}</Col>
                    </Row>
                    <Row style={{ marginTop: `-10px`, flexWrap: `nowrap` }}>
                        <Col sm={10}>
                            <b>{`Vencimiento: `}</b>
                            <p style={{ fontSize: `8px` }}>{`(Expiration)`}</p>
                        </Col>
                        <Col>{(vencimiento === null || vencimiento === '') ? (fecha?.getDate() + '/' + (fecha?.getMonth() + 1) + '/' + (fecha?.getFullYear() + 5)) : vencimiento}</Col>
                    </Row>


                </div>
                <div style={styles.columnLayout}>
                    <div >
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        {`${certEst?.subdirena_nombre?.toUpperCase()}`}
                        <br />
                        {`${certEst?.subdirena_grado} - ${certEst?.subdirena_cargo}`}
                    </div>
                    <div>
                        {/*<img style={styles.fullWidth} src="photo-2.png" />*/}
                        {`${certEst?.direna_nombre?.toUpperCase()}`}
                        <br />
                        {`${certEst?.direna_grado} - ${certEst?.direna_cargo}`}
                        <p style={{ fontSize: `8px`, fontWeight: `none` }}>{certEst?.direna_det1}</p>
                        <p style={{ fontSize: `8px`, marginTop: `-20px`, fontWeight: `none` }}>{certEst?.direna_det2}</p>
                    </div>
                </div>

            </div>
        </>
    );
};

export default PBIPTemplate;