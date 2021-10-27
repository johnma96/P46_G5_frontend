<template >
   <div class="List">
        <div class="informacion" >
            <h2>IPS registradas:</h2>
            <table>
                <tr>
                    <th>Id</th>
                    <th>Nombre IPS</th>
                </tr>
                <tr v-for="ips in myIps">
                    <td>{{ ips.id }}</td>
                    <td>{{ ips.name }}</td>
                </tr>
            </table>
        </div>

        <div class="informacion" >
            <h2>Departamentos registrados:</h2>
            <table>
                <tr>
                    <th>Id</th>
                    <th>Departamento</th>
                </tr>
                <tr v-for="departamento in myDepartamento">
                    <td>{{ departamento.id }}</td>
                    <td>{{ departamento.name }}</td>
                </tr>
            </table>
        </div>
    </div>

    
    
    
</template>

<script>

    import axios      from 'axios';
    import jwt_decode from 'jwt-decode';

    export default{
        name: "IpsDepList",

        data: function(){
            return{
                ips  : {
                    id : 0,
                    name : "",
                },
                departamento:{
                    id : 0,
                    name : "",
                },
                myIps : [],
                myDepartamento : [],
            }
        },



        methods:{
            verifyToken: async function(){
                return axios.post(
                        'http://localhost:8000/refresh/',
                        {refresh: localStorage.getItem("tokenRefresh")},
                        {headers:{}}
                    )
                    .then((result) => {
                        console.log("New access token");
                        localStorage.setItem("tokenAccess", result.data.access);
                    })
                    .catch((error) => {
                        this.$emit("logOut");
                    })
            },

            getMyIpsList: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");

                axios.get(
                    `http://localhost:8000/ips/list/`,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.myIps = result.data;
                })
                .catch((error) => {
                    if(error.response.status == "401") {
                        alert("Usted no está autorizado para realizar esta operación.");
                    }
                    else if(error.response.status == "500"){
                        alert("La plataforma está presentando problemas.\nIntente de nuevo más tarde.");
                    }
                })
            },


              getMyDepartamentoList: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");

                axios.get(
                    `http://localhost:8000/departamento/list/`,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.myDepartamento = result.data;
                })
                .catch((error) => {
                    if(error.response.status == "401") {
                        alert("Usted no está autorizado para realizar esta operación.");
                    }
                    else if(error.response.status == "500"){
                        alert("La plataforma está presentando problemas.\nIntente de nuevo más tarde.");
                    }
                })
            },

        },

        created: async function(){
            this.getMyIpsList();
            this.getMyDepartamentoList();
        }
    }

</script>

<style>
    .List{
        margin: 0;
        padding: 0%;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .List h4{
        color: #0e3063;
        text-align: center;
    }

    .List form{
        width: 70%;
    }
    .List input{
        height: 23px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: 1px solid #283747;
    }
    .List button{
        width: 100%;
        height: 40px;
        color: #E5E7E9;
        background: #1a9aa3;
        border: 1px solid #E5E7E9;
        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;
    }


    .List button:hover{
        color: #ffffff;
        background: rgb(179, 63, 54);
        border: 1px solid #283747;
    }


    .informacion {
        border: 1px solid #ffffff;
        border-radius: 5px;
        position: relative;
        width: 40%;
        height: 100%;
        display: flex;
        background: #ffffff;
        flex-direction: column;
        top: 0%;
        right: 0%;
        left: 5%;
        align-items: center;    
    }

    .informacion h2{
        font-size: 25px;
        color: #0e3063;
    }

    .informacion table {
        width: 80%;
        height: 80%;
        top: 0;
        display: block;
        overflow-x: auto;
        position: relative;
        border-collapse: collapse;
        text-align: center;
        margin: auto

    }

    .informacion td, .informacion th {
        border: 1px solid rgb(168, 148, 148);
        padding: 8px;
        font-size: 18px;
        
    }

    .informacion tr:nth-child(even){
        background-color: #e0dede;
        
    }

    .informacion tr:hover {
        background-color: rgb(172, 172, 172);
    }

    .informacion th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #04AA6D;
        color: white;
    }

</style>