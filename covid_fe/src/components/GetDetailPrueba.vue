<template >
    <div class="detailPrueba">
        <div class="containerPrueba">
            <h2>Seleccione una opción para ver información de las pruebas registradas:</h2>
            <form v-on:submit.prevent="getPrueba">
                <select v-model="prueba.id">
                    <option v-for="prueba in myPruebas" :key="prueba.id" :value="prueba.id">{{ prueba.testDate }} - Prueba {{ prueba.id }}</option>   
                    <option>Todas</option>
                </select>
                <button type="submit">Ver detalle de la prueba</button>
            </form>
            <nav>
                <button v-on:click="deletePrueba" >Eliminar prueba</button>
            </nav>
            
        </div>   

        <div class="informacionPrueba" v-if="loaded" >
            <h2>Fecha de la prueba:     <span>{{ testDate }}</span>  </h2>
            <h2>Pruebas positivas:      <span>{{ positiveTests }}</span> </h2>
            <h2>Pruebas negativas:      <span>{{ negativeTests }}</span> </h2>
            <h2>Pruebas indeterminadas: <span>{{ indeterminateTests }}</span> </h2>
            <h2>Pruebas totales:        <span>{{ totalTests }}</span> </h2>
        </div>

        <div class="informacionPruebas" v-if="table" >
            <h2>Resumen de sus pruebas</h2>
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

    export default{
        name: "DetailPrueba",

        data: function(){
            return{
                loaded   : false,
                table    : false,
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
                
                if (pruebaId != "Todas"){

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

            deletePrueba: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id.toString();
                let pruebaId = this.prueba.id;

                axios.delete(
                        `http://localhost:8000/prueba/delete/${userId}/${pruebaId}/`,
                        {headers: {'Authorization': `Bearer ${token}`}}
                    )
                    .then((result) => {
                        this.$emit("completedDeletePrueba");
                        this.getMyPruebasList();
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

    .informacionPrueba {
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

    .informacionPrueba h2{
        top: 15%;
        font-size: 25px;
        color: #0d5f74;
        position: relative;
        align-content: center;
        align-items: center;
        justify-content: center;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .informacionPruebas {
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