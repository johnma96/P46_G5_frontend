<template>
  <div id="app" class="app">

    <div class="header">
      <h1>Portal registro de pruebas COVID-19</h1>
      <nav>
        <button v-if="isAuth" v-on:click="loadHome"> Inicio </button>
        <button v-if="isAuth" v-on:click="loadAccount"> Cuenta </button>
        <button v-if="isAuth" v-on:click="loadOut"> Cerrar Sesión </button>

        <button v-if="!isAuth" v-on:click="loadLogIn"> Iniciar sesión </button>
        <button v-if="!isAuth" v-on:click="loadSignUp"> Registrarse </button>
        <!-- <button v-if="isAuth" v-on:click="loadCreateDep"> Agregar departamento </button> -->
      </nav>
    </div>

    <div class="main-component">
      <router-view
        v-on:completedLogIn="completedLogIn"
        v-on:completedSignUp="completedSignUp"
        v-on:completedCreateDep="completedCreateDep"
        v-on:completedCreateIps="completedCreateIps"
        v-on:completedCreatePrueba="completedCreatePrueba"
        v-on:completedUpdatePrueba="completedUpdatePrueba"
        v-on:completedDeletePrueba="completedDeletePrueba"        
        v-on:logOut="logOut"
      >
      </router-view>
    </div>

    <div>
      <div class="area"></div>
      <nav class="main-menu" v-if="isAuth">
        <ul>
          <li>
            <a>
              <i class="fa fa-map-marker fa-2x" ></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadCreateDep">
                Ingresar nuevo departamento
              </span>
            </a>

          </li>
          <li class="has-subnav">
            <a>
              <i class="fa fa-user-md fa-2x" ></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadCreateIps">
                Ingresar nueva IPS
              </span>
            </a>

          </li>
          <li class="has-subnav">
            <a>
              <i class="fa fa-medkit fa-2x"></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadCreatePrueba">
                Ingresar nueva prueba
              </span>
            </a>

          </li>
          <li class="has-subnav">
            <a>
              <i class="fa fa-folder-open fa-2x"></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadDetailPrueba">
                Información de pruebas
              </span>
            </a>

          </li>
          <li>
            <a>
              <i class="fa fa-hospital-o  fa-2x"></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadIpsDepList">
                IPS y departamentos registrados
              </span>
            </a>
          </li>
          <li>
            <a>
              <i class="fa fa-refresh fa-2x"></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadUpdatePrueba">
                Actualizar una prueba
              </span>
            </a>
          </li>
          <li>
            <a>
              <i class="fa fa-table fa-2x"></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadFilterByIpsDep">
                Filtros
              </span>
            </a>
          </li>
          <li>
            <a>
              <i class="fa fa-map-marker fa-2x"></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadFilterByIps">
                Filtrar pruebas por IPS
              </span>
            </a>
          </li>
          <li>
            <a> 
              <i class="fa fa-info fa-2x"></i>
              <span class="nav-text" v-if="isAuth" v-on:click="loadFilterByDepartamento">
                Filtrar pruebas por departamento
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="footer">
      <h4>MisionTIC 2022 - P46 Grupo 5: Mario Montoya - Laura Roa</h4>
    </div>

  </div>

</template>


<script>
  import Datepicker from 'vue3-date-time-picker';
  import 'vue3-date-time-picker/dist/main.css'

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

      loadAccount: function(){
        this.$router.push({name: "account"});
      },

      loadOut: function(){
        localStorage.clear();
        alert("Sesión terminada");
        this.verifyAuth();

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

      loadCreateDep: function(){
        this.$router.push({name: "createDep"});
      },

      loadCreateIps: function(){
        this.$router.push({name: "createIps"});
      },

      loadCreatePrueba: function(){
        this.$router.push({name: "createPrueba"});
      },    
  
      loadDetailPrueba: function(){
        this.$router.push({name: "detailPrueba"});
      },
      
      loadIpsDepList: function(){
        this.$router.push({name: "ipsDepList"});
      },

      loadUpdatePrueba: function(){
        this.$router.push({name: "updatePrueba"});
      },
      
      loadFilterByIpsDep: function(){
        this.$router.push({name: "filterByIpsDep"});
      },

      loadFilterByIps: function(){
        this.$router.push({name: "filterByIps"});
      },

       loadFilterByDepartamento: function(){
        this.$router.push({name: "filterByDepartamento"});
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

      completedCreateDep: function(){
        alert("Registro exitoso");
      },

      completedCreateIps: function(){
        alert("Registro exitoso");
      },

      completedCreatePrueba: function(){
        alert("Registro exitoso");
      },

      completedUpdatePrueba: function(){
        alert("Actualización exitosa");
      },

      completedDeletePrueba: function(){
        alert("El registro ha sido eliminado");
      },
    },




    

    created: function(){
      this.verifyAuth();
    }
  }
