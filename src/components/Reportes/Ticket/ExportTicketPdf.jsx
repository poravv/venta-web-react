
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { agregarSeparadorMiles } from '../../Utils/separadorMiles'

export const generaTicket = ({ cabecera, detalle }) => {
    //console.log('Cabecera: ',cabecera)
    //console.log('Detalle: ',detalle)
    const doc = new jsPDF({
        //orientation: "landscape",
        //unit: "in",
        format: "a4",
        //floatPrecision: 16
    });
    autoTable(doc, { html: '#my-table' });

    var finalY = doc.lastAutoTable.finalY || 1
    
    doc.text(`Ticket`, 95, finalY + 10);
    doc.text(`Número de ticket: ${cabecera?.idventa}`, 10, finalY + 20);
    doc.text(`Fecha: ${cabecera?.fecha}`, 10, finalY+30);
    doc.text(`Cliente: ${cabecera?.razon_social}`, 10, finalY+40);
    doc.text(`Ruc: ${cabecera?.ruc}`, 10, finalY+50);
    doc.text(`Total: ${cabecera?.total}`, 10, finalY+60);

    //Generador de tabla manualmente
    
    const columnas = ['Número', 'Producto', 'Cantidad', 'Precio'];
    const data = [];

    detalle?.map((det, index) => {
        data.push([index + 1, det?.producto_final?.nombre, det?.cantidad, agregarSeparadorMiles((parseInt(det?.cantidad) * parseInt(det?.producto_final?.costo)))]);
        return true;
    })
    finalY = doc.lastAutoTable.finalY;
    autoTable(doc, {startY: finalY+70,head: [columnas],body: data,});
    

    //Captura la tabla generada en el html
   /*
    finalY = doc.lastAutoTable.finalY
    //doc.text('From HTML with CSS', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        html: '.table',
        useCss: true,
    })
    */

    //Aqui se guarda el pdf
    doc.save(`Ticket_${cabecera?.idventa}.pdf`)
}