<template>
    <div class="createIps">
        <div class="containerCreateIps">
            <h4>A continuación, ingrese una nueva IPS.</h4>
            <form v-on:submit.prevent="processCreateIps">
                <input type="text" v-model="user.name" placeholder="IPS">
                <button type="submit">Agregar IPS</button>
            </form>
        </div>
    </div>
</template>

<script>
    import axios      from 'axios';
    import jwt_decode from 'jwt-decode';

    export default{
        name: "CreateIps",

        data:function(){
            return {
                user: {
                    name:"",
                    user_id:0,
                }
            }
        },

        methods:{
            processCreateIps: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") === null) {
                    this.$emit("logOut");
                    return;
                }
                await this.verifyToken();
                let token  = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id;

                this.user.user_id = userId;
                axios.post(
                    'http://localhost:8000/ips/create/',
                    this.user,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.$emit('completedCreateIps');
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

  .createIps{
        margin: 0;
        padding: 0%;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .containerCreateIps {
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
    .createIps h4{
        color: #0e3063;
        text-align: center;
    }

    .createIps form{
        width: 70%;
    }
    .createIps input{
        height: 23px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: 1px solid #283747;
    }
    .createIps button{
        width: 100%;
        height: 40px;
        color: #E5E7E9;
        background: #1a9aa3;
        border: 1px solid #E5E7E9;
        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;
    }


    .createIps button:hover{
        color: #ffffff;
        background: rgb(179, 63, 54);
        border: 1px solid #283747;
    }

</style>