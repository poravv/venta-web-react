/*
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
//import logotipo from '../../logo192.png';

// Create Document Component
const ReportesPDF = () => {
  return (
    <>
      <PDFViewer style={styles.viewer}>
        {/* Start of the document* /}
        <Document title="Template">
          {/*render a single page* /}
          <Page size="LEGAL" orientation="landscape" style={styles.body}>
            {/*Inicio Cabecera* /}

            <View style={styles.header} >
              <View style={styles.tableRow}>
                {/*<Image src={logotipo} style={styles.logo} />* /}
              </View>
              <View style={styles.headerText}>
                <Text >{'One SRL'}</Text>
                <Text >{'Reporte de datos desarrollado por Andrés Vera'}</Text>
                <Text >{'0992756462'}</Text>
                <Text >{'andyvercha@gmail.com'}</Text>
              </View>
              <View style={styles.tableRow}>
                {/*<Image src={logotipo} style={styles.logo} />* /}
              </View>
            </View>
            {/*Fin Cabecera* /}
            {/*Inicio de tabla* /}
            
              
              <View style={[styles.table]}>
                <View style={[styles.row, styles.tableHeader]}>
                  <Text style={[styles.headerText, styles.cell]}>Nombre</Text>
                  <Text style={[styles.headerText, styles.cell]}>Apellido</Text>
                  <Text style={[styles.headerText, styles.cell]}>Documento</Text>
                  <Text style={[styles.headerText, styles.cell]}>Curso</Text>
                  <Text style={[styles.headerText, styles.cell]}>Turno</Text>
                </View>
                {datos.map((registro) => {
                  return (
                    <View>
                      <View wrap={true} key={registro.id} style={[styles.row]}>
                        <Text style={[styles.cell]}>{registro.nombre}</Text>
                        <Text style={[styles.cell]}>{registro.apellido}</Text>
                        <Text style={[styles.cell]}>{registro.documento}</Text>
                        <Text style={[styles.cell]}>{registro.curso}</Text>
                        <Text style={[styles.cell]}>{registro.turno}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            {/*Fin de tabla* /}
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
              `${pageNumber} / ${totalPages}`
            )} fixed />
          </Page>

        </Document>

      </PDFViewer>

    </>
  );
}
export default ReportesPDF;

const datos = [
  { id: 1, nombre: 'Andres', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 2, nombre: 'Claudia', apellido: 'Chavez', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 3, nombre: 'Aleli', apellido: 'Perez', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 4, nombre: 'Raul', apellido: 'Lopez', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 5, nombre: 'Ramon', apellido: 'Maidana', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 6, nombre: 'Raquel', apellido: 'Velazquez', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 7, nombre: 'Valentin', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 8, nombre: 'Vicente', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 9, nombre: 'Hugo', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 10, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },

  { id: 11, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 12, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 13, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 14, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 15, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 16, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 17, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 18, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
  { id: 19, nombre: 'David', apellido: 'Vera', documento: '5379057', curso: 'Primero', turno: 'Noche' },
];


// Create styles
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  headerText: {
    fontSize: 10,
    color: "#1a245c",
    margin: 8,
    width: 600,
    display: `flex`,
    flexWrap: `nowrap`,
    textAlign: `center`,
  },
  tableContainer: {
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'stretch',
    textAlign: 'center',
  },
  table: {
    fontSize: 10,
    display: "flex",
    flexDirection: "column",
    textAlign: `center`,
    flexWrap: "nowrap",
    //alignItems: "stretch",
    margin: `10px`,
    width: `90%`,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    //justifyContent: "space-around",
    //alignContent: "stretch",
    textAlign: `center`,
    flexWrap: "nowrap",
    //alignItems: "stretch",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 35,
    backgroundColor: "white",
    borderWidth: 0.5,
    //borderRadius: 6,
  },
  cell: {
    borderStyle: "solid",
    margin: 8,
    fontSize: 10,
    //fontWeight: 1200,
    //color: "#1a245c",
    //flexDirection: 'column',
    width: 400,
    display: `flex`,
    flexWrap: `wrap`,
    textAlign: `center`,

  },
  header: {
    fontSize: 20,
    //textAlign: 'center',
    marginBottom: 20,
    display: `flex`,
    //backgroundColor: "#eee",
    flexDirection: 'row',
    //flexWrap: `nowrap`,
    justifyContent: "space-around",
  },
  tableHeader: {
    backgroundColor: "#eee",
    textAlign: `center`,
    display: `flex`
  },
  logo: {
    width: `50px`,
    height:`50px`
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    //backgroundColor: `yellow`,
    //with: 1200
  },
  tableCol: {
    display: 'flex',
    flexDirection: 'column',
    //backgroundColor: `red`,
    textAlign: `center`,
    with: 800
  },
  viewer: {
    //width: window.innerWidth, //the pdf viewer will take up all of the width and height
    width: `100%`,
    //width:`800px`
    height: window.innerHeight,
  },
  section: {
    width: 200,
    //height: 100,
    '@media max-width: 400': {
      width: 300,

    },
    '@media orientation: landscape': {
      width: 400,
      //height:100,
      textAlign: `center`,
      //justifyContent:`center`
      //alignItems:`center`
    },
  }
});
*/