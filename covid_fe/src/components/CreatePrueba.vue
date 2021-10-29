<template>
    <div class="createPrueba">
        <div class="containerCreatePrueba">
            <h4>Ingrese los datos de las pruebas Covid-19 procesadas.</h4>
            <form v-on:submit.prevent="processPrueba">
                <input type="text" v-model="prueba.prueba_data.testDate" placeholder="Fecha realización prueba">
                <br>
                <input type="number" min="0" v-model="prueba.prueba_data.positiveTests" placeholder="Pruebas positivas">
                <br>
                <input type="number" min="0" v-model="prueba.prueba_data.negativeTests" placeholder="Pruebas negativas">
                <br>
                <input type="number" min="0" v-model="prueba.prueba_data.indeterminateTests" placeholder="Pruebas indeterminadas">
                <br>
                <button type="submit">Registrar pruebas</button>
            </form>
        </div>
    </div>
</template>

<script>
    import axios      from 'axios';
    import jwt_decode from 'jwt-decode';

    export default{
        name:"CreatePrueba",

        data:function(){
            return{
                prueba : {
                    user_id :0,
                    prueba_data: {
                        testDate: (new Date()).toJSON().toString(),
                        positiveTests : "",
                        negativeTests : "",
                        indeterminateTests : "",
                    }
                }
            }
        },

        methods:{
            processPrueba: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id;

                this.prueba.user_id = userId;

                axios.post(
                    'http://localhost:8000/prueba/create/',
                    this.prueba,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.$emit('completedCreatePrueba');
                })
                .catch((error) => {
                    alert("ERROR: El registro ha fallado.");
                })

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


        },

        created:async function(){

        },
    }
</script>

<style>

    .createPrueba{
        margin: 0;
        padding: 0%;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .containerCreatePrueba {
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
    .createPrueba h4{
        color: #0e3063;
        text-align: center;
    }

    .createPrueba form{
        width: 70%;
    }
    .createPrueba input{
        height: 23px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: 1px solid #283747;
        font-size: 20px;
    }
    .createPrueba button{
        width: 100%;
        height: 40px;
        color: #E5E7E9;
        background: #1a9aa3;
        border: 1px solid #E5E7E9;
        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;
        font-size: 20px;
    }


    .createPrueba button:hover{
        color: #ffffff;
        background: rgb(179, 63, 54);
        border: 1px solid #283747;
    }

</style>
