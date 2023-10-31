
import { Form, Select } from 'antd';

function Buscador({ data, label, value, dataIndex, title, onChange, onSearch, selected }) {

    return (
        <Form.Item name={dataIndex}
            style={{ display: `block`,margin:1 }}
            labelCol={{ span: 0, }}
            wrapperCol={{ span: 0, }}
            rules={[{ required: true, message: `Por favor seleccione ${title}!`, },]} >
            <Select
                showSearch
                allowClear
                placeholder={
                    title === 'Documento' ? `Escriba ${title}` : `Seleccione ${title}`
                }
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                    (option?.razon_social ??
                        option?.descripcion ??
                        option.documento ??
                        option.label ??
                        option?.nombres ??
                        option?.datos ??
                        option?.anho.toString() ??
                        option?.nombre ?? '').toLowerCase().includes(input.toLowerCase())
                }
                fieldNames={{
                    label: label, value: value,
                    options: data
                }}
                value={selected}
                options={data}
            />
        </Form.Item>
    );
}

export default Buscador;