</script>


<style>
  body {
    margin: 0;
    padding: 0;
    max-width: 0 0 0 0;
  }

  .header{
    width: 100%;
    height: 10vh;
    min-height: 100px;
    background-color: #1c819b;
    color:#ffffff ;
    display: inline-flex;
    justify-content: center;
    text-align: center;
    position: relative;
  }
  .header h1{
    width: 80%;
    text-align: center;
    align-items: center;
    padding: 0 0 0 19%;
    position: relative;
    bottom: 20%;
  }
  .header nav {
    height: 100%;
    width: 25%;
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
    font-size: 18px;
  }
  .header nav button:hover{
    color: #283747;
    background: #E5E7E9;
    border: 1px solid #E5E7E9;
  }
  .main-component{
    margin: 0;
    padding: 0;
    height: 75vh;
    margin: 0%;
    padding: 0%;
    background: #acacac ;
    align-content: center;
  }

  .containerLoginUser form input{
    font-size: 20px;
  }

  .containerLoginUser form button{
    font-size: 20px;
  }

  .footer{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 15vh;
    min-height: 20px;
    background-color: #313131;
    color: #ffffff;
  }
  .footer h4{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @import url(//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css);

  @import url(https://fonts.googleapis.com/css?family=Titillium+Web:300);

  .fa-2x {
    font-size: 2em;
  }

  .fa {
    position: relative;
    display: table-cell;
    width: 60px;
    height: 36px;
    text-align: center;
    vertical-align: middle;
    font-size:25px;
  }

  .main-menu:hover,nav.main-menu.expanded {
    width:250px;
    overflow:visible;
  }

  .main-menu {
    background:#313131;
    border-right:1px solid #313131;
    border-bottom: 1px solid #313131;
    position:absolute;
    top:0;
    bottom:0;
    height:100%;
    left:0;
    width:60px;
    overflow:hidden;
    -webkit-transition:width .05s linear;
    transition:width .05s linear;
    -webkit-transform:translateZ(0) scale(1,1);
    z-index:1000;
  }

  .main-menu>ul {
    margin:7px 0;
  }

  .main-menu li {
    position:relative;
    display:block;
    width:250px;
  }

  .main-menu li>a {
    position:relative;
    display:table;
    border-collapse:collapse;
    border-spacing:0;
    color:#999;
    font-family: arial;
    font-size: 18px;
    text-decoration:none;
    -webkit-transform:translateZ(0) scale(1,1);
    -webkit-transition:all .1s linear;
    transition:all .1s linear;
  }

  .main-menu .nav-icon {
    position:relative;
    display:table-cell;
    width:60px;
    height:36px;
    text-align:center;
    vertical-align:middle;
    font-size:40px;
  }

  .main-menu .nav-text {
    position:relative;
    display:table-cell;
    vertical-align:middle;
    width:190px;
    font-family: 'Titillium Web', sans-serif;
  }

  .main-menu>ul.logout {
    position:absolute;
    left:0;
    bottom:0;
  }

  .no-touch .scrollable.hover {
    overflow-y:hidden;
  }

  .no-touch .scrollable.hover:hover {
    overflow-y:auto;
    overflow:visible;
  }

  a:hover,a:focus {
    text-decoration:none;
  }

  nav {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    -o-user-select:none;
    user-select:none;
  }

  nav ul,nav li {
    outline:0;
    margin:0;
    padding:0;
  }

  .main-menu li:hover>a,nav.main-menu li.active>a,.dropdown-menu>li>a:hover,.dropdown-menu>li>a:focus,.dropdown-menu>.active>a,.dropdown-menu>.active>a:hover,.dropdown-menu>.active>a:focus,.no-touch .dashboard-page nav.dashboard-menu ul li:hover a,.dashboard-page nav.dashboard-menu ul li.active a {
    color:#fff;
    background-color:#5fa2db;
  }

  .area {
    float: left;
    background: #e2e2e2;
    width: 100%;
    height: 100%;
  }

  @font-face {
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 300;
    src: local('Titillium WebLight'), local('TitilliumWeb-Light'), url(http://themes.googleusercontent.com/static/fonts/titilliumweb/v2/anMUvcNT0H1YN4FII8wpr24bNCNEoFTpS2BTjF6FB5E.woff) format('woff');
  }  

  body {
    width: 100%;
    font: 1.6rem/1.25 "Helvetica Neue", Helvetica, Arial, sans-serif;
    background-color: #f5f5f5;
    color: #4d4d4d;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

</style>
