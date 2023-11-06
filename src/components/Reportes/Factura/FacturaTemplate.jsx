import { Buffer } from 'buffer';
import { Col, Image, Row } from 'antd';
import '../../../CSS/Table.css';
import { agregarSeparadorMiles } from '../../Utils/separadorMiles';
import { useEffect, useState } from 'react';

const FacturaTemplate = ({ tmp_cabecera, tmp_detalle }) => {
    const [excenta, setExcenta] = useState(0);
    const [iva10, setIva10] = useState(0);
    const [iva5, setIva5] = useState(0);
    //console.log(tmp_cabecera)
    //console.log(tmp_detalle)
    const init = () => {
        let tmp_excenta = 0;
        let tmp_iva5 = 0;
        let tmp_iva10 = 0;
        tmp_detalle?.map((d) => {
            if (parseInt(d.producto_final.tipo_iva) === 0) {
                tmp_excenta+=(d.producto_final.costo * d.cantidad);
            }
            if (parseInt(d.producto_final.tipo_iva) === 5) {
                tmp_iva5+=(d.producto_final.costo * d.cantidad);
            }
            if (parseInt(d.producto_final.tipo_iva) === 10) {
                tmp_iva10+=(d.producto_final.costo * d.cantidad);
            }
            return true;
        });

        setExcenta(tmp_excenta);
        setIva5(tmp_iva5);
        setIva10(tmp_iva10);
    }

    useEffect(() => {
        init();
        // eslint-disable-next-line
    }, []);
    const styles = {
        page: {
            width: `580px`,
            paddingLeft: 20,
            paddingRight: 8,
            marginLeft: '1rem',
            //marginRight: '25rem',
            //'page-break-after': 'always',
            backgroundColor: `white`,
            minHeight: `850px`
        },
        cab: {
            marginTop: `100px`,
            textAlign: `center`,
            fontSize: `11px`,
            marginBottom: `5px`,
            border: `0.1px solid black`,
            borderRadius: `2px`
        },
        cli: {
            //marginTop: `2px`,
            textAlign: `center`,
            fontSize: `10px`,
            marginBottom: `5px`,
            border: `0.1px solid black`,
            borderRadius: `2px`
        },
        pie: {
            marginTop: `5px`,
            textAlign: `center`,
            fontSize: `10px`,
            marginBottom: `3px`,
            border: `0.1px solid black`,
            borderRadius: `2px`
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
            width: `500px`,
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


    //Toda la conf para la factura
    // eslint-disable-next-line
    const traduccionImg = (img) => {
        if (img && typeof img !== "string") {
            const asciiTraducido = Buffer.from(img.data).toString('ascii');
            if (asciiTraducido) {
                return (
                    <Image
                        style={{ height: `45px`, width: `45px` }}
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
                <div style={styles.cab}>
                    <Row style={{ margin: `5px` }}>
                        <Col style={{ width: `20%`, justifyContent: `start`, alignItems: `start`, textAlign: `start` }}>
                            <Image
                                style={{ height: `80px`, width: `80px` }}
                                preview={false}
                                alt="imagen"
                                src={require('../../Utils/img/vendelo.png')}
                            />
                        </Col>
                        <Col style={{ width: `40%` }}>
                            <div style={{ fontWeight: `bold`, fontSize: `16px`, display: `flex` }}>{`Vendelo SRL`}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Dirección: `}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Teléfono: `}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Correo: `}</div>
                        </Col>
                        <Col style={{ width: `40%` }}>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`RUC: `}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Timbrado N°: `}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Inicio de vigencia: `}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Factura electrónica N°: `}</div>
                        </Col>
                    </Row>
                </div>

                <div style={styles.cli}>
                    <Row style={{ margin: `5px` }}>
                        <Col style={{ width: `60%` }}>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Fecha de emisión: `}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Ruc/ Documento de identidad: ${tmp_cabecera?.cliente?.ruc}`}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Nombre o Razon social: ${tmp_cabecera?.cliente?.razon_social}`}</div>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Dirección: ${tmp_cabecera?.cliente?.direccion}`}</div>
                        </Col>
                        <Col style={{ width: `40%` }}>
                            <div style={{ fontWeight: `bold`, fontSize: `10px`, display: `flex` }}>{`Condición de venta: Contado`}</div>
                        </Col>
                    </Row>
                </div>
                <div style={{ fontSize: `9px`, textAlign: `center` }}>
                    <table style={{ border: `0.1px solid black` }}>
                        <thead style={{ border: `0.1px solid black` }}>
                            <tr style={{ border: `0.1px solid black` }}>
                                <th scope="col" style={{ fontWeight: `bold`, border: `0.1px solid black` }}>Cantidad</th>
                                <th scope="col" style={{ fontWeight: `bold`, border: `0.1px solid black` }}>Descripción</th>
                                <th scope="col" style={{ fontWeight: `bold`, border: `0.1px solid black` }}>Precio unitario</th>
                                <th scope="col" style={{ fontWeight: `bold`, border: `0.1px solid black` }}>Excentas</th>
                                <th scope="col" style={{ fontWeight: `bold`, border: `0.1px solid black` }}>IVA 5%</th>
                                <th scope="col" style={{ fontWeight: `bold`, border: `0.1px solid black` }}>IVA 10%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tmp_detalle?.map((d, index) => {
                                return (
                                    <tr key={index + 1} style={{ border: `0.1px solid black` }}>
                                        <td style={{ border: `0.1px solid black` }}>{d.cantidad}</td>
                                        <td style={{ border: `0.1px solid black` }}>{d.producto_final.nombre}</td>
                                        <td style={{ border: `0.1px solid black` }}>{agregarSeparadorMiles(parseInt(d.producto_final.costo))}</td>
                                        <td style={{ border: `0.1px solid black` }}>{agregarSeparadorMiles(parseInt(d.producto_final.tipo_iva) === 0 ? (d.producto_final.costo * d.cantidad) : 0)}</td>
                                        <td style={{ border: `0.1px solid black` }}>{agregarSeparadorMiles(parseInt(d.producto_final.tipo_iva) === 5 ? (d.producto_final.costo * d.cantidad) : 0)}</td>
                                        <td style={{ border: `0.1px solid black` }}>{agregarSeparadorMiles(parseInt(d.producto_final.tipo_iva) === 10 ? (d.producto_final.costo * d.cantidad) : 0)}</td>
                                    </tr>
                                );
                            })}
                            <tr style={{ border: `0.1px solid black` }}>
                                <td style={{ border: `0.1px solid black` }}>_</td>
                                <td style={{ border: `0.1px solid black` }}> </td>
                                <td style={{ border: `0.1px solid black` }}> </td>
                                <td style={{ border: `0.1px solid black` }}></td>
                                <td style={{ border: `0.1px solid black` }}></td>
                                <td style={{ border: `0.1px solid black` }}></td>
                            </tr>
                            <tr style={{ border: `0.1px solid black` }}>
                                <td style={{ border: `0.1px solid black` }}>_</td>
                                <td style={{ border: `0.1px solid black` }}> </td>
                                <td style={{ border: `0.1px solid black` }}> </td>
                                <td style={{ border: `0.1px solid black` }}></td>
                                <td style={{ border: `0.1px solid black` }}></td>
                                <td style={{ border: `0.1px solid black` }}></td>
                            </tr>
                            <tr style={{ border: `0.1px solid black` }}>
                                <td style={{ border: `0.1px solid black` }}>_</td>
                                <td style={{ border: `0.1px solid black` }}> </td>
                                <td style={{ border: `0.1px solid black` }}> </td>
                                <td style={{ border: `0.1px solid black` }}></td>
                                <td style={{ border: `0.1px solid black` }}></td>
                                <td style={{ border: `0.1px solid black` }}></td>
                            </tr>
                            <tr style={{ border: `0.1px solid black` }}>
                                <td style={{ border: `0.1px solid black` }}>_</td>
                                <td style={{ border: `0.1px solid black` }}> </td>
                                <td style={{ border: `0.1px solid black` }}> </td>
                                <td style={{ border: `0.1px solid black` }}></td>
                                <td style={{ border: `0.1px solid black` }}></td>
                                <td style={{ border: `0.1px solid black` }}></td>
                            </tr>
                        </tbody>
                        <tfoot style={{ textAlign: `center`, border: `0.1px solid black` }}>
                            <tr style={{ border: `0.1px solid black` }}>
                                <td style={{ backgroundColor: `white`, textAlign: `start`, border: `0.1px solid black` }} rowSpan={1} colSpan={3} >Valor parcial</td>
                                <td style={{ backgroundColor: `white`, border: `0.1px solid black` }} rowSpan={1}>{agregarSeparadorMiles(excenta)}</td>
                                <td style={{ padding: `0px`, backgroundColor: `white`, border: `0.1px solid black` }} >{agregarSeparadorMiles(iva5)}</td>
                                <td style={{ padding: `0px`, textAlign: `end`, backgroundColor: `white`, border: `0.1px solid black` }} >{agregarSeparadorMiles(iva10)}</td>
                            </tr>

                            <tr style={{ border: `0.1px solid black` }}>
                                <td style={{ backgroundColor: `white`, textAlign: `start`, border: `0.1px solid black` }} colSpan={5} >Total a pagar</td>
                                <td style={{ padding: `0px`,fontWeight:`bold`, textAlign: `end`, backgroundColor: `white`, border: `0.1px solid black` }} >{`${agregarSeparadorMiles(parseInt(tmp_cabecera?.total))}`}</td>
                            </tr>
                            <tr style={{ border: `0.1px solid black` }}>
                                <td style={{ backgroundColor: `white`, textAlign: `start`, border: `0.1px solid black` }} rowSpan={1} colSpan={3} >Liquidación de IVA</td>
                                <td style={{ backgroundColor: `white`, border: `0.1px solid black` }} rowSpan={1}>{`(5%)${agregarSeparadorMiles((iva5 * 5) / 100)} `}</td>
                                <td style={{ padding: `0px`, backgroundColor: `white`, border: `0.1px solid black` }} >{`(10%)${agregarSeparadorMiles((iva10 * 10) / 100)} `}</td>
                                <td style={{ padding: `0px`, textAlign: `end`, backgroundColor: `white`, border: `0.1px solid black` }} >{`(Total) ${agregarSeparadorMiles(parseInt(
                                    ((iva5 * 5) / 100)+((iva10 * 10) / 100)
                                ))}`}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div style={{
                    position: `fixed`,
                    bottom: 0,
                }}>
                    <hr style={{ marginTop: 8, marginBottom: 8 }} />
                </div>
                <div style={styles.footerPage}>
                    <div >
                        {`Si su documento electrónico presenta algún error puede solicitar la modificación dentro de las 72 horas siguientes de la emisión de este comprobante.`}
                        <br />
                    </div>
                </div>
            </div >
        </>
    );
};

export default FacturaTemplate