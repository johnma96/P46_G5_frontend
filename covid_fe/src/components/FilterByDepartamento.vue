<template >
    <div class="detailPrueba">
        <div class="containerPrueba">
            <h2>Seleccione un departamento:</h2>
            <form v-on:submit.prevent="getPruebasByDepartamento">
                <select v-model="departamento.name">
                    <option v-for="departamento in myDepartamento" :key="departamento.name" :value="departamento.name">{{ departamento.name }}</option>   
                </select>
                <button type="submit">Ver pruebas por departamento</button>
            </form>


            <h2 v-if="table">Filtar por fecha</h2>
            <form v-on:submit.prevent="filtrarFecha"  v-if="table">
                <Datepicker v-model="datei" ></Datepicker>
                <Datepicker v-model="datef" ></Datepicker>
                <button type="submit">Filtrar</button>
            </form>
 
        </div>   


        <div class="informacionPruebas" v-if="table">
            <h2>Resumen de las pruebas</h2>
            <table>
                <tr>
                    <th>Id</th>
                    <th>Fecha</th>
                    <th>Positivas</th>
                    <th>Negativas</th>
                    <th>Indeterminadas</th>
                    <th>Totales</th>
                </tr>
                <tr v-for="prueba in myPruebas" :key="prueba.id" :value="prueba.id">
                    <td>{{ prueba.id }}</td>
                    <td>{{ prueba.testDate }}</td>
                    <td>{{ prueba.positiveTests }}</td>
                    <td>{{ prueba.negativeTests }}</td>
                    <td>{{ prueba.indeterminateTests }}</td>
                    <td>{{ prueba.totalTests }}</td>
                </tr>
            </table>
        </div>
    </div>
    
</template>

<script>
    import axios      from 'axios';
    import jwt_decode from 'jwt-decode';
    import Datepicker from 'vue3-date-time-picker';
    import 'vue3-date-time-picker/dist/main.css'

    export default{
        name: "FilterByDepartamento",
        components: { Datepicker },

        data: function(){
            return{
                datei: null,
                datef: null,
                dateFormat : 'yyyy-MM-dd',
                departamento:{
                            id: 0,
                            name: "",
                },
                table    : false,
                myDepartamento : [],
                myPruebas : [],
                myPruebasTable : [],
                context: null,
            }
        },

        methods:{
            onContext(ctx) {
                this.context = ctx
            },

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

           

            getPruebasByDepartamento: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id;
                let nameDepartamento =  this.departamento.name;
                this.table = true;
                
                axios.get(
                    `http://localhost:8000/prueba/departamento/${userId}/${nameDepartamento}/`,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.myPruebas = result.data;

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

            filtrarFecha: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id.toString();
                let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                let datei = (new Date(this.datei - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
                let datef = new Date(this.datef - tzoffset).toISOString().slice(0, 19).replace('T', ' ');
                let nameDepartamento =  this.departamento.name;
                
                axios.get(
                    `http://localhost:8000/prueba/departamento/${userId}/${nameDepartamento}/`,
                    {headers: {'Authorization': `Bearer ${token}`},
                        params : {
                            startDate : datei,
                            endDate   :datef,
                        }
                    }
                )
                .then((result) => {
                    this.myPruebas = result.data;
                    
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
            this.getMyDepartamentoList();
        }
    }
</script>

<style>
    .detailPrueba{
        margin: 0;
        padding: 0%;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .containerPrueba {
        border: 1px solid #ffffff;
        border-radius: 5px;
        width: 40%;
        height: 100%;
        display: flex;
        background: #ffffff;
        text-align-last:center;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        position: relative;
       
    }

    .containerPrueba form {
        align-items: center;
    }

    .containerPrueba h2 {
        font-size: 25px;
        color: #0e3063;
        /* position: relative;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center; */
    }

    .containerPrueba form select {
        position: relative;
        font-size: 20px;
        /* left: 10%; */
    }


    .detailPrueba h4{
        color: #0e3063;
        text-align: center;
    }

    .detailPrueba form{
        width: 70%;
    }
    .detailPrueba input{
        height: 23px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: 1px solid #283747;
    }
    .detailPrueba button{
        width: 100%;
        height: 40px;
        color: #E5E7E9;
        background: #1a9aa3;
        border: 1px solid #E5E7E9;
        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;
    }


    .detailPrueba button:hover{
        color: #ffffff;
        background: rgb(179, 63, 54);
        border: 1px solid #283747;
    }

    
    .informacionPruebas h2{
        font-size: 25px;
        color: #0e3063;
    }

    .informacionPruebas table {
        width: 80%;
        height: 80%;
        top: 0;
        display: block;
        overflow-x: auto;
        position: relative;
        border-collapse: collapse;
        text-align: center;
    }

    .informacionPruebas td, .informacionPruebas th {
        border: 1px solid black;
        padding: 8px;
        font-size: 18px;
        
        
    }

    .informacionPruebas tr:nth-child(even){
        background-color: #e0dede;
        
    }

    .informacionPruebas tr:hover {
        background-color: rgb(172, 172, 172);
    }

    .informacionPruebas th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #04AA6D;
        color: white;
    }


</style>