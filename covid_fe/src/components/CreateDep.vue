<template>
    <div class="createDepUser">
        <div class="containerCreateDepUser">
            <h4>A continuación, ingrese un nuevo departamento.</h4>
            <form v-on:submit.prevent="processCreateDep">
                <input type="text" v-model="user.name" placeholder="Departamento">
                <button type="submit">Agregar departamento</button>
            </form>
        </div>
    </div>
</template>

<script>
    import axios      from 'axios';
    import jwt_decode from 'jwt-decode';

    export default {
        name: "CreateDep",

        data: function(){
            return {
                user: {
                    name   : "",
                    user_id: 0,   
                    }
                }
            },
        
        methods: {
            processCreateDep: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }
                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id;

                this.user.user_id = userId;
                axios.post(
                    'http://localhost:8000/departamento/create/',
                    this.user,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.$emit('completedCreateDep');
                })
                .catch((error) => {
                    console.log(this.user);
                    console.log(token);
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
                    localStorage.setItem("tokenAccess", result.data.access);
                })
                .catch((error) => {
                    this.$emit("logOut");
                })
            },
        },
        created: async function(){
    
        }
    }
</script>

<style>
    .createDepUser{
        margin: 0;
        padding: 0%;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .containerCreateDepUser {
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
    .createDepUser h4{
        color: #0e3063;
        text-align: center;
    }

    .createDepUser form{
        width: 70%;
    }
    .createDepUser input{
        height: 23px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: 1px solid #283747;
    }
    .createDepUser button{
        width: 100%;
        height: 40px;
        color: #E5E7E9;
        background: #1a9aa3;
        border: 1px solid #E5E7E9;
        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;
    }


    .createDepUser button:hover{
        color: #ffffff;
        background: rgb(179, 63, 54);
        border: 1px solid #283747;
    }
</style>