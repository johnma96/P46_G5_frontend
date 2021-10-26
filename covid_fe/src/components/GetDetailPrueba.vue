<template >
    <div class="detailPrueba">
        <div class="containerPrueba">
            <h2>Realizar transferencia electrónica:</h2>
            <form v-on:submit.prevent="getPrueba">
                <select v-model="prueba.id">
                    <option disabled selected>Seleccione una prueba de interés...</option>
                    <option v-for="prueba in myPruebas" :key="prueba.id" :value="prueba.id">{{ prueba.testDate }} - Prueba {{ prueba.id }}</option>   
                </select>
                <button type="submit">Ver detalle de la prueba</button>
            </form>
        </div>   

        <div class="informacion" v-if="loaded" >
            <h2>Fecha de la prueba:     <span>{{ testDate }}</span>  </h2>
            <h2>Pruebas positivas:      <span>{{ positiveTests }}</span> </h2>
            <h2>Pruebas negativas:      <span>{{ negativeTests }}</span> </h2>
            <h2>Pruebas indeterminadas: <span>{{ indeterminateTests }}</span> </h2>
            <h2>Pruebas totales:        <span>{{ totalTests }}</span> </h2>
        </div>
        
    </div>
    
</template>

<script>
    import axios      from 'axios';
    import jwt_decode from 'jwt-decode';

    export default{
        name: "DetailPrueba",

        data: function(){
            return{
                loaded   : false,
                prueba   : {
                    id : 0,
                    testDate : "",
                    positiveTests :"",
                    negativeTests:"",
                    indeterminateTests:"",
                    totalTests:"",
                },
                myPruebas : [],
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

            getMyPruebasList: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id.toString();

                axios.get(
                    `http://localhost:8000/prueba/${userId}/`,
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

            getPrueba: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id.toString();
                let pruebaId = this.prueba.id;

                console.log(pruebaId);

                axios.get(
                    `http://localhost:8000/prueba/${userId}/${pruebaId}/`,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.loaded             = true;
                    this.testDate           = result.data.testDate;
                    this.positiveTests      = result.data.positiveTests;
                    this.negativeTests      = result.data.negativeTests;
                    this.indeterminateTests = result.data.indeterminateTests;
                    this.totalTests         = result.data.totalTests;
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
            this.getMyPruebasList();
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
        width: 60%;
        height: 100%;
        display: flex;
        background: #ffffff;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
</style>