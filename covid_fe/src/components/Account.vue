<template>
    <div>
        <div class="informacion" v-if="loaded">
            <h1>Información de su cuenta</h1>
            <h2>Nombre:       <span>{{ name }}</span>  </h2>
            <h2>Departamento: <span>{{ departamento }}</span> </h2>
            <h2>IPS:          <span>{{ ips }}</span> </h2>
        </div> 
    </div>
</template>

<script>
    import axios      from 'axios';
    import jwt_decode from 'jwt-decode';

    export default{
        name: "Account",

        data: function(){
            return {
                loaded       : false,
                name         : "",
                departamento : "",
                ips          : "",                
            }
        },
            

        methods:{
            getData: async function(){
                if(localStorage.getItem("tokenRefresh") === null || localStorage.getItem("tokenAccess") == null){
                    this.$emit("logOut");
                    return;
                }

                await this.verifyToken();

                let token = localStorage.getItem("tokenAccess");
                let userId = jwt_decode(token).user_id.toString();

                axios.get(
                    `http://localhost:8000/dep_ips/${userId}/`,
                    {headers: {'Authorization': `Bearer ${token}`}}
                )
                .then((result) => {
                    this.loaded        = true;
                    this.name          = result.data.name;
                    this.departamento  = result.data.departamento;
                    this.ips           = result.data.ips;
                })
                .catch((error) => {
                    this.$emit("logOut");
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
            this.getData();
        },
    }

</script>

<style>

    .informacion{
        margin: 0;
        width: 100%;
        padding: 0%;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;
    }

    .informacion h1{
        font-size: 60px;
        color: #0f1316;
    }

    .informacion h2{
        font-size: 35px;
        color: #0d5f74;
    }

    .informacion span{
        color: rgb(29, 5, 107);
        font-weight: bold;
    }



</style>
