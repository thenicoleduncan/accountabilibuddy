$(document).ready(function(){
    console.log("tasks.js is connected"); 

    $(".taskdelete").on("click", function (event) {
        event.preventDefault();
        console.log(`task button clicked at id ${$(this).data("taskid")}`);
        let id = $(this).data("taskid");
        let dataObj = {
            GoalId: id
        };
        $
            .ajax(`/api/task/${id}`, {
                type: "DELETE",
                data: dataObj
            }).then(function () {
                console.log(`task ${id} deleted`);
                location.reload();
            })
    });

    $(".taskdone").on("click", function (event) {
        event.preventDefault();
        console.log(`task done button clicked at id ${$(this).data("taskid")}`);
        let id = $(this).data("taskid");
        let dataObj = {
            completed: 1
        };
        $
            .ajax(`/api/task/${id}`, {
                type: "PUT",
                data: dataObj
            }).then(function () {
                console.log(`task ${id} completed`);
                location.reload();
            });
    }); 


    $(".taskpriority").on("click", function (event) {
        event.preventDefault();
        console.log(`task priority button clicked at id ${$(this).data("taskid")}`);
        let id = $(this).data("taskid");
        let dataObj = {
            priority: 1
        };
        $
            .ajax(`/api/task/${id}`, {
                type: "PUT",
                data: dataObj
            }).then(function () {
                console.log(`task ${id} completed`);
                location.reload();
            });
    }); 

    
}); 