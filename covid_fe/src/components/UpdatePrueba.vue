<template>
     <div class="updatePrueba">
        <div class="containerUpdatePrueba">
            <h4>Seleccione la prueba que desea actualizar:.</h4>
            <form v-on:submit.prevent="getPrueba">
                <select v-model="prueba.id">
                    <option v-for="prueba in myPruebas" :key="prueba.id" :value="prueba.id">{{ prueba.testDate }} - Prueba {{ prueba.id }}</option>   
                </select>
            </form>
            <h4>Ingrese los nuevos datos de la prueba:</h4>
            <form v-on:submit.prevent="updatePrueba">
                <input type="text" v-model="nuevos_datos.testDate" placeholder="Fecha realización prueba">
                <br>
                <input type="number" v-model="nuevos_datos.positiveTests" min="0" placeholder="Pruebas positivas">
                <br>
                <input type="number" v-model="nuevos_datos.negativeTests" min="0" placeholder="Pruebas negativas">
                <br>
                <input type="number" v-model="nuevos_datos.indeterminateTests" min="0"  placeholder="Pruebas indeterminadas">
                <br>
                <button type="submit">Actualizar pruebas</button>
            </form>
        </div>
    </div>   
</template>


<script>

import axios      from 'axios';
import jwt_decode from 'jwt-decode';

export default{
        name: "UpdatePrueba",

        data: function(){
            return{
                prueba   : {
                    id : 0,
                    testDate : (new Date()).toJSON().toString(),
                    positiveTests :"",
                    negativeTests:"",
                    indeterminateTests:"",
                    totalTests:"",
                },

                nuevos_datos:{
                    dep_ips : 0,
                    testDate : (new Date()).toJSON().toString(),
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
                
                if (pruebaId != "Todas"){
                    console.log(pruebaId);

                    axios.get(
                        `http://localhost:8000/prueba/${userId}/${pruebaId}/`,
                        {headers: {'Authorization': `Bearer ${token}`}}
                    )
                    .then((result) => {
                        this.loaded             = true;
                        this.table              =false;
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
                } else {
                    this.table = true;
                    this.loaded = false;
                }
            },

            updatePrueba: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id;
                let pruebaId = this.prueba.id;
                this.nuevos_datos.dep_ips = userId

                console.log(this.nuevos_datos);

                axios.put(
                    `http://localhost:8000/prueba/update/${userId}/${pruebaId}/`,
                    this.nuevos_datos,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.$emit('completedUpdatePrueba');
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
            this.getPrueba();
        }
    }



</script>


<style>


    .updatePrueba{
        margin: 0;
        padding: 0%;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .containerUpdatePrueba {
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
    .updatePrueba h4{
        color: #0e3063;
        text-align: center;
    }

    .updatePrueba form{
        width: 70%;
    }
    .updatePrueba input{
        height: 23px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: 1px solid #283747;
    }
    .updatePrueba button{
        width: 100%;
        height: 40px;
        color: #E5E7E9;
        background: #1a9aa3;
        border: 1px solid #E5E7E9;
        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;
    }


    .updatePrueba button:hover{
        color: #ffffff;
        background: rgb(179, 63, 54);
        border: 1px solid #283747;
    }


</style>