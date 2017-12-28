$(document).ready(function(){
    $('.delete-excuse').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/excuses/'+id,
            success: function(response){
                alert('Kustutan vabandust..');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});