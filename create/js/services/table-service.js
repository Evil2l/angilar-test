(function () {
    angular
        .module("myApp")
        .service('tableService', [
            '$http',
            tableService
        ]);

    function tableService($http) {
        var vm = this;
        function editRow(data, check) {
            data.selected = !data.selected;
            check = true;
        }

        function saveRow(data, check, url) {
            data.selected = !data.selected;
            //$http.post('http://localhost:3000/user', url).then();
            check = false;
        }

        function alertData (data){
            alert(data);
        }

        function sendChanges(dataBase) {
            $http.post('http://localhost:3000', dataBase)
                .then(
                    function (response) {
                        console.log(response);
                    },
                    function (err) {
                        console.log(err);
                    })
        }

        function addRow(dataBase) {
            var newOne = {
                name: vm.name, password: vm.password, token: vm.token
            };

            dataBase.push(newOne);
        }

        return {
            EditRow: editRow,
            SaveRow: saveRow,
            SendChanges: sendChanges,
            AddRow: addRow,
            AlertData: alertData
        }
    }
})();
