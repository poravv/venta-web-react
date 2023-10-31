import { Typography } from 'antd';
const { Title } = Typography;

export const Titulos = ({ level, text }) => {
    return (
        <div style={{ textAlign:`center`,marginTop:`10px` }}>
            <Title level={level} >{text}</Title>
        </div>
    )
}