import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL+'/venta';
const baseURLdet = process.env.REACT_APP_API_URL+'/detventa';

export const getVenta = async ({token,param}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    const { data } = await axios.get(`${baseURL}/get`, config);
    return data;
};

export const getVentaUsuario = async ({token,param}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    const { data } = await axios.get(`${baseURL}/getvenusu/`, config);
    return data;
};

export const getVwVenta = async ({token,param}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getsql`, config);
    //console.log(data);
    return data;
};


export const getVentaById = async ({token,param}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/get/${param}`, config);
    //console.log(data);
    return data;
};

export const deleteVenta  = async ({token,param}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    const { data } = await axios.delete(`${baseURL}/del/${param}`, config)
    return data;
};

export const operacionVenta  = async ({token,idproducto_final,operacion,cantidad}) => {
    //console.log(json)
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    const { data } = await axios.post(`${baseURL}/operacionventa/${idproducto_final}/${operacion}/${cantidad}`,{}, config)
    return data;
};


export const updateVenta  = async ({token,param,json}) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    const { data } = await axios.put(baseURL + "/put/" + param, json, config)
    return data;
};

export const createVenta  = async ({token,json}) => {
    //console.log(json)
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const { data } = await axios.post(baseURL + "/post/", json, config)
    return data;
};

export const createVentaDet  = async ({token,json}) => {
    //console.log(json)
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const { data } = await axios.post(baseURLdet + "/post/", json, config)
    return data;
};