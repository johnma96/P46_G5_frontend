<template>
  <div id="app" class="app">
    <div class="header">
      <h1>Bienvenido al portal de Pruebas Covid 19</h1>
      <nav>
        <button v-if="isAuth"> Inicio </button>
        <button v-if="isAuth"> Cuenta </button>
        <button v-if="isAuth"> Cerrar Sesión </button>
        <button v-if="!isAuth" v-on:click="loadLogIn"> Iniciar sesión </button>
        <button v-if="!isAuth" v-on:click="loadSignUp"> Registrarse </button>
      </nav>
    </div>

    <div class="main-component">
      <router-view
        v-on:completedLogIn="completedLogIn"
        v-on:completedSignUp="completedSignUp"
      >
      </router-view>
    </div>

    <div class="footer">
      <h4>MisionTIC 2022 - P46 Grupo 5   <br>  Mario Montoya - Laura Roa</h4>
    </div>
  </div>
</template>


<script>
  export default{
    name: 'App',
    data: function(){
      return {
        isAuth: false
      }
    },

    components:{
    },

    methods:{
      verifyAuth: function(){
        this.isAuth = localStorage.getItem("isAuth") || false;
        if(this.isAuth == false){
          this.$router.push({name: "login"})
        }
        else{
          this.$router.push({name: "home"});
        }
        
      },

       loadHome: function(){
        this.$router.push({name: "home"});
      },
      
      loadLogIn: function(){
        this.$router.push({name: "login"});
      },

      loadSignUp: function(){
        this.$router.push({name: "signUp"});
      },

      completedLogIn: function(data){
        localStorage.setItem('username', data.username);
        localStorage.setItem('tokenRefresh', data.tokenRefresh);
        localStorage.setItem('tokenAccess', data.tokenAccess);
        localStorage.setItem('isAuth', true);
        alert("Autenticación exitosa");
        this.verifyAuth();
      },

      completedSignUp: function(data){
        alert("Registro exitoso");
        this.completedLogIn(data);
      },
    },

    created: function(){
      this.verifyAuth();
    }
  }
</script>


<style>
  body {
    max-width: 0 0 0 0;
  }
  .header{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 10vh;
    min-height: 100px;
    background-color: #1c819b;
    color:#ffffff ;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header h1{
    width: 80%;
    text-align: center;
  }
  .header nav {
    height: 100%;
    width: 20%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 20px;
  }
  .header nav button{
    color: #E5E7E9;
    background: #283747;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    padding: 10px 20px;
    margin: 5px;
  }
  .header nav button:hover{
    color: #283747;
    background: #E5E7E9;
    border: 1px solid #E5E7E9;
  }
  .main-component{
    height: 75vh;
    margin: 0%;
    padding: 0%;
    background: #acacac ;
    align-content: center;
  }
  .footer{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 10vh;
    min-height: 20px;
    background-color: #313131;
    color: #ffffff;
  }
  .footer h4{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
  }
</style>
