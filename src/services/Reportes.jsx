import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL+'/reportes';

export const getReporteGral = async ({ token, idconvocatoria }) => {
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getreportegral/${idconvocatoria}`, config)
    return data;
};

export const getReporteMat = async ({ token, idconvocatoria,idmateria }) => {
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getreportemat/${idconvocatoria}/${idmateria}`, config)
    return data;
};


export const getConvocatoria = async ({ token, anho1, anho2, estado }) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getconvocatoria/${anho1}/${anho2}/${estado}`, config)
    return data;
};

export const getCertCab = async ({ token, idinscripcion }) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getcertcab/${idinscripcion}`, config)
    return data;
};

export const getCert1ro = async ({ token, idinscripcion }) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getcertificado1ro/${idinscripcion}`, config)
    return data;
};

export const getEvaluacionesReporte = async ({ token, idconvocatoria,idinscripcion }) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getcertevaluacion/${idconvocatoria}/${idinscripcion}`, config)
    return data;
};

export const getevalmat = async ({ token, idconvocatoria,idmateria,tipo }) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getevalmat/${idconvocatoria}/${idmateria}/${tipo}`, config)
    return data;
};

export const getestudiantes = async ({ token, idconvocatoria}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getEstudiantes/${idconvocatoria}`, config)
    return data;
};

export const getactacab = async ({ token, idconvocatoria,idmateria }) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getactacab/${idconvocatoria}/${idmateria}`, config)
    return data;
};

export const getarescabena = async ({ token, idconvocatoria }) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: { "Authorization": `Bearer ${token}`, }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getrescabena/${idconvocatoria}`, config)
    return data;
};






