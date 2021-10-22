<template>
    <div class="signUpUser">
        <div class="containerSignUpUser">
            <h4>A continuación, registrese usando una IPS y un departamento. <br> Posteriormente ingrese los datos de las pruebas Covid19 procesadas en una fecha.</h4>
            <form v-on:submit.prevent="processSignUp" >
                <input type="text" v-model="user.username" placeholder="Usuario">
                <br>
                <input type="text" v-model="user.name" placeholder="IPS - Departamento (Ej: Salud total - Cundinamarca)">
                <br>
                <input type="password" v-model="user.password" placeholder="Contraseña">
                <br>
                <input type="number" min="0" v-model="user.departamento" placeholder="Departamento">
                <br>
                <input type="number" min="0" v-model="user.ips" placeholder="IPS">
                <br>
                <input type="text" v-model="user.prueba.testDate" placeholder="Fecha realización prueba">
                <br>
                <input type="number" min="0" v-model="user.prueba.positiveTests" placeholder="Pruebas positivas">
                <br>
                <input type="number" min="0" v-model="user.prueba.negativeTests" placeholder="Pruebas negativas">
                <br>
                <input type="number" min="0" v-model="user.prueba.indeterminateTests" placeholder="Pruebas indeterminadas">
                <br>
                <input type="number" min="0" v-model="user.prueba.totalTests" placeholder="Total pruebas">
                <br>
                <button type="submit">Registrar pruebas</button>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "SignUp",
        data: function(){
            return {
                user: {
                    username: "",
                    name: "",
                    password: "",
                    departamento: "",
                    ips: "",
                    prueba: {
                        testDate               : "",
                        positiveTests          : "",
                        negativeTests          : "",
                        indeterminateTests     : "",
                        totalTests             : ""
                    }
                }
            }
        },
        methods: {
            processSignUp: function(){
                console.log(this.user);
                axios.post(
                    "http://localhost:8000/dep_ips/",
                    this.user,
                    {headers: {}}
                )
                .then((result) => {
                    let dataSignUp = {
                        username      : this.user.username,
                        tokenAccess  : result.data.access,
                        tokenRefresh : result.data.refresh,
                    }
                    this.$emit('completedSignUp', dataSignUp)
                })
                .catch((error) => {
                    console.log(error)
                    alert("ERROR: El registro ha fallado.");
                });
            }
        }
    }
</script>

<style>
    .signUpUser{
        margin: 0;
        padding: 0%;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .containerSignUpUser {
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
    .signUpUser h4{
        color: #0e3063;
        text-align: center;
    }

    .signUpUser form{
        width: 70%;
    }
    .signUpUser input{
        height: 23px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: 1px solid #283747;
    }
    .signUpUser button{
        width: 100%;
        height: 40px;
        color: #E5E7E9;
        background: #1a9aa3;
        border: 1px solid #E5E7E9;
        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;
    }


    .signUpUser button:hover{
        color: #ffffff;
        background: rgb(179, 63, 54);
        border: 1px solid #283747;
    }
</style>