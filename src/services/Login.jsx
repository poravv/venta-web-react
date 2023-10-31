import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL+'/usuario/login/';

export const Login = async (credentials) => {
    //console.log('credential: ',credentials)
    const { data } = await axios.post(baseURL, credentials);
    //console.log('data: ',data)
    if(data?.estado!=='error'){
        window.localStorage.setItem('loggedUser', JSON.stringify(data));
    }
    
    return data;
}

export const Logout = () => {
    window.localStorage.removeItem('loggedUser');
    // eslint-disable-next-line
    window.location.href = window.location.href;
    //window.location.href='/'
}
