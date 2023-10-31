import * as XLSX from 'xlsx/xlsx.mjs';

export const handleExport = ({data,title}) => {
    var wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title}.xlsx`);
    return null;
}

export const handleExportTitle = ({title,cabecera,array}) => {
    
    const sheet = XLSX.utils.json_to_sheet([{}], {
        header: ['Convocatoria'],//origin:'A1:P1'
    });
    const merge = [
        {
            s: {
                r: 0, c: 0,
            }, e: { r: 0, c: 13 },
        },/*{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }*/
    ];
    sheet["!merges"] = merge;
    var wbrm = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(sheet, cabecera, { origin: "A2" });

    XLSX.utils.sheet_add_json(sheet, array, {
        origin: 'A3', skipHeader: true
    });

    XLSX.utils.book_append_sheet(wbrm, sheet, title);
    XLSX.writeFile(wbrm, `${title}.xlsx`)
}