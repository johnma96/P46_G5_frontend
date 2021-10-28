<template >
    <div class="detailPrueba">
        <div class="containerPrueba">
            <h2>Seleccione una de las siguientes opciones:</h2>
            <!-- <input type="checkbox" Departamento> -->
            <div>
                <label class="content-input">
                    <input type="checkbox" id="cbox1" value="first_checkbox" v-on:click="getMyDepartamentoList;"> Departamento
                    <i></i>
                </label>
                <label class="content-input">
                    <input type="checkbox" id="cbox2" value="second_checkbox" v-on:click="getMyIpsList"> IPS
                    <i></i>
                </label>
            </div>

            <form v-on:submit.prevent="getPrueba">
                <select v-model="resultado">
                    <option v-for="departamento in myDepartamento"  v-if="!departamento">{{ departamento.name }} </option>  
                    <option v-for="ips in myIps"   v-if="!ips">{{ ips.name }}</option>   
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
        name: "FilterByIpsDep",

        data: function(){
            return{
                resultado: "",
                myDepartamento : [],
                myIps : [],
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
            // this.getMyDepartamentoList();
            // this.getMyIpsList();
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

    .containerPrueba nav button{

        width: 100%;
        height: 40px;
        color: #E5E7E9;
        background: rgb(179, 63, 54);
        border: 1px solid #E5E7E9;
        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;

    }

.content-input input,
.content-select select{
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
}
 
.content-input input{
	visibility: hidden;
	position: absolute;
	right: 0;
}

.content-input{
	position: relative;
	margin-bottom: 30px;
	padding:5px 0 5px 70px; /* Damos un padding de 60px para posicionar 
        el elemento <i> en este espacio*/
	display: block;
}


.content-input input + i{
       background: #f0f0f0;
       border:2px solid rgba(0,0,0,0.2);
       position: absolute; 
       left: 0;
       top: 0;
}


.content-input input[type=checkbox ] + i{
	width: 65px;
	height: 30px;
	border-radius: 15px;
}


.content-input input[type=checkbox] + i:before{
	content: ''; /* No hay contenido */
	width: 30px;
	height: 30px;
	background: #fff;
	border-radius: 50%;
	position: absolute;
	z-index: 1;
	left: 0px;
	top: 0px;
	-webkit-box-shadow: 3px 0 3px 0 rgba(0,0,0,0.2);
	box-shadow: 3px 0 3px 0 rgba(0,0,0,0.2);
}

.content-input input[type=checkbox]:checked + i:before{
	left: 35px;
	-webkit-box-shadow: -3px 0 3px 0 rgba(0,0,0,0.2);
	box-shadow: 3px 0 -3px 0 rgba(0,0,0,0.2);
}
 
.content-input input[type=checkbox]:checked + i{
 background: #2AC176;
}

.content-input input[type=checkbox] + i:after{
	content: 'ON';
	position: absolute;
	font-size: 15px;
	color: rgba(255,255,255,0.6);
	top: 6px;
	left: 4px;
	opacity: 0 /* Ocultamos este elemento */;
	transition: all 0.25s ease 0.25s;
}
 
/* Cuando esté checkeado cambiamos la opacidad a 1 y lo mostramos */
.content-input input[type=checkbox]:checked + i:after{
 opacity: 1;
}
       
    
</style>