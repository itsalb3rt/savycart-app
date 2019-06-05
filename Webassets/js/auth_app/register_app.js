var registerApp = new Vue({
    el:'#register-app',
    data:{
        userExitst:false,
        emailExits:false,
        userName:null,
        email:null
    },
    methods:{
        validatedUserName:function () {
            let route = new Route('auth','userAlreadyExists',this.userName);

            axios({
                method: 'get',
                url: route.route,
            }).then(response => {
                console.log(response.data.status);
                if(response.data.status == 'true'){
                    this.userExitst = true;
                }else{
                    this.userExitst = false;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        validatedEmail:function () {
            let route = new Route('auth','emailAlreadyExists');
            let data = new FormData();
            data.append('email',this.email);
            axios({
                method: 'POST',
                url: route.route,
                data:data
            }).then(response => {
                console.log(response.data);
                if(response.data.status == 'true'){
                    this.emailExits = true;
                }else{
                    this.emailExits = false;
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
});