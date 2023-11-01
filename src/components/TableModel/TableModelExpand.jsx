//import axios from 'axios'
import { useState
//  , useEffect 
} from 'react'
import { Form, Input, InputNumber, Table, Select } from 'antd';
import { Spin } from 'antd';
//import Buscador from '../Buscador/Buscador';
import UploadFile from '../Utils/Upload';
import { Buffer } from 'buffer'

const { Option } = Select;
//const URI = 'http://68.183.135.246:4001/automot/api/proveedor/';

function TableModelExpand({ token, form, data, mergedColumns, keyExtraido,columnDet,keyDet,varx }) {

  //Celdas editables
  const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    //console.log('edit',record);

    const [previewImage, setPreviewImage] = useState('');


    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    switch (dataIndex) {
      case 'estado':
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  <Select allowClear > <Option value="AC">Activo</Option> <Option value="IN">Inactivo</Option> </Select>
                </Form.Item>
              ) : (children)
            }
          </td>);
      //break;
      case 'img':
        //console.log(dataIndex);
        return (
          <td {...restProps}>
            {
              //
              editing ?
                <Form.Item name={dataIndex} style={{ margin: 0, }}  >
                  <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} >

                    { //Aqui la logica de si actualiza o no las imagenes del formulario
                      (previewImage !== '' && previewImage != null) ?
                        record.img = previewImage :
                        record.img ?
                          record.img = Buffer.from(record.img).toString('ascii') :
                          null}

                  </UploadFile>
                </Form.Item>
                : (children)
            }
          </td>);
      //break;
      default:
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  {inputNode}
                </Form.Item>
              ) : (children)
            }
          </td>);
    }
  };


  const expandedRowRender = (dataDet) => {
    return <Table bordered rowKey={keyDet} columns={columnDet} dataSource={dataDet} pagination={false} />;
  };

  return (
    <>
      {
        data ? <Form form={form} component={false}>
          <Table
            rowKey={keyExtraido}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            showSorterTooltip={{ title: 'Clic para ordenar' }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            expandedRowRender = {(record) => (
                //console.log('det: -',record.detalle)
                expandedRowRender(record.detalle??record.receta??record.det_inventarios??record.det_venta??record.det_planificacions)
            )}
            rowClassName="editable-row"
            scroll={{
              x: 'calc(500px + 60%)',
              //x: (varx??500),
              y: 400,
            }}
          //pagination={{onChange: setCantidadRow,pageSize: 50,}}
          />
        </Form> :
          <section style={{ textAlign: `center`, margin: `10px` }}>
            <Spin />
          </section>
      }
    </>
  );
};
export default TableModelExpand;