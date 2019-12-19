$(document).ready(function () {
    console.log("dashboard.js is connected");

    $(".goaldelete").on("click", function (event) {
        event.preventDefault();
        console.log(`delete button clicked at id ${$(this).data("goalid")}`);
        let id = $(this).data("goalid");
        let dataObj = {
            GoalId: id
        };
        $
            .ajax(`/api/goal/${id}`, {
                type: "DELETE",
                data: dataObj
            }).then(function () {
                console.log(`goal ${id} deleted`);
                location.reload();
            })
    });

    $(".goaldone").on("click", function (event) {
        event.preventDefault();
        console.log(`goal done button clicked at id ${$(this).data("goalid")}`);
        let id = $(this).data("goalid");
        let dataObj = {
            completed: 1
        };
        $
            .ajax(`/api/goal/${id}`, {
                type: "PUT",
                data: dataObj
            }).then(function () {
                console.log(`goal ${id} completed`);
                location.reload();
            });
    }); 


}); 